"use client";

import { motion, stagger, Variants } from "motion/react";
import { posts } from "@/lib/blog-data";

export default function Blog() {
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
    hidden: { opacity: 0, filter: "blur(2px)", y: 10 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.6,
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
        <h1 className="text-2xl font-semibold">Thoughts</h1>
        <svg
          className="absolute left-0 bottom-0 top-7 w-20"
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

      {/* Intro */}
      <motion.p
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="text-sm text-muted-text"
      >
        writing about open source, graphics programming, and building things
      </motion.p>

      {/* Blog post list */}
      <motion.div
        variants={parentVariant}
        initial="hidden"
        whileInView="show"
        className="flex flex-col mt-2"
      >
        {posts.map((post) => (
          <motion.div
            key={post.title}
            variants={childVariant}
            className="flex flex-col gap-1 editorial-divider py-5 first:pt-0"
          >
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-base font-semibold ${
                  post.slug === null
                    ? "text-muted-text/50 cursor-not-allowed"
                    : "text-foreground hover:text-accent transition-colors cursor-pointer"
                }`}
              >
                {post.title}
              </h3>
              {post.slug === null && (
                <span className="text-xs text-muted-text italic whitespace-nowrap mt-0.5">
                  Coming soon
                </span>
              )}
            </div>

            <p className="text-xs text-muted-text">{post.date}</p>

            {/* Tags — inline editorial style */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-1">
              {post.tags.map((tag, index) => (
                <span key={tag} className="inline-flex items-center">
                  <span className="editorial-tag font-medium">{tag}</span>
                  {index < post.tags.length - 1 && (
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
