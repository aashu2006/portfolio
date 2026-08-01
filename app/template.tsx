"use client";
/**
 * Route-level enter transition. `template.tsx` remounts on every navigation
 * (unlike `layout.tsx`), so this animation replays each time a page changes.
 */

import { motion } from "motion/react";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      {children}
    </motion.div>
  );
}
