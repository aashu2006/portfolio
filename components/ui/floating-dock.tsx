"use client";
/**
 * Floating dock navigation — editorial serif design.
 * Soft shadow, hairline border, clean tooltip positioning.
 * Subtle whoosh sound on click.
 */

import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { DockItemsType } from "@/types";
import { useRef, useState } from "react";

const playClickSound = () => {
  if (typeof window !== "undefined") {
    const audio = new Audio("/sounds/whoosh.mp3");
    audio.volume = 0.35; // keep it subtle, not jarring
    audio.play().catch(() => {}); // catch autoplay-policy errors silently
  }
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
      initial={{ opacity: 0, filter: "blur(2px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
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

  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-3 right-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => {
              const Wrapper = item.socialLink ? "a" : Link;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: idx * 0.05 },
                  }}
                  transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                >
                  <Wrapper
                    href={item.href}
                    target={item.socialLink ? "_blank" : undefined}
                    rel={item.socialLink ? "noopener noreferrer" : undefined}
                    onClick={playClickSound}
                    className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-accent transition-colors [&_svg]:w-5 [&_svg]:h-5"
                    style={{
                      border: "1px solid var(--hairline)",
                      boxShadow: "0 4px 20px rgba(28, 22, 16, 0.12)",
                    }}
                  >
                    {item.icon}
                  </Wrapper>
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
        className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground"
        style={{
          border: "1px solid var(--hairline)",
          boxShadow: "0 4px 20px rgba(28, 22, 16, 0.12)",
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

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "hidden md:flex items-end gap-3 rounded-2xl px-4 py-3",
        className
      )}
      style={{
        background: "rgba(247, 243, 234, 0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--hairline)",
        boxShadow: "0 4px 20px rgba(28, 22, 16, 0.12)",
      }}
    >
      {items.map((item, idx) => {
        const prevItem = items[idx - 1];
        const showSeparator =
          item.socialLink && prevItem && !prevItem.socialLink;

        return (
          <div key={item.title} className="flex items-end gap-3">
            {showSeparator && (
              <div
                className="w-px h-6 mx-0.5"
                style={{ background: "var(--hairline)" }}
              />
            )}
            <IconContainer mouseX={mouseX} {...item} />
          </div>
        );
      })}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  socialLink,
}: {
  mouseX: MotionValue;
} & DockItemsType) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-100, 0, 100], [40, 56, 40]);
  const heightTransform = useTransform(distance, [-100, 0, 100], [40, 56, 40]);
  const iconSizeTransform = useTransform(
    distance,
    [-100, 0, 100],
    [20, 28, 20]
  );

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const iconSize = useSpring(iconSizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const Wrapper = socialLink ? "a" : Link;

  return (
    <Wrapper
      href={href}
      target={socialLink ? "_blank" : undefined}
      rel={socialLink ? "noopener noreferrer" : undefined}
      onClick={playClickSound}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-transparent flex items-center justify-center relative text-foreground hover:text-accent transition-colors"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              transition={{ duration: 0.15 }}
              className="px-2 py-0.5 whitespace-pre rounded-md text-xs font-medium absolute left-1/2 -top-9 w-fit pointer-events-none"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Wrapper>
  );
}
