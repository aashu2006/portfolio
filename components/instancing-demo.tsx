"use client";

import { useEffect, useRef, useState } from "react";
import type {
  InstancedMesh,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

/** Trees in the forest. Each one is a trunk plus a stack of foliage cones. */
const TREE_COUNT = 500;

/** Stacked cones per tree. More layers reads more like a conifer. */
const LAYERS_PER_TREE = 3;

const FOLIAGE_COUNT = TREE_COUNT * LAYERS_PER_TREE;

/** How far the forest spreads from the centre, in world units. */
const FOREST_RADIUS = 40;

const TRUNK_HEIGHT = 1.8;
const CONE_HEIGHT = 2.2;

/** Every trunk base rests on this plane. */
const GROUND_Y = -4;

/** Haze colour. Matched to the stage background so the forest melts into it. */
const HAZE = 0xf1eee9;

type Status = "idle" | "loading" | "running" | "unsupported";

/**
 * Deterministic pseudo-random so the forest looks identical on every visit.
 * Math.random() would reshuffle it each load, which makes the scene feel
 * arbitrary rather than like a place.
 */
const makeRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

export const InstancingDemo = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLSpanElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let cleanupScene: (() => void) | null = null;

    const start = async () => {
      setStatus("loading");

      // Dynamic import keeps three out of the main bundle: the page ships no
      // 3D code at all until someone scrolls this section into view.
      const THREE = await import("three");
      if (disposed) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setStatus("unsupported");
        return;
      }

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      // Rolls off the bright sun-facing foliage instead of clipping it flat.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      const scene: Scene = new THREE.Scene();

      // Distance haze, coloured to match the stage. Far trees dissolve into
      // the page rather than stopping at a visible edge, and it hides the rim
      // of the ground disc entirely.
      scene.fog = new THREE.Fog(HAZE, 22, 92);

      const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
        36,
        width / height,
        0.1,
        400
      );

      // Warm low sun plus cool sky bounce: the standard way daylight in
      // woodland actually behaves, and it separates lit from shaded sides.
      scene.add(new THREE.HemisphereLight(0xdfeaff, 0x4a4128, 1.5));
      const sun = new THREE.DirectionalLight(0xfff0d6, 2.6);
      sun.position.set(30, 26, 14);
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xc8dcff, 0.5);
      fill.position.set(-22, 10, -26);
      scene.add(fill);

      const random = makeRandom(20260814);
      const dummy = new THREE.Object3D();
      const color = new THREE.Color();

      // --- ground -------------------------------------------------------
      const groundGeometry = new THREE.CircleGeometry(150, 48);
      const groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x6f6a4e,
      });
      const ground: Mesh = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = GROUND_Y;
      scene.add(ground);

      // --- trunks -------------------------------------------------------
      const trunkGeometry = new THREE.CylinderGeometry(
        0.13,
        0.2,
        TRUNK_HEIGHT,
        6
      );
      const trunkMaterial = new THREE.MeshLambertMaterial();
      const trunks: InstancedMesh = new THREE.InstancedMesh(
        trunkGeometry,
        trunkMaterial,
        TREE_COUNT
      );

      // --- foliage ------------------------------------------------------
      const coneGeometry = new THREE.ConeGeometry(0.95, CONE_HEIGHT, 8);
      const coneMaterial = new THREE.MeshLambertMaterial();
      const foliage: InstancedMesh = new THREE.InstancedMesh(
        coneGeometry,
        coneMaterial,
        FOLIAGE_COUNT
      );

      const bark = new THREE.Color("#4a3728");
      const deepGreen = new THREE.Color("#2f4f1f");
      const freshGreen = new THREE.Color("#6f9a3f");

      let layerIndex = 0;

      for (let i = 0; i < TREE_COUNT; i += 1) {
        // sqrt keeps the distribution even across the disc instead of
        // bunching everything toward the middle.
        const radius = Math.sqrt(random()) * FOREST_RADIUS;
        const angle = random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.55 + random() * 1.15;

        // A few degrees of lean. Perfectly upright reads as a spreadsheet.
        const leanX = (random() - 0.5) * 0.1;
        const leanZ = (random() - 0.5) * 0.1;
        const spin = random() * Math.PI * 2;

        dummy.position.set(x, GROUND_Y + (TRUNK_HEIGHT * scale) / 2, z);
        dummy.rotation.set(leanX, spin, leanZ);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        trunks.setMatrixAt(i, dummy.matrix);

        color.copy(bark).multiplyScalar(0.75 + random() * 0.5);
        trunks.setColorAt(i, color);

        // Each tree gets its own place on the green ramp, so a tree is one
        // colour top to bottom rather than a rainbow of layers.
        const greenMix = random();
        const trunkTop = GROUND_Y + TRUNK_HEIGHT * scale;

        for (let layer = 0; layer < LAYERS_PER_TREE; layer += 1) {
          const layerScale = scale * (1 - 0.2 * layer);
          const y =
            trunkTop +
            layer * (CONE_HEIGHT * scale * 0.36) +
            (CONE_HEIGHT * layerScale) / 2;

          dummy.position.set(x, y, z);
          dummy.rotation.set(leanX, spin, leanZ);
          dummy.scale.set(layerScale, layerScale, layerScale);
          dummy.updateMatrix();
          foliage.setMatrixAt(layerIndex, dummy.matrix);

          color.copy(deepGreen).lerp(freshGreen, greenMix);
          // Lower layers sit under the ones above, so they read darker.
          color.multiplyScalar(0.72 + layer * 0.15);
          foliage.setColorAt(layerIndex, color);

          layerIndex += 1;
        }
      }

      trunks.instanceMatrix.needsUpdate = true;
      if (trunks.instanceColor) trunks.instanceColor.needsUpdate = true;
      foliage.instanceMatrix.needsUpdate = true;
      if (foliage.instanceColor) foliage.instanceColor.needsUpdate = true;
      scene.add(trunks);
      scene.add(foliage);

      // Low and close: from up high a forest is a field of triangles seen from
      // above. Near canopy height you get trees in front of trees, which is
      // the whole point of drawing this many.
      const orbit = (elapsed: number) => {
        const angle = elapsed * 0.14;
        camera.position.set(
          Math.cos(angle) * 42,
          -0.4,
          Math.sin(angle) * 42
        );
        camera.lookAt(0, -1.2, 0);
      };

      const totalInstances = TREE_COUNT + FOLIAGE_COUNT;

      const writeStats = (fps: number | null) => {
        if (!statsRef.current) return;
        const calls = renderer.info.render.calls;
        statsRef.current.textContent =
          `${totalInstances.toLocaleString()} instances · ` +
          `${calls} draw call${calls === 1 ? "" : "s"}` +
          (fps === null ? "" : ` · ${fps} fps`);
      };

      const resize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);

      setStatus("running");

      if (reducedMotion) {
        orbit(3.4);
        renderer.render(scene, camera);
        writeStats(null);
      } else {
        let raf = 0;
        let frames = 0;
        let fpsWindowStart = 0;
        let fps = 0;
        let running = true;

        const loop = (now: number) => {
          if (disposed) return;
          raf = requestAnimationFrame(loop);
          if (!running) return;

          orbit(now / 1000);
          renderer.render(scene, camera);

          frames += 1;
          if (now - fpsWindowStart >= 500) {
            fps = Math.round((frames * 1000) / (now - fpsWindowStart));
            frames = 0;
            fpsWindowStart = now;
            writeStats(fps);
          }
        };

        const onVisibility = () => {
          running = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibility);

        const activity = new IntersectionObserver(
          ([entry]) => {
            running = entry.isIntersecting && !document.hidden;
          },
          { threshold: 0 }
        );
        activity.observe(mount);

        raf = requestAnimationFrame(loop);

        cleanupScene = () => {
          cancelAnimationFrame(raf);
          document.removeEventListener("visibilitychange", onVisibility);
          activity.disconnect();
        };
      }

      const stopAnimation = cleanupScene;
      cleanupScene = () => {
        stopAnimation?.();
        resizeObserver.disconnect();
        groundGeometry.dispose();
        groundMaterial.dispose();
        trunkGeometry.dispose();
        trunkMaterial.dispose();
        coneGeometry.dispose();
        coneMaterial.dispose();
        trunks.dispose();
        foliage.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };

      // The effect can unmount while the dynamic import is still in flight, in
      // which case its cleanup already ran against a null cleanupScene and this
      // renderer would leak. Tear it down here instead.
      if (disposed) {
        cleanupScene();
        cleanupScene = null;
      }
    };

    // Nothing loads until the section is near the viewport.
    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trigger.disconnect();
        void start();
      },
      { rootMargin: "200px" }
    );
    trigger.observe(mount);

    return () => {
      disposed = true;
      trigger.disconnect();
      cleanupScene?.();
    };
  }, []);

  return (
    <figure className="demo">
      <div className="demo-stage" ref={mountRef} aria-hidden="true">
        {status !== "running" && (
          <span className="demo-placeholder">
            {status === "unsupported"
              ? "WebGL unavailable"
              : "a forest, drawn in three calls"}
          </span>
        )}
      </div>
      <figcaption className="demo-caption">
        <span ref={statsRef}>2,000 instances · 3 draw calls</span>
        <span className="demo-note">
          {" "}
          &middot; {TREE_COUNT} trees, each a trunk and {LAYERS_PER_TREE}{" "}
          stacked cones, batched into one mesh per geometry and positioned
          entirely on the GPU. This is what{" "}
          <a href="https://medium.com/processing-foundation/drawing-a-forest-in-one-line-a-preview-of-instancing-in-p5-strands-a2e93f9c9e04">
            instances(500)
          </a>{" "}
          does in p5.strands.
        </span>
      </figcaption>
    </figure>
  );
};
