"use client";

import { motion, stagger, Variants } from "motion/react";
import { ossWork } from "@/lib/oss-data";
import { ExternalLink } from "lucide-react";

export default function Work() {
  const parentVariant: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.1, {
          startDelay: 0.6,
          from: "first",
          ease: "easeIn",
        }),
      },
    },
  };

  const childVariant: Variants = {
    hidden: { opacity: 0, filter: "blur(2px)", y: 20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeIn",
      },
    },
  };

  return (
    <>
      {/* Section heading with animated SVG wavy underline */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-fit"
      >
        <h1 className="text-2xl font-semibold">Work</h1>
        <svg
          className="absolute left-0 bottom-0 top-7 w-14"
          height="8"
          viewBox="0 0 200 10"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 8 Q50 4 100 6 T200 8"
            stroke="var(--accent)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.3, ease: "easeIn" }}
          />
        </svg>
      </motion.div>

      {/* Intro line */}
      <motion.p
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="text-sm text-muted-text"
      >
        contributions across graphics, cloud-native, and blockchain tooling
      </motion.p>

      {/* OSS contribution rows — no boxes, hairline dividers */}
      <motion.div
        variants={parentVariant}
        initial="hidden"
        whileInView="show"
        className="flex flex-col mt-2"
      >
        {ossWork.map((work) => (
          <motion.div
            key={work.project}
            variants={childVariant}
            className="flex flex-col gap-2 py-8 editorial-divider relative group"
          >
            {/* External link icon (top right) */}
            <a
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-8 right-0 inline-flex items-center justify-center p-2.5 -m-2.5 text-muted-text hover:text-accent transition-colors"
            >
              <ExternalLink size={16} />
            </a>

            {/* Org + Project name */}
            <div>
              <p className="text-xs text-muted-text uppercase tracking-wider">
                {work.org}
              </p>
              <h3 className="text-base font-semibold">{work.project}</h3>
            </div>

            {/* Role — simple italic text, no badge box */}
            <span className="text-sm italic text-muted-text">
              {work.role}
            </span>

            {/* Description */}
            <p className="text-sm text-muted-text">{work.description}</p>

            {/* Tags — inline editorial style */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-1">
              {work.tags.map((tag, index) => (
                <span key={tag} className="inline-flex items-center">
                  <span className="editorial-tag font-medium">{tag}</span>
                  {index < work.tags.length - 1 && (
                    <span className="text-muted-text/30 mx-1.5 select-none">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
