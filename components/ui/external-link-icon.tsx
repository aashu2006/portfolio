"use client";

import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "@/types";
import { motion, useAnimate } from "motion/react";

const ExternalLinkIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".external-arrow",
        { x: 2, y: -2, scale: 1.1 },
        { duration: 0.3, ease: "easeOut" }
      );
      animate(
        ".external-box",
        { scale: 0.95 },
        { duration: 0.3, ease: "easeOut" }
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".external-arrow",
        { x: 0, y: 0, scale: 1 },
        { duration: 0.2, ease: "easeOut" }
      );
      animate(
        ".external-box",
        { scale: 1 },
        { duration: 0.2, ease: "easeOut" }
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({ start, stop }));

    return (
      <div
        ref={scope}
        className={className}
        onMouseEnter={start}
        onMouseLeave={stop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.g className="external-box">
            <path d="M15 3h6v6" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </motion.g>
          <motion.g className="external-arrow">
            <path d="M21 3l-8.5 8.5" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

ExternalLinkIcon.displayName = "ExternalLinkIcon";

export default ExternalLinkIcon;
