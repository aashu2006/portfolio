"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";
import { ossWork } from "@/lib/oss-data";
import { projects } from "@/lib/projects-data";
import { IdatenAnimation } from "./idaten-animation";
import { InkField } from "./ink-field";

/** Grouped rather than a logo wall: reads at a glance and stays on-palette. */
const toolkit = [
  { label: "Languages", items: ["JavaScript", "Python", "C++"] },
  {
    label: "Web",
    items: ["React", "Next.js", "Node.js", "Express", "p5.js"],
  },
  { label: "Graphics", items: ["WebGL", "WebGPU", "GLSL / WGSL"] },
  { label: "Systems", items: ["Kubernetes", "Docker", "Linux", "CI/CD"] },
  { label: "Data", items: ["Firebase", "MongoDB", "MySQL"] },
];

const currently = [
  "building the WebGPU instancing API for p5.strands as a Processing Foundation micrograntee",
  "learning LLMs and the engineering around them",
];

const Reveal = ({
  delay = 0,
  className,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({
  label,
  href,
  linkText,
}: {
  label: string;
  href?: string;
  linkText?: string;
}) => (
  <div className="flex items-center gap-3 mb-5">
    {/* Accent tick, then the label, then a rule running out to the link. */}
    <span
      aria-hidden="true"
      className="w-1 h-1 flex-shrink-0"
      style={{ background: "var(--accent)" }}
    />
    <h2 className="label-micro flex-shrink-0">{label}</h2>
    <span
      aria-hidden="true"
      className="flex-1 h-px"
      style={{ background: "var(--hairline)" }}
    />
    {href && (
      <Link href={href} className="section-link flex-shrink-0">
        {linkText}
        <ArrowUpRight size={13} />
      </Link>
    )}
  </div>
);

/** Dot-separated inline list used for tags and toolkit entries. */
const TagList = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
    {items.map((item, index) => (
      <span key={item} className="inline-flex items-center">
        <span className="editorial-tag">{item}</span>
        {index < items.length - 1 && (
          <span className="text-muted-text/30 mx-1.5 select-none">·</span>
        )}
      </span>
    ))}
  </div>
);

export const About = () => {
  return (
    <div className="relative w-full flex flex-col">
      {/* Instanced particle field, WebGPU where available. Purely ambient. */}
      <InkField className="pointer-events-none absolute -z-10 left-1/2 -translate-x-1/2 -top-40 w-screen max-w-[1500px] h-[540px]" />

      {/* Hero */}
      <Reveal className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 md:w-[72px] md:h-[72px] relative overflow-hidden rounded-full flex-shrink-0"
            style={{ border: "1px solid var(--hairline)" }}
          >
            <Image
              src="/avatar.jpg"
              fill
              sizes="72px"
              alt="Akshat Patil"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="relative w-fit text-4xl md:text-5xl font-semibold tracking-tight leading-none">
              akshat patil
              <svg
                aria-hidden="true"
                className="absolute left-0 -bottom-2 w-full"
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
                  transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                />
              </svg>
            </h1>
            <p className="label-micro">CS undergrad · bengaluru</p>
          </div>
        </div>

        <p className="text-[15px] leading-relaxed text-muted-text max-w-prose">
          19, currently learning{" "}
          <span className="font-medium text-foreground border-b border-dashed border-foreground">
            LLMs
          </span>{" "}
          to become an AI engineer. Processing Foundation Micrograntee &apos;26,
          building things, contributing to open source, figuring it out. Also
          making videos on{" "}
          <a
            href="https://www.youtube.com/@softaspause"
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            youtube
          </a>
          .
        </p>
      </Reveal>

      {/* Currently */}
      <Reveal delay={0.08} className="mt-14">
        <SectionLabel label="Currently" />
        <ul className="flex flex-col gap-3">
          {currently.map((line) => (
            <li key={line} className="flex flex-row gap-3 items-start">
              <span className="mt-[9px] min-w-1.5 min-h-1.5 w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-[15px] leading-relaxed text-muted-text">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Selected work */}
      <Reveal delay={0.14} className="mt-14">
        <SectionLabel label="Open source" href="/work" linkText="all work" />
        <div
          className="flex flex-col"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          {ossWork.map((work) => (
            <a
              key={work.project}
              href={work.link}
              target="_blank"
              rel="noopener noreferrer"
              className="row-marker group flex items-baseline justify-between gap-4 py-3.5 editorial-divider"
            >
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[15px] font-medium group-hover:text-accent transition-colors">
                  {work.project}
                  <span className="text-faint-text font-normal">
                    {" "}
                    / {work.org}
                  </span>
                </span>
                <span className="text-[13px] text-muted-text truncate">
                  {work.role}
                </span>
              </span>
              <span className="text-[13px] text-faint-text whitespace-nowrap tabular-nums">
                {work.period}
              </span>
            </a>
          ))}
        </div>
      </Reveal>

      {/* Projects */}
      <Reveal delay={0.2} className="mt-14">
        <SectionLabel
          label="Projects"
          href="/projects"
          linkText="all projects"
        />
        <div
          className="flex flex-col"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          {projects.slice(0, 2).map((project) => (
            <a
              key={project.title}
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="row-marker group flex flex-col gap-1 py-3.5 editorial-divider"
            >
              <span className="text-[15px] font-medium group-hover:text-accent transition-colors">
                {project.title}
              </span>
              <span className="text-[13px] leading-relaxed text-muted-text">
                {project.description}
              </span>
            </a>
          ))}
        </div>
      </Reveal>

      {/* Toolkit */}
      <Reveal delay={0.26} className="mt-14">
        <SectionLabel label="Toolkit" />
        <dl className="flex flex-col gap-3">
          {toolkit.map((group) => (
            <div
              key={group.label}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
            >
              <dt className="label-micro sm:w-24 sm:flex-shrink-0 sm:pt-1">
                {group.label}
              </dt>
              <dd className="min-w-0">
                <TagList items={group.items} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Closing note + quote */}
      <Reveal delay={0.32} className="mt-14">
        <p className="text-[15px] leading-relaxed text-muted-text">
          much like Sho Yamato running towards the finish line, I&apos;m curious
          enough to keep learning and stubborn enough to keep building.
        </p>

        <blockquote
          className="border-l-2 pl-6 mt-8"
          style={{ borderColor: "var(--accent)" }}
        >
          <p className="text-lg md:text-xl italic leading-relaxed text-muted-text">
            &ldquo;AI, deep learning, machine learning, whatever you are doing,
            if you do not understand it, learn it.&rdquo;
          </p>
          <cite
            className="block mt-3 text-xs not-italic font-medium tracking-wide"
            style={{ color: "var(--accent)" }}
          >
            Mark Cuban
          </cite>
        </blockquote>
      </Reveal>

      <IdatenAnimation />
    </div>
  );
};
