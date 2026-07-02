"use client";

import Image from "next/image";
import ExternalLinkIcon from "@/components/ui/external-link-icon";
import GithubIcon from "@/components/ui/github-icon";
import { motion, stagger, Variants } from "motion/react";
import { projects } from "@/lib/projects-data";

export default function Projects() {
  const parentVariant: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.1, {
          startDelay: 0.6,
          from: "first",
          ease: "backIn",
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
        <h1 className="text-2xl font-semibold">Projects</h1>
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

      {/* Project rows — no boxes, hairline dividers */}
      <motion.div
        variants={parentVariant}
        initial="hidden"
        whileInView="show"
        className="flex flex-col mt-2"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            variants={childVariant}
            className="flex flex-col sm:flex-row gap-4 py-8 editorial-divider group"
          >
            {/* Image thumbnail — grayscale → color on hover */}
            <div className="w-full sm:w-36 h-24 sm:h-24 relative overflow-hidden rounded-lg flex-shrink-0">
              <Image
                src={project.imagePath}
                fill
                sizes="(max-width: 640px) 100vw, 144px"
                alt={project.title}
                priority={index === 0}
                className="object-cover transition-all duration-400 ease-out grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-text mt-0.5">
                    {project.description}
                  </p>
                </div>

                {/* Icons */}
                <div className="flex gap-2 flex-shrink-0 text-muted-text">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 -m-2.5 hover:text-accent transition-colors"
                    >
                      <GithubIcon size={18} />
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 -m-2.5 hover:text-accent transition-colors"
                    >
                      <ExternalLinkIcon size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Tech tags — inline editorial style with dot separators */}
              <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-auto">
                {project.techStack.map((tech, index) => (
                  <span key={tech} className="inline-flex items-center">
                    <span className="editorial-tag font-medium">{tech}</span>
                    {index < project.techStack.length - 1 && (
                      <span className="text-muted-text/30 mx-1.5 select-none">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
