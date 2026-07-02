"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { IdatenAnimation } from "./idaten-animation";

const techIcons = [
  { name: "JavaScript", slug: "js" },
  { name: "Python", slug: "python" },
  { name: "C++", slug: "cpp" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Express.js", slug: "express" },
  { name: "p5.js", slug: "p5js" },
  { name: "WebGL", slug: "threejs" },
  { name: "Kubernetes", slug: "kubernetes" },
  { name: "Docker", slug: "docker" },
  { name: "Linux", slug: "linux" },
  { name: "Git", slug: "git" },
  { name: "Firebase", slug: "firebase" },
  { name: "MongoDB", slug: "mongodb" },
];

export const About = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Avatar + Name/Tagline row */}
      <div className="flex flex-col md:flex-row gap-1">
        <motion.div
          initial={{ opacity: 0, filter: "blur(2px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-full flex-shrink-0 p-1"
          style={{ border: "1px solid var(--hairline)" }}
        >
          <Image
            src="/avatar.jpg"
            fill
            sizes="(max-width: 768px) 96px, 112px"
            alt="Akshat Patil"
            className="object-cover rounded-full"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(2px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col gap-1 md:gap-2 p-2 md:p-3"
        >
          <h1 className="text-3xl md:text-4xl font-semibold">
            akshat
            <span className="md:hidden"> patil</span>
          </h1>
          <h2 className="text-base font-normal text-muted-text">
            19, CS undergrad, currently learning{" "}
            <span className="border-foreground border-b border-dashed font-medium text-foreground">
              LLMs
            </span>{" "}
            to become an AI engineer. PF Micrograntee &apos;26, building
            things, contributing to open source, figuring it out
          </h2>
          <motion.p
            initial={{ opacity: 0, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-base text-muted-text mt-1"
          >
            also making videos on{" "}
            <a
              href="https://www.youtube.com/@softaspause"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-4 hover:text-foreground transition-colors"
            >
              youtube
            </a> :)
          </motion.p>
        </motion.div>
      </div>

      {/* Bullet 1 — ink dot */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-row gap-3 items-start mt-2"
      >
        <div className="mt-2 min-w-2 min-h-2 w-2 h-2 rounded-full bg-foreground animate-pulse-dot" />
        <p className="text-base text-muted-text">
          much like Sho Yamato running towards the finish line, I'm curious enough to keep learning and stubborn enough to keep building.
        </p>
      </motion.div>

      {/* Bullet 2 — tech stack */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="flex flex-row gap-3 items-start"
      >
        <div className="mt-2 min-w-2 min-h-2 w-2 h-2 rounded-full bg-foreground animate-pulse-dot" />
        <p className="text-base text-muted-text">technologies i work with</p>
      </motion.div>

      {/* Tech stack — skill icons row */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex flex-wrap gap-3 mt-2 ml-5"
      >
        {techIcons.map((tech, i) => (
          <motion.div
            key={tech.slug}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="group relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://skillicons.dev/icons?i=${tech.slug}`}
              alt={tech.name}
              className="w-10 h-10 md:w-12 md:h-12 transition-transform duration-200 group-hover:scale-110"
            />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-muted-text font-medium">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.blockquote
        initial={{ opacity: 0, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        className="border-l-2 pl-6 mt-4"
        style={{ borderColor: "var(--accent)" }}
      >
        <p className="text-xl italic font-normal leading-relaxed text-muted-text">
          &ldquo;AI, deep learning, machine learning, whatever you are doing,
          if you do not understand it, learn it.&rdquo;
        </p>
        <cite
          className="block mt-3 text-sm not-italic font-medium"
          style={{ color: "var(--accent)" }}
        >
          — Mark Cuban
        </cite>
      </motion.blockquote>

      {/* Idaten Jump footer animation */}
      <IdatenAnimation />
    </div>
  );
};
