"use client";
/**
 * Page heading with the hand-drawn accent underline.
 * The rule spans the title width instead of a per-page magic number.
 */

import { motion } from "motion/react";

export const SectionHeading = ({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) => {
  return (
    <header className="flex flex-col gap-3 mb-10">
      <motion.h1
        initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-fit text-3xl font-semibold tracking-tight"
      >
        {title}
        <svg
          aria-hidden="true"
          className="absolute left-0 -bottom-1.5 w-full"
          height="8"
          viewBox="0 0 200 10"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 8 Q50 4 100 6 T200 8"
            stroke="var(--accent)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
          />
        </svg>
      </motion.h1>

      {intro && (
        <motion.p
          initial={{ opacity: 0, filter: "blur(3px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="text-sm leading-relaxed text-muted-text max-w-prose"
        >
          {intro}
        </motion.p>
      )}
    </header>
  );
};
