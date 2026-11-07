import { Fragment } from "react";
import Image from "next/image";
import { ossWork } from "@/lib/oss-data";
import { projects } from "@/lib/projects-data";
import { posts } from "@/lib/blog-data";
import { ContactForm } from "@/components/contact-form";
import { InstancingDemo } from "@/components/instancing-demo";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";

const toolkit = [
  { label: "Languages", items: ["JavaScript", "Python", "Go"] },
  {
    label: "AI/ML & LLMs",
    items: [
      "Machine Learning",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "scikit-learn",
      "TensorFlow",
      "LLM API Integration",
      "RAG",
    ],
  },
  {
    label: "Frameworks/Libraries",
    items: ["React", "Next.js", "Node.js", "Express.js", "p5.js", "Streamlit"],
  },
  {
    label: "Systems & Automation",
    items: ["Kubernetes", "Docker", "Linux", "Git"],
  },
  {
    label: "Databases & API",
    items: ["Firebase/Firestore", "MongoDB", "MySQL", "ChromaDB", "REST APIs"],
  },
  { label: "Graphics/GPU", items: ["WebGL", "WebGPU", "GLSL/WGSL"] },
];

/**
 * Just the marks, no labels. YouTube and my address are left out because
 * the bio and the Get in Touch section already link them, and a second copy in
 * the header earns nothing.
 *
 * The resume is deliberately NOT here. It sits in Get in Touch instead, so it
 * is found by someone who read far enough to want it rather than offered to
 * every passing visitor. Do not promote it back to the masthead.
 *
 * Icons for YouTube and Mail are still in components/icons.tsx if either is
 * ever wanted back.
 */
const socials = [
  { label: "GitHub", href: "https://github.com/aashu2006", Icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/akshatpatil107/",
    Icon: LinkedInIcon,
  },
  { label: "X", href: "https://x.com/softaspause", Icon: XIcon },
];

/** Spread onto every link that leaves the site so it opens in a new tab. */
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const currently = [
  "full stack developer intern at StayIn",
  "profiling shapes & colors performance as p5.js Developer in Residence for the 2.6 release",
  "building Paro Studio: premium design prompts, see the image, copy the prompt",
  "going deeper on LLMs, machine learning and the engineering around AI systems",
];

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <ThemeToggle />

      <h1 className="masthead">akshat patil</h1>

      <div className="intro-meta">
        <ul className="socials">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              {/* No visible text, so the accessible name has to come from the
                  label rather than from the contents. */}
              <a href={href} aria-label={label} {...external}>
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p>
        <strong>Hello! </strong> I&apos;m a CS undergrad from Indore, studying
        in Bengaluru. Open-source contributor and graphics tinkerer, now going
        deeper into machine learning and AI systems.
      </p>

      <h2 id="bio">Bio</h2>

      <div className="bio">
        <div className="blurb">
            {/* These numbers size the box, not the file. `.blurb img` crops
              to fill it, so a replacement photo of any shape stays
              undistorted. */}
          <Image
            src="/portrait.jpg"
            width={240}
            height={181}
            alt="Akshat Patil"
            priority
          />
          <p>Akshat Patil, 2026.</p>
        </div>

        <div className="bio-text">
          <p>
            I&apos;m 20 and from Indore, now a sophomore studying computer
            science in Bengaluru and graduating in 2029. I work as a full stack
            developer intern at{" "}
            <a href="https://stayin.co.in/" {...external}>
              StayIn
            </a>{" "}
            and I&apos;m going deeper into <strong>LLMs</strong>{" "}
            and AI systems, aiming to work as an AI
            engineer. Since 2025 I&apos;ve worked on{" "}
            <a href="https://github.com/processing/p5.js" {...external}>
              p5.js
            </a>{" "}
            at the <strong>Processing Foundation</strong>, where I built the
            WebGPU instancing API for p5.strands that shipped in p5.js 2.4.
            I&apos;m now an org member, a 2026 Processing Foundation software
            grantee, and Developer in Residence for the 2.6 release, working on
            shapes and colors performance. I also build{" "}
            <a href="https://parostudios.in" {...external}>
              Paro Studio
            </a>
            .
          </p>

          <p>
            Along the way I&apos;ve also contributed to{" "}
            <a href="https://github.com/kubestellar/kubestellar" {...external}>
              KubeStellar
            </a>
            ,{" "}
            <a href="https://github.com/hiero-ledger" {...external}>
              Hiero
            </a>
            , the{" "}
            <a href="https://github.com/riscv/riscv-unified-db" {...external}>
              RISC-V Unified DB
            </a>
            ,{" "}
            <a href="https://github.com/Nano-Collective/nanocoder" {...external}>
              NanoCoder
            </a>{" "}
            and{" "}
            <a href="https://github.com/GreedyBear-Project/GreedyBear" {...external}>
              GreedyBear
            </a>{" "}
            (Honeynet).
          </p>

          <p>
            My interests sit where graphics programming, systems work, and machine
            learning overlap: rendering pipelines, the plumbing that makes them
            fast, and the models that are starting to sit on top of both. Alongside
            the code I make videos on{" "}
            <a
              className="yt-pill"
              href="https://www.youtube.com/@softaspause"
              {...external}
            >
              <YouTubeIcon />
              YouTube
            </a>{" "}
            about what I&apos;m learning as I learn it.
          </p>

          <p>
            Much like Sho Yamato running towards the finish line, I&apos;m curious
            enough to keep learning and stubborn enough to keep building.
          </p>
        </div>
      </div>

      <h2 id="currently">Currently</h2>

      <ul>
        {currently.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h2 id="work">Work</h2>

      {ossWork.map((work) => (
        <div key={work.project}>
          <h3>
            <a href={work.link} {...external}>
              {work.project} / {work.org}
            </a>
          </h3>
          <p className="meta">
            {work.role} &middot; {work.period}
          </p>
          <p>{work.description}</p>
          {/* Only the p5.js entry: the demo is evidence for that specific
              claim, not decoration for the section. */}
          {work.project === "p5.js" && <InstancingDemo />}
          <div className="chips">
            {work.tags.map((tag) => (
              <span className="a" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      <h2 id="projects">Projects</h2>

      <div className="projects">
        {projects.map((project) => (
          <article className="card" key={project.title}>
            {/* 16:9 at 2x the ~430px card; these numbers only set the ratio.
                Without `sizes` the browser assumes the image spans the
                viewport and pulls a 1920px file for a 430px box, which on
                these screenshots is around 100KB of waste each. */}
            {project.image && (
              <Image
                className="card-shot"
                src={project.image}
                width={860}
                height={484}
                sizes="(max-width: 800px) 100vw, 430px"
                alt={`Screenshot of ${project.title}`}
              />
            )}
            <div className="card-body">
              <h3>
                <a href={project.githubLink} {...external}>
                  {project.title}
                </a>
                {/* Only claims "Live" when there is a URL behind it. */}
                {project.liveLink && <span className="live">Live</span>}
              </h3>
              <p>{project.description}</p>
              <div className="card-foot">
                <div className="chips">
                  {project.techStack.map((tech) => (
                    <span className="b" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
                {/* Icon-only links, so each needs a label of its own: the
                    project name is in a sibling heading, not in the link. */}
                <span className="card-links">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      aria-label={`${project.title}, live site`}
                      {...external}
                    >
                      <GlobeIcon />
                    </a>
                  )}
                  <a
                    href={project.githubLink}
                    aria-label={`${project.title} on GitHub`}
                    {...external}
                  >
                    <GitHubIcon />
                  </a>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <h2 id="writing">Writing</h2>

      {posts.map((post) => (
        <div key={post.title}>
          <h3>
            <a href={post.url} {...external}>
              {post.title}
            </a>
          </h3>
          <p className="meta">
            {post.publication} &middot; {post.date}
          </p>
          <p>{post.description}</p>
          <div className="chips">
            {post.tags.map((tag) => (
              <span className="a" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      <h2 id="toolkit">Toolkit</h2>

      {/* One grid for the whole section rather than a row each, so the label
          column sizes itself to the longest label and every chip group starts
          on the same line without a hardcoded width. */}
      <div className="kit">
        {toolkit.map((group) => (
          <Fragment key={group.label}>
            <span className="kit-label">{group.label}</span>
            <span className="chips">
              {group.items.map((item) => (
                <span className="c" key={item}>
                  {item}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </div>

      <h2 id="contact">Get in Touch</h2>

      <p>
        Write to me about open source, graphics, or anything you are building.
        Send a message below and it lands in my inbox. If you would rather not
        use a form, mail{" "}
        <a href="mailto:akshatp439@gmail.com">akshatp439@gmail.com</a> directly. My{" "}
        <a href="/resume.pdf" {...external}>
          resume is here as a PDF
        </a>{" "}
        if you need it.
      </p>

      <ContactForm />

      <p className="updated">Last updated: November 2026</p>
    </>
  );
}
