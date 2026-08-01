"use client";
/**
 * Floating dock navigation: editorial serif design.
 * Theme-aware surface, hairline border, magnifying icons, tooltip on hover.
 * Trailing entry toggles light/dark. Subtle whoosh sound on click.
 */

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Search } from "lucide-react";
import { DockItemsType } from "@/types";
import { ReactNode, useRef, useState } from "react";
import { ThemeIcon, toggleTheme } from "./theme-toggle";
import { OPEN_EVENT } from "./command-palette";

/** A dock entry is either a link (nav/social) or an in-page action. */
type DockEntry = {
  title: string;
  icon: ReactNode;
  href?: string;
  socialLink?: boolean;
  onActivate?: () => void;
  /** Falls back to `title`; set it when the tooltip carries a shortcut hint. */
  ariaLabel?: string;
};

const SEARCH_ENTRY: DockEntry = {
  title: "Search  ⌘K",
  ariaLabel: "Search",
  icon: <Search />,
  onActivate: () => window.dispatchEvent(new Event(OPEN_EVENT)),
};

const THEME_ENTRY: DockEntry = {
  title: "Theme",
  ariaLabel: "Toggle theme",
  icon: <ThemeIcon />,
  onActivate: toggleTheme,
};

const playClickSound = () => {
  if (typeof window === "undefined") return;
  const audio = new Audio("/sounds/whoosh.mp3");
  audio.volume = 0.35; // keep it subtle, not jarring
  audio.play().catch(() => {}); // catch autoplay-policy errors silently
};

/** Nav links, then socials, then the actions: separated by hairlines. */
const buildEntries = (items: DockItemsType[]): DockEntry[] => [
  ...items,
  SEARCH_ENTRY,
  THEME_ENTRY,
];

const needsSeparator = (entries: DockEntry[], idx: number) => {
  const current = entries[idx];
  const previous = entries[idx - 1];
  if (!previous) return false;
  // One rule before the action group (search / theme), one before socials.
  if (!current.href) return Boolean(previous.href);
  return Boolean(current.socialLink) && !previous.socialLink;
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItemsType[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    >
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </motion.div>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItemsType[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const entries = buildEntries(items);

  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-3 right-0 flex flex-col gap-2"
          >
            {entries.map((entry, idx) => {
              const isActive = Boolean(
                entry.href && !entry.socialLink && pathname === entry.href
              );

              const inner = (
                <span
                  className="relative h-11 w-11 rounded-full bg-surface-raised flex items-center justify-center hover:text-accent transition-colors [&_svg]:w-5 [&_svg]:h-5"
                  style={{
                    color: isActive ? "var(--accent)" : "var(--foreground)",
                    border: "1px solid var(--hairline)",
                    boxShadow: "var(--shadow-float)",
                  }}
                >
                  {entry.icon}
                  {isActive && (
                    <span
                      className="absolute -bottom-1.5 h-1 w-1 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </span>
              );

              return (
                <motion.div
                  key={entry.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: idx * 0.05 },
                  }}
                  transition={{ delay: (entries.length - 1 - idx) * 0.05 }}
                  className="flex justify-end"
                >
                  <DockLink
                    entry={entry}
                    className="inline-flex items-center justify-center"
                  >
                    {inner}
                  </DockLink>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setOpen(!open);
          playClickSound();
        }}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        className="h-12 w-12 rounded-full bg-surface-raised flex items-center justify-center text-foreground"
        style={{
          border: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-float)",
        }}
      >
        <IconLayoutNavbarCollapse className="h-5 w-5" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItemsType[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();
  const entries = buildEntries(items);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "hidden md:flex items-end gap-3 rounded-2xl px-4 py-3",
        className
      )}
      style={{
        background: "var(--surface)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--hairline)",
        boxShadow: "var(--shadow-float)",
      }}
    >
      {entries.map((entry, idx) => (
        <div key={entry.title} className="flex items-end gap-3">
          {needsSeparator(entries, idx) && (
            <div
              className="w-px h-6 mx-0.5"
              style={{ background: "var(--hairline)" }}
            />
          )}
          <IconContainer
            mouseX={mouseX}
            entry={entry}
            isActive={Boolean(
              entry.href && !entry.socialLink && pathname === entry.href
            )}
          />
        </div>
      ))}
    </motion.div>
  );
};

/** Renders the correct element for an entry: Link, anchor, or button. */
const DockLink = ({
  entry,
  className,
  children,
}: {
  entry: DockEntry;
  className?: string;
  children: ReactNode;
}) => {
  const onClick = () => {
    entry.onActivate?.();
    playClickSound();
  };

  if (!entry.href) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={entry.ariaLabel ?? entry.title}
        className={className}
      >
        {children}
      </button>
    );
  }

  if (entry.socialLink) {
    return (
      <a
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={entry.title}
        onClick={onClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={entry.href}
      aria-label={entry.title}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
};

function IconContainer({
  mouseX,
  entry,
  isActive,
}: {
  mouseX: MotionValue;
  entry: DockEntry;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Flat sizes when the visitor asked for reduced motion: no magnification.
  const box = shouldReduceMotion ? [44, 44, 44] : [40, 56, 40];
  const glyph = shouldReduceMotion ? [20, 20, 20] : [20, 28, 20];

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const width = useSpring(useTransform(distance, [-100, 0, 100], box), spring);
  const height = useSpring(useTransform(distance, [-100, 0, 100], box), spring);
  const iconSize = useSpring(
    useTransform(distance, [-100, 0, 100], glyph),
    spring
  );

  const [hovered, setHovered] = useState(false);

  return (
    <DockLink entry={entry} className="inline-flex items-center justify-center">
      <motion.div
        ref={ref}
        style={{
          width,
          height,
          color: isActive ? "var(--accent)" : "var(--foreground)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-transparent flex items-center justify-center relative hover:text-accent transition-colors"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              transition={{ duration: 0.15 }}
              className="px-2 py-0.5 whitespace-pre rounded-md text-xs font-medium absolute left-1/2 -top-9 w-fit pointer-events-none"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {entry.title}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sizing the wrapper alone left the SVGs at their intrinsic 24px.
            Stretching them to the wrapper is what makes the magnify read. */}
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
        >
          {entry.icon}
        </motion.div>

        {isActive && (
          <span
            className="absolute -bottom-1.5 h-1 w-1 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        )}
      </motion.div>
    </DockLink>
  );
}
