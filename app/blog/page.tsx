"use client";

import { motion, stagger, Variants } from "motion/react";
import { posts } from "@/lib/blog-data";
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
  hidden: { opacity: 0, filter: "blur(3px)", y: 10 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Blog() {
  return (
    <>
      <SectionHeading
        title="Thoughts"
        intro="writing about open source, graphics programming, and building things"
      />

      <motion.div
        variants={parentVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        {posts.map((post) => {
          const published = post.slug !== null;

          return (
            <motion.article
              key={post.title}
              variants={childVariant}
              className="flex flex-col gap-2 editorial-divider py-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  className={`text-lg font-semibold tracking-tight ${
                    published
                      ? "text-foreground hover:text-accent transition-colors cursor-pointer"
                      : "text-muted-text"
                  }`}
                >
                  {post.title}
                </h2>
                <span className="label-micro whitespace-nowrap">
                  {published ? post.date : "Draft"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
                {post.tags.map((tag, index) => (
                  <span key={tag} className="inline-flex items-center">
                    <span className="editorial-tag">{tag}</span>
                    {index < post.tags.length - 1 && (
                      <span className="text-muted-text/30 mx-1.5 select-none">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      <p className="text-[13px] text-faint-text mt-8">
        posts are in progress. check back soon.
      </p>
    </>
  );
}
