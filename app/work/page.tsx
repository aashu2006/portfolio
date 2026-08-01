"use client";

import { motion, stagger, Variants } from "motion/react";
import { ossWork } from "@/lib/oss-data";
import { ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const parentVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.07, { startDelay: 0.15, from: "first" }),
    },
  },
};

const childVariant: Variants = {
  hidden: { opacity: 0, filter: "blur(3px)", y: 12 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Work() {
  return (
    <>
      <SectionHeading
        title="Work"
        intro="contributions across graphics, cloud-native, and blockchain tooling"
      />

      <motion.div
        variants={parentVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        {ossWork.map((work) => (
          <motion.article
            key={work.project}
            variants={childVariant}
            className="flex flex-col gap-2.5 py-7 editorial-divider relative group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="label-micro mb-1.5">{work.org}</p>
                <h2 className="text-lg font-semibold tracking-tight">
                  {work.project}
                </h2>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[13px] text-faint-text whitespace-nowrap tabular-nums">
                  {work.period}
                </span>
                <a
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${work.project} on GitHub`}
                  className="inline-flex items-center justify-center p-2.5 -m-2.5 text-faint-text hover:text-accent transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            <p className="text-[13px] italic text-muted-text font-serif">
              {work.role}
            </p>

            <p className="text-sm leading-relaxed text-muted-text max-w-prose">
              {work.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-1">
              {work.tags.map((tag, index) => (
                <span key={tag} className="inline-flex items-center">
                  <span className="editorial-tag">{tag}</span>
                  {index < work.tags.length - 1 && (
                    <span className="text-muted-text/30 mx-1.5 select-none">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
}
