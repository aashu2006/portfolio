import { Fragment } from "react";
import Image from "next/image";
import { ossWork } from "@/lib/oss-data";
import { projects } from "@/lib/projects-data";
import { posts } from "@/lib/blog-data";
import { ContactForm } from "@/components/contact-form";
import { InstancingDemo } from "@/components/instancing-demo";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubIcon, GlobeIcon, XIcon } from "@/components/icons";

const toolkit = [
  { label: "Languages", items: ["JavaScript", "Python", "Go"] },
  {
    label: "AI/ML & LLMs",
    items: [
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "scikit-learn",
      "TensorFlow",
      "LLM API Integration",
      "RAG",
      "Supervised Learning",
      "Neural Network Fundamentals",
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
 * Just the two marks, no labels. YouTube and my address are left out because
 * the bio and the Get in Touch section already link them, and a second copy in
 * the header earns nothing.
 *
 * The resume is deliberately NOT here. It sits in Get in Touch instead, so it
 * is found by someone who read far enough to want it rather than offered to
 * every passing visitor. Do not promote it back to the masthead.
 *
 * Icons for LinkedIn, YouTube and Mail are still in components/icons.tsx if
 * any of them are ever wanted back.
 */
const socials = [
  { label: "GitHub", href: "https://github.com/aashu2006", Icon: GitHubIcon },
  { label: "X", href: "https://x.com/softaspause", Icon: XIcon },
];

const currently = [
  "building the WebGPU instancing API for p5.strands as a Processing Foundation micrograntee",
  "reviewing PRs as a p5.js steward",
  "learning LLMs and the engineering around them, alongside ML foundations (supervised learning, neural nets from scratch in NumPy)",
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
              <a href={href} aria-label={label}>
                <Icon />
              </a>
            </li>
          ))}
        </ul>

        {/* The one credential worth stating up front rather than leaving to
            be discovered three paragraphs into the bio. */}
        <span className="badge">
          Processing Foundation Micrograntee &rsquo;26
        </span>
      </div>

      <p>
        <strong>Hello! </strong> I&apos;m a CS undergrad from Indore, studying
        in Bengaluru. Open-source contributor and graphics tinkerer, currently
        working my way into machine learning.
      </p>

      <h2 id="bio">Bio</h2>

      <div className="bio">
        <div className="blurb">
            {/* These numbers size the box, not the file. `.blurb img` crops
              to fill it, so a replacement photo of any shape stays
              undistorted. */}
          <Image
            src="/avatar.jpg"
            width={240}
            height={181}
            alt="Akshat Patil"
            priority
          />
          <p>Akshat Patil, 2026.</p>
        </div>

        <div className="bio-text">
          <p>
            Akshat is 19 and from Indore, now a sophomore studying computer
            science in Bengaluru and graduating in 2029. He is learning{" "}
            <strong>LLMs</strong> with the aim of working as an AI engineer. Since
            2025 he has worked on{" "}
            <a href="https://github.com/processing/p5.js">p5.js</a> at the{" "}
            <strong>Processing Foundation</strong>, where he is now a steward on the
            project and a 2026 micrograntee building the WebGPU instancing API for
            p5.strands. He also contributes to{" "}
            <a href="https://github.com/kubestellar/kubestellar">KubeStellar</a>{" "}
            under the CNCF, the Linux Foundation Decentralized Trust{" "}
            <a href="https://github.com/hiero-ledger">Hiero</a> project, and the
            machine-readable{" "}
            <a href="https://github.com/riscv/riscv-unified-db">
              RISC-V specification
            </a>{" "}
            at RISC-V International.
          </p>

          <p>
            His interests sit where graphics programming, systems work, and machine
            learning overlap: rendering pipelines, the plumbing that makes them
            fast, and the models that are starting to sit on top of both. Alongside
            the code he makes videos on{" "}
            <a href="https://www.youtube.com/@softaspause">YouTube</a> about what he
            is learning as he learns it.
          </p>

          <p>
            Much like Sho Yamato running towards the finish line, he is curious
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
            <a href={work.link}>
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
                <a href={project.githubLink}>{project.title}</a>
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
                    >
                      <GlobeIcon />
                    </a>
                  )}
                  <a
                    href={project.githubLink}
                    aria-label={`${project.title} on GitHub`}
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
            <a href={post.url}>{post.title}</a>
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
        <a href="/resume.pdf">resume is here as a PDF</a> if you need it.
      </p>

      <ContactForm />

      <p className="updated">Last updated: August 2026</p>
    </>
  );
}
