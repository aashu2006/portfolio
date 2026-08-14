import Image from "next/image";
import { ossWork } from "@/lib/oss-data";
import { projects } from "@/lib/projects-data";
import { posts } from "@/lib/blog-data";
import { ContactForm } from "@/components/contact-form";

const toolkit = [
  { label: "Languages", items: ["JavaScript", "Python", "C++"] },
  { label: "Web", items: ["React", "Next.js", "Node.js", "Express", "p5.js"] },
  { label: "Graphics", items: ["WebGL", "WebGPU", "GLSL / WGSL"] },
  { label: "Systems", items: ["Kubernetes", "Docker", "Linux", "CI/CD"] },
  { label: "Data", items: ["Firebase", "MongoDB", "MySQL"] },
];

const currently = [
  "building the WebGPU instancing API for p5.strands as a Processing Foundation micrograntee",
  "learning LLMs and the engineering around them",
];

export default function HomePage() {
  return (
    <>
      <h1 className="masthead">akshat patil</h1>

      <p>
        <strong>Hello!</strong> I&apos;m a Bengaluru-based CS undergrad,
        open-source contributor, and graphics tinkerer.
        <br />
        You can find me at{" "}
        <a href="https://github.com/aashu2006">github.com/aashu2006</a>;{" "}
        <a href="https://x.com/softaspause">x.com/softaspause</a>;{" "}
        <a href="https://linkedin.com/in/akshatpatil107">/in/akshatpatil107</a>;{" "}
        <a href="https://www.youtube.com/@softaspause">
          youtube.com/@softaspause
        </a>
        ;
        <br />
        my <a href="/resume.pdf">resume as a PDF</a>; or using the contact form
        below.
      </p>

      <h2>Bio</h2>

      <div className="blurb">
        {/* Source is 1024x771: keep that ratio or the face squashes. */}
        <Image
          src="/avatar.jpg"
          width={240}
          height={181}
          alt="Akshat Patil"
          priority
        />
        <p>Akshat Patil, 2026.</p>
      </div>

      <p>
        Akshat is 19, studying computer science in Bengaluru, and currently
        learning <strong>LLMs</strong> with the aim of working as an AI
        engineer. Since 2025 he has worked on{" "}
        <a href="https://github.com/processing/p5.js">p5.js</a> at the{" "}
        <strong>Processing Foundation</strong>, where he is a 2026 micrograntee
        building the WebGPU instancing API for p5.strands. He also contributes
        to <a href="https://github.com/kubestellar/kubestellar">KubeStellar</a>{" "}
        under the CNCF and to the Linux Foundation Decentralized Trust{" "}
        <a href="https://github.com/hiero-ledger">Hiero</a> project.
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

      <h2>Currently</h2>

      <ul>
        {currently.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h2>Open Source</h2>

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
          <div className="chips">
            {work.tags.map((tag) => (
              <span className="a" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      <h2>Projects</h2>

      {projects.map((project) => (
        <div key={project.title}>
          <h3>
            <a href={project.githubLink}>{project.title}</a>
          </h3>
          <p>{project.description}</p>
          <div className="chips">
            {project.techStack.map((tech) => (
              <span className="b" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}

      <h2>Writing</h2>

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

      <h2>Toolkit</h2>

      {toolkit.map((group) => (
        <div className="kit-row" key={group.label}>
          <span className="kit-label">{group.label}</span>
          <span className="chips">
            {group.items.map((item) => (
              <span className="c" key={item}>
                {item}
              </span>
            ))}
          </span>
        </div>
      ))}

      <h2>Get in Touch</h2>

      <p>
        Write to me about open source, graphics, or anything you are building.
        Send a message below and it lands in my inbox. If you would rather not
        use a form, mail{" "}
        <a href="mailto:akshatp439@gmail.com">akshatp439@gmail.com</a> directly.
      </p>

      <ContactForm />

      <p className="updated">Last updated: August 2026</p>
    </>
  );
}
