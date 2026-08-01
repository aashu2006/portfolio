"use client";

import Image from "next/image";
import ExternalLinkIcon from "@/components/ui/external-link-icon";
import GithubIcon from "@/components/ui/github-icon";
import { motion, stagger, Variants } from "motion/react";
import { projects } from "@/lib/projects-data";
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

export default function Projects() {
  return (
    <>
      <SectionHeading
        title="Projects"
        intro="things I built because I wanted them to exist"
      />

      <motion.div
        variants={parentVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            variants={childVariant}
            className="flex flex-col sm:flex-row gap-4 sm:gap-5 py-7 editorial-divider group"
          >
            <div
              className="w-full sm:w-40 h-40 sm:h-24 relative overflow-hidden rounded-lg flex-shrink-0"
              style={{ border: "1px solid var(--hairline)" }}
            >
              <Image
                src={project.imagePath}
                fill
                sizes="(max-width: 640px) 100vw, 160px"
                alt={project.title}
                priority={index === 0}
                className="object-cover transition-all duration-500 ease-out grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-text mt-1">
                    {project.description}
                  </p>
                </div>

                <div className="flex gap-3 flex-shrink-0 text-faint-text">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source on GitHub`}
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
                      aria-label={`${project.title} live site`}
                      className="inline-flex items-center justify-center p-2.5 -m-2.5 hover:text-accent transition-colors"
                    >
                      <ExternalLinkIcon size={18} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-auto pt-1">
                {project.techStack.map((tech, techIndex) => (
                  <span key={tech} className="inline-flex items-center">
                    <span className="editorial-tag">{tech}</span>
                    {techIndex < project.techStack.length - 1 && (
                      <span className="text-muted-text/30 mx-1.5 select-none">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
}
