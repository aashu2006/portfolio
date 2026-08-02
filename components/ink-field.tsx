"use client";
/**
 * Ambient ink field behind the hero.
 *
 * Preferred path is WebGPU: a compute pass advects every particle through a
 * flow field in a storage buffer, then one instanced draw call renders all of
 * them. That is the technique this site is here to talk about, so the site
 * runs it rather than describing it. The dispatch is spread across 2D
 * workgroup counts when a 1D dispatch would exceed the device limit, which is
 * the same fix that let p5.strands push past ~65k-workgroup simulations.
 *
 * WebGL2 is the fallback: same look, positions derived analytically in the
 * vertex shader (no compute stage, no state). If neither is available the
 * canvas simply stays empty and the hero looks like it always did.
 */

import { useEffect, useRef } from "react";

/* Tuning. The field is meant to read as paper grain drifting behind the type,
   never as weather. If it competes with the text at all, these are too high. */
const MAX_PARTICLES = 18000;
const MIN_PARTICLES = 2000;
/** Fallback only; the live value comes from --ink-alpha so each theme can
 *  tune it. Cream on near-black reads stronger than ink on paper. */
const INK_ALPHA = 0.38;
/** Dot radius in clip space; clip height is 2 units across the canvas. */
const POINT_RADIUS = 0.005;

const debug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") console.info("[ink-field]", ...args);
};

/** One renderer, whichever backend won. */
type Backend = {
  resize: (width: number, height: number) => void;
  setColor: (rgb: [number, number, number], alpha: number) => void;
  frame: (elapsed: number, delta: number) => void;
  destroy: () => void;
};

/** NOTE: --foreground must stay a 6-digit hex literal. Switching it to rgb(),
 *  oklch() or a 3-digit shorthand makes this silently fall back and the field
 *  renders in the wrong theme's ink with no error. */
const readInk = (): { rgb: [number, number, number]; alpha: number } => {
  const styles = getComputedStyle(document.documentElement);

  const parsedAlpha = Number.parseFloat(
    styles.getPropertyValue("--ink-alpha").trim()
  );
  const alpha = Number.isFinite(parsedAlpha) ? parsedAlpha : INK_ALPHA;

  const hex = styles.getPropertyValue("--foreground").trim().replace("#", "");
  if (hex.length !== 6) return { rgb: [0.11, 0.09, 0.06], alpha };

  return {
    rgb: [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ],
    alpha,
  };
};

const particleCountFor = (width: number, height: number) =>
  Math.max(
    MIN_PARTICLES,
    Math.min(MAX_PARTICLES, Math.floor((width * height) / 45))
  );

/* ------------------------------------------------------------------ WebGPU */

const COMPUTE_WGSL = /* wgsl */ `
struct Particle {
  pos: vec2f,
  vel: vec2f,
  seed: f32,
  size: f32,
  depth: f32,  // 0 = far, 1 = near. Drives scale, alpha, softness, parallax.
  pad: f32,
};

struct Uniforms {
  color: vec4f,
  aspect: f32,
  time: f32,
  dt: f32,
  pointSize: f32,
  count: u32,
  dispatchWidth: u32,
  pad0: f32,
  pad1: f32,
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> u: Uniforms;

fn flow(p: vec2f, t: f32) -> vec2f {
  let a = sin(p.y * 2.7 + t * 0.31) + 0.6 * cos(p.x * 1.9 - t * 0.23);
  let b = cos(p.x * 2.3 - t * 0.27) + 0.6 * sin(p.y * 1.7 + t * 0.19);
  return vec2f(a, b);
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  // Flatten the 2D dispatch back into a linear particle index.
  let index = gid.x + gid.y * u.dispatchWidth * 64u;
  if (index >= u.count) {
    return;
  }

  var p = particles[index];
  // Offsetting the field sample by depth decorrelates the layers, so near and
  // far particles follow different currents instead of moving as one sheet.
  // Not "target": that is a WGSL reserved keyword and fails to compile.
  let steer = flow(p.pos + vec2f(p.depth * 3.1, p.depth * -2.3), u.time)
    * 0.05 * (0.45 + p.seed);
  p.vel = mix(p.vel, steer, 0.05);
  // Parallax: near layers travel faster across the frame than far ones.
  p.pos = p.pos + p.vel * u.dt * mix(0.45, 1.5, p.depth);

  // Wrap slightly outside clip space so re-entry happens off screen.
  if (p.pos.x > 1.2) { p.pos.x = -1.2; }
  if (p.pos.x < -1.2) { p.pos.x = 1.2; }
  if (p.pos.y > 1.2) { p.pos.y = -1.2; }
  if (p.pos.y < -1.2) { p.pos.y = 1.2; }

  particles[index] = p;
}
`;

const RENDER_WGSL = /* wgsl */ `
struct Particle {
  pos: vec2f,
  vel: vec2f,
  seed: f32,
  size: f32,
  depth: f32,  // 0 = far, 1 = near. Drives scale, alpha, softness, parallax.
  pad: f32,
};

struct Uniforms {
  color: vec4f,
  aspect: f32,
  time: f32,
  dt: f32,
  pointSize: f32,
  count: u32,
  dispatchWidth: u32,
  pad0: f32,
  pad1: f32,
};

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<uniform> u: Uniforms;

struct VSOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
  @location(1) alpha: f32,
  @location(2) softness: f32,
};

@vertex
fn vs(
  @builtin(vertex_index) vertexIndex: u32,
  @builtin(instance_index) instanceIndex: u32
) -> VSOut {
  // Two triangles from six indices, no vertex buffer.
  var i = vertexIndex;
  if (i == 3u) { i = 2u; } else if (i == 4u) { i = 1u; } else if (i == 5u) { i = 3u; }
  let corner = vec2f(
    f32(i & 1u) * 2.0 - 1.0,
    f32((i >> 1u) & 1u) * 2.0 - 1.0
  );

  let p = particles[instanceIndex];

  // Cheap perspective: no matrix, just scale and fade by depth. Far particles
  // are small, dim and soft-edged; near ones are large, bright and crisp.
  let persp = mix(0.5, 1.45, p.depth);
  let radius = u.pointSize * p.size * persp;

  var out: VSOut;
  out.position = vec4f(
    p.pos + vec2f(corner.x * radius / u.aspect, corner.y * radius),
    0.0,
    1.0
  );
  out.uv = corner;
  out.alpha = (0.2 + 0.8 * p.seed) * mix(0.28, 1.0, p.depth);
  // Inner edge of the falloff: lower means a softer, more out-of-focus dot.
  out.softness = mix(0.62, 0.22, p.depth);
  return out;
}

@fragment
fn fs(in: VSOut) -> @location(0) vec4f {
  let d = length(in.uv);
  if (d > 1.0) {
    discard;
  }
  let a = smoothstep(1.0, in.softness, d) * in.alpha * u.color.a;
  return vec4f(u.color.rgb * a, a); // premultiplied
}
`;

const UNIFORM_BYTES = 48;

const initWebGPU = async (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  isAlive: () => boolean
): Promise<Backend | null> => {
  if (typeof navigator === "undefined" || !navigator.gpu) return null;

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter || !isAlive()) return null;

  const device = await adapter.requestDevice();
  if (!isAlive()) {
    device.destroy();
    return null;
  }

  // The canvas is deliberately NOT touched yet. A canvas can only ever hand
  // out one context type, so calling getContext("webgpu") here would
  // permanently block the WebGL2 fallback from getting a context if anything
  // below fails. Everything is validated first; the canvas is claimed last.
  const format = navigator.gpu.getPreferredCanvasFormat();

  const count = particleCountFor(width, height);

  // seed the storage buffer
  const stride = 8; // floats per particle
  const seedData = new Float32Array(count * stride);
  for (let i = 0; i < count; i += 1) {
    const o = i * stride;
    seedData[o] = Math.random() * 2.4 - 1.2; // pos.x
    seedData[o + 1] = Math.random() * 2.4 - 1.2; // pos.y
    seedData[o + 2] = 0; // vel.x
    seedData[o + 3] = 0; // vel.y
    seedData[o + 4] = Math.random(); // seed
    seedData[o + 5] = 0.45 + Math.random() * 0.9; // size
    // Biased toward the far plane so the near layer stays sparse and the
    // field keeps receding behind the type rather than crowding it.
    seedData[o + 6] = Math.random() ** 1.6; // depth
  }

  const particleBuffer = device.createBuffer({
    size: seedData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(particleBuffer, 0, seedData);

  const uniformBuffer = device.createBuffer({
    size: UNIFORM_BYTES,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const computeModule = device.createShaderModule({ code: COMPUTE_WGSL });
  const renderModule = device.createShaderModule({ code: RENDER_WGSL });

  // A WGSL error does NOT throw: the module is returned, the pipeline is
  // created, and every draw silently becomes a no-op. Ask each module how it
  // compiled so a shader bug falls through to WebGL2 instead of rendering
  // nothing forever.
  for (const [name, module] of [
    ["compute", computeModule],
    ["render", renderModule],
  ] as const) {
    const info = await module.getCompilationInfo();
    const errors = info.messages.filter((message) => message.type === "error");
    if (errors.length > 0) {
      console.error(
        `[ink-field] ${name} shader failed to compile:`,
        errors
          .map((e) => `line ${e.lineNum}:${e.linePos} ${e.message}`)
          .join("\n")
      );
      particleBuffer.destroy();
      uniformBuffer.destroy();
      device.destroy();
      return null;
    }
  }
  if (!isAlive()) {
    device.destroy();
    return null;
  }

  const computeLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "uniform" },
      },
    ],
  });

  const renderLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "read-only-storage" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: "uniform" },
      },
    ],
  });

  // Pipeline creation validates layouts against the shaders; capture that too.
  device.pushErrorScope("validation");

  const computePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [computeLayout] }),
    compute: { module: computeModule, entryPoint: "main" },
  });

  const renderPipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [renderLayout] }),
    vertex: { module: renderModule, entryPoint: "vs" },
    fragment: {
      module: renderModule,
      entryPoint: "fs",
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: { topology: "triangle-list" },
  });

  const bindings = [
    { binding: 0, resource: { buffer: particleBuffer } },
    { binding: 1, resource: { buffer: uniformBuffer } },
  ];
  const computeBindGroup = device.createBindGroup({
    layout: computeLayout,
    entries: bindings,
  });
  const renderBindGroup = device.createBindGroup({
    layout: renderLayout,
    entries: bindings,
  });

  const validationError = await device.popErrorScope();
  if (validationError || !isAlive()) {
    if (validationError) {
      console.error("[ink-field] pipeline validation:", validationError.message);
    }
    particleBuffer.destroy();
    uniformBuffer.destroy();
    device.destroy();
    return null;
  }

  device.addEventListener("uncapturederror", (event) => {
    console.error(
      "[ink-field] uncaptured GPU error:",
      (event as GPUUncapturedErrorEvent).error.message
    );
  });

  // Everything validated: safe to take the canvas now.
  const context = canvas.getContext("webgpu");
  if (!context) {
    particleBuffer.destroy();
    uniformBuffer.destroy();
    device.destroy();
    return null;
  }
  context.configure({ device, format, alphaMode: "premultiplied" });

  // A 1D dispatch is capped (commonly 65535 groups). Spreading the remainder
  // into the Y dimension is what keeps very large particle counts working.
  const maxPerDimension = device.limits.maxComputeWorkgroupsPerDimension;
  const totalGroups = Math.ceil(count / 64);
  const dispatchWidth = Math.min(totalGroups, maxPerDimension);
  const dispatchHeight = Math.ceil(totalGroups / dispatchWidth);

  const uniforms = new ArrayBuffer(UNIFORM_BYTES);
  const uniformFloats = new Float32Array(uniforms);
  const uniformUints = new Uint32Array(uniforms);
  uniformFloats[3] = INK_ALPHA;
  uniformUints[8] = count;
  uniformUints[9] = dispatchWidth;

  let aspect = width / Math.max(height, 1);
  let destroyed = false;

  return {
    resize(nextWidth, nextHeight) {
      aspect = nextWidth / Math.max(nextHeight, 1);
    },
    setColor([r, g, b], alpha) {
      uniformFloats[0] = r;
      uniformFloats[1] = g;
      uniformFloats[2] = b;
      uniformFloats[3] = alpha;
    },
    frame(elapsed, delta) {
      if (destroyed) return;

      uniformFloats[4] = aspect;
      uniformFloats[5] = elapsed;
      uniformFloats[6] = delta;
      uniformFloats[7] = POINT_RADIUS;
      device.queue.writeBuffer(uniformBuffer, 0, uniforms);

      const encoder = device.createCommandEncoder();

      const compute = encoder.beginComputePass();
      compute.setPipeline(computePipeline);
      compute.setBindGroup(0, computeBindGroup);
      compute.dispatchWorkgroups(dispatchWidth, dispatchHeight);
      compute.end();

      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      pass.setPipeline(renderPipeline);
      pass.setBindGroup(0, renderBindGroup);
      pass.draw(6, count); // one instanced call for every particle
      pass.end();

      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      particleBuffer.destroy();
      uniformBuffer.destroy();
      context.unconfigure();
      device.destroy();
    },
  };
};

/* ------------------------------------------------------------------ WebGL2 */

const VERT_GLSL = `#version 300 es
in vec4 a_seed; // xy = base position, z = per-particle seed, w = depth
uniform float u_time;
uniform float u_aspect;
uniform float u_pointSize;
out float v_alpha;
out float v_softness;

void main() {
  float t = u_time;
  float depth = a_seed.w;
  float persp = mix(0.5, 1.45, depth);
  float parallax = mix(0.45, 1.5, depth);

  vec2 p = a_seed.xy;
  p.x = fract(p.x + t * 0.010 * (0.4 + a_seed.z) * parallax);
  p.y = fract(p.y + t * 0.004);

  vec2 q = p * 2.0 - 1.0;
  float a = sin(q.y * 2.7 + t * 0.31) + 0.6 * cos(q.x * 1.9 - t * 0.23);
  float b = cos(q.x * 2.3 - t * 0.27) + 0.6 * sin(q.y * 1.7 + t * 0.19);
  q += vec2(a, b) * 0.05;

  gl_Position = vec4(q, 0.0, 1.0);
  gl_PointSize =
    u_pointSize * (0.6 + a_seed.z) * persp * clamp(u_aspect, 0.6, 1.6);
  v_alpha = (0.2 + 0.8 * a_seed.z) * mix(0.28, 1.0, depth);
  v_softness = mix(0.62, 0.22, depth);
}
`;

const FRAG_GLSL = `#version 300 es
precision mediump float;
in float v_alpha;
in float v_softness;
uniform vec4 u_color;
out vec4 outColor;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = length(c);
  if (d > 1.0) {
    discard;
  }
  float a = smoothstep(1.0, v_softness, d) * v_alpha * u_color.a;
  outColor = vec4(u_color.rgb * a, a); // premultiplied
}
`;

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const initWebGL2 = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): Backend | null => {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
  });
  if (!gl) return null;

  const vert = compile(gl, gl.VERTEX_SHADER, VERT_GLSL);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG_GLSL);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const count = particleCountFor(width, height);
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i += 1) {
    seeds[i * 4] = Math.random();
    seeds[i * 4 + 1] = Math.random();
    seeds[i * 4 + 2] = Math.random();
    seeds[i * 4 + 3] = Math.random() ** 1.6; // depth, biased far
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, "a_seed");
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const uTime = gl.getUniformLocation(program, "u_time");
  const uAspect = gl.getUniformLocation(program, "u_aspect");
  const uPointSize = gl.getUniformLocation(program, "u_pointSize");
  const uColor = gl.getUniformLocation(program, "u_color");

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let aspect = width / Math.max(height, 1);
  let color: [number, number, number] = [0.11, 0.09, 0.06];
  let inkAlpha = INK_ALPHA;
  let pointSize = 2;
  let destroyed = false;

  return {
    resize(nextWidth, nextHeight) {
      aspect = nextWidth / Math.max(nextHeight, 1);
      pointSize = Math.max(1.1, Math.min(2.2, nextWidth / 900));
      gl.viewport(0, 0, nextWidth, nextHeight);
    },
    setColor(rgb, alpha) {
      color = rgb;
      inkAlpha = alpha;
    },
    frame(elapsed) {
      if (destroyed) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAspect, aspect);
      gl.uniform1f(uPointSize, pointSize);
      gl.uniform4f(uColor, color[0], color[1], color[2], inkAlpha);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.bindVertexArray(null);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
};

/* --------------------------------------------------------------- Component */

export const InkField = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let alive = true;
    let backend: Backend | null = null;
    let raf = 0;
    let visible = true;
    // Accumulated rather than derived from a start stamp: the WebGL2 path
    // computes positions from time, so a clock reset would teleport the field
    // every time the tab regains focus.
    let elapsed = 0;
    let last = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      return { width, height };
    };

    const { width, height } = sizeCanvas();

    const loop = (now: number) => {
      if (!alive || !backend) return;
      if (!last) last = now;
      const delta = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      elapsed += delta;
      backend.frame(elapsed, delta);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (!alive || !backend || raf || reducedMotion) return;
      last = 0; // resume from the accumulated clock, no jump
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => {
      if (document.hidden) pause();
      else if (visible) play();
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) play();
        else pause();
      },
      { rootMargin: "120px" }
    );

    const resizeObserver = new ResizeObserver(() => {
      const next = sizeCanvas();
      backend?.resize(next.width, next.height);
      if (reducedMotion) backend?.frame(0, 0);
    });

    // Repaint on theme change so the ink matches the paper.
    const themeObserver = new MutationObserver(() => {
      const ink = readInk();
      backend?.setColor(ink.rgb, ink.alpha);
      if (reducedMotion) backend?.frame(0, 0);
    });

    const startBackend = (chosen: Backend | null) => {
      if (!alive || !chosen) return;
      backend = chosen;
      backend.resize(canvas.width, canvas.height);
      const ink = readInk();
      backend.setColor(ink.rgb, ink.alpha);

      intersection.observe(canvas);
      resizeObserver.observe(canvas);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      document.addEventListener("visibilitychange", onVisibility);

      if (reducedMotion) backend.frame(0, 0); // one still frame, no loop
      else play();
    };

    initWebGPU(canvas, width, height, () => alive)
      .catch((error) => {
        debug("WebGPU init threw, falling back:", error);
        return null;
      })
      .then((gpu) => {
        if (!alive) {
          gpu?.destroy();
          return;
        }
        if (gpu) {
          debug(`WebGPU active, ${particleCountFor(width, height)} particles`);
          startBackend(gpu);
          return;
        }
        const gl = initWebGL2(canvas, width, height);
        debug(gl ? "WebGL2 fallback active" : "no GPU backend available");
        startBackend(gl);
      })
      .catch((error) => {
        debug("backend start failed:", error);
      });

    return () => {
      alive = false;
      pause();
      intersection.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      backend?.destroy();
      backend = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        // Weighted to the top of the canvas so the ink has thinned out by the
        // time it reaches the name, and is gone entirely by the body copy.
        maskImage:
          "radial-gradient(110% 62% at 50% 4%, #000 0%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(110% 62% at 50% 4%, #000 0%, transparent 72%)",
      }}
    />
  );
};
