"use client";

import { useRef, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/**
 * The theme lives on <html data-theme>, written before paint by the inline
 * script in app/layout.tsx. That element is the source of truth, not React
 * state: this component subscribes to it rather than keeping a second copy
 * that could drift. Anything else that needs the theme, such as the fog
 * colour in the three.js demo, watches the same attribute.
 */
const subscribe = (onChange: () => void) => {
  const root = document.documentElement;

  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  // Follow the OS only while the visitor has expressed no preference of their
  // own. Once they pick a side, their choice outranks it.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    try {
      if (localStorage.getItem("theme")) return;
    } catch {
      // Storage can throw outright in some privacy modes. Following the OS is
      // the right fallback when no stored preference can be read anyway.
    }
    // Writing the attribute trips the observer above, which is what notifies.
    root.dataset.theme = media.matches ? "dark" : "light";
  };
  media.addEventListener("change", onSystemChange);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onSystemChange);
  };
};

const getSnapshot = (): Theme | null =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/**
 * The server cannot know the visitor's theme, so it commits to nothing.
 * useSyncExternalStore renders this during hydration and swaps to the real
 * value immediately after, which is the supported way to render something
 * client-only without tripping a hydration mismatch.
 */
const getServerSnapshot = (): Theme | null => null;

/**
 * One AudioContext for the page, built on the first click rather than at
 * import time: a context created without a user gesture starts suspended and
 * browsers log about it.
 */
let audio: AudioContext | null = null;

/**
 * A short synthesised blip, rather than an audio file. Two oscillators tuned a
 * fifth apart give it a little body, and the pitch rises going light and falls
 * going dark so the two directions are audibly different.
 *
 * Every value here is deliberate. The gain ramps rather than jumps, because a
 * square-edged start or stop on a waveform is heard as a click. The ramps use
 * exponential curves, which cannot reach zero, hence the near-zero endpoints.
 */
const playBlip = (next: Theme) => {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    audio ??= new Ctor();
    // Autoplay policy suspends contexts created before a gesture. This call
    // sits inside a click handler, so resuming here is allowed.
    if (audio.state === "suspended") void audio.resume();

    const now = audio.currentTime;
    const root = next === "dark" ? 392 : 523.25; // G4 going dark, C5 going light
    const master = audio.createGain();
    master.connect(audio.destination);

    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.07, now + 0.012);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    for (const ratio of [1, 1.5]) {
      const osc = audio.createOscillator();
      const voice = audio.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(root * ratio, now);
      // A slight glide in the direction of travel: up into light, down into
      // dark. Subtle, but it is what stops it sounding like a UI beep.
      osc.frequency.exponentialRampToValueAtTime(
        root * ratio * (next === "dark" ? 0.84 : 1.19),
        now + 0.16
      );
      voice.gain.setValueAtTime(ratio === 1 ? 1 : 0.35, now);
      osc.connect(voice).connect(master);
      osc.start(now);
      osc.stop(now + 0.24);
    }
  } catch {
    // Sound is a garnish. A blocked or unavailable AudioContext must never
    // stop the theme from changing.
  }
};

/**
 * The blast. A ring races out from the button while the palette cross-fades
 * under it, so the change reads as radiating from the control that caused it.
 *
 * This deliberately does NOT use the View Transitions API. That API renders
 * its snapshot in a layer above all page content, so an element drawn on top
 * of it is simply invisible for the duration: a ring would stay hidden for the
 * whole animation and surface only once it had already faded out. Owning the
 * animation outright also means Safari and Firefox get the same effect.
 */
const BLAST_MS = 620;
const FADE_MS = 280;

/** Cleans up a blast already in flight so rapid clicks cannot strand one. */
let clearBlast: (() => void) | null = null;

const blast = (origin: { x: number; y: number }) => {
  clearBlast?.();

  const root = document.documentElement;
  const { x, y } = origin;
  // Reach the furthest corner, or the ring stops short of part of the screen.
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // Cross-fades the palette underneath the ring. Scoped to a class and torn
  // down straight after, because leaving a colour transition on the whole
  // document permanently would put a lag on every ordinary hover.
  root.classList.add("theming");

  const ring = document.createElement("div");
  ring.className = "blast-ring";
  ring.style.width = `${radius * 2}px`;
  ring.style.height = `${radius * 2}px`;
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  document.body.appendChild(ring);

  const animation = ring.animate(
    [
      { transform: "translate(-50%, -50%) scale(0)", opacity: 1 },
      { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
    ],
    {
      duration: BLAST_MS,
      // Expo-out: bursts away from the button, then eases as it runs out of
      // screen. A linear ring reads like a loading spinner, not an impact.
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    }
  );

  const timer = window.setTimeout(() => root.classList.remove("theming"), FADE_MS);

  clearBlast = () => {
    window.clearTimeout(timer);
    animation.cancel();
    ring.remove();
    root.classList.remove("theming");
    clearBlast = null;
  };

  animation.finished
    .then(() => clearBlast?.())
    .catch(() => {
      // A cancelled animation rejects. The canceller already cleaned up.
    });
};

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2Z" />
  </svg>
);

export const ThemeToggle = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // A rejected write costs persistence across reloads, nothing more.
    }

    playBlip(next);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    blast({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : 0,
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className="theme-toggle"
      onClick={toggle}
      disabled={theme === null}
      aria-label={theme === null ? "Switch theme" : `Switch to ${next} mode`}
    >
      {/* Renders nothing until the theme is known, which is one frame. The
          button keeps its size regardless, so nothing around it shifts. */}
      {theme === null ? null : theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
