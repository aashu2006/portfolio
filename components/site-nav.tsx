"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/sections";

/**
 * How far down the viewport a heading has to travel before it counts as the
 * current section. Roughly the top eighth: high enough that a heading becomes
 * active as it settles near the top, low enough that it does not flip while
 * still scrolling into view.
 */
const ACTIVE_LINE = 120;

/**
 * Section nav, in two shapes. On a wide screen the 900px column leaves a deep
 * empty margin, and a dot rail lives there: visible, never overlapping the
 * text, and clear of the masthead. There is no margin to use on a narrow
 * screen, so it becomes a slim bar across the top instead. Both are rendered
 * and CSS decides which one is shown, which also keeps the hidden one out of
 * the accessibility tree.
 *
 * The theme toggle is not in here. It is fixed to the top-right corner of the
 * viewport, independent of either shape, so it sits in the same place at every
 * width.
 */
export const SiteNav = () => {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= ACTIVE_LINE) {
          current = heading.id;
        }
      }
      // The last section is usually too short to push its heading past the
      // line, so it could never go active on its own. At the bottom of the
      // page it is unambiguously the one being read.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      setActive(atBottom ? headings[headings.length - 1].id : current);
    };

    // Scheduled rather than called outright: this runs once on mount to catch
    // a page restored mid-scroll, and setState inside an effect body is what
    // a frame callback exists to avoid.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <nav className="rail" aria-label="Sections">
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={active === section.id ? "is-active" : undefined}
                aria-current={active === section.id ? "true" : undefined}
              >
                <span className="rail-dot" aria-hidden="true" />
                <span className="rail-label">{section.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="topnav" aria-label="Sections">
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={active === section.id ? "is-active" : undefined}
                aria-current={active === section.id ? "true" : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
