export interface Project {
  title: string;
  description: string;
  githubLink: string;
  techStack: string[];
  /**
   * Path under `public/` to a screenshot. Optional: an entry without one
   * renders as a plain text block. Shoot these 16:9 and at least 480 wide,
   * which is 2x the 240px box they render in. `.shot` in globals.css crops
   * rather than squashes, so a different ratio loses edges instead of
   * distorting.
   */
  image?: string;
}

export const projects: Project[] = [
  {
    title: "Split-it-Wise",
    description:
      "Group expense splitter built for my hostel floor. Real users, real splits.",
    githubLink: "https://github.com/aashu2006/split-it-wise",
    techStack: ["Next.js", "Firebase", "TailwindCSS", "TypeScript"],
    image: "/projects/split-it-wise.png",
  },
  {
    title: "File-Lens",
    description: "Local storage analyzer - find what's eating your disk space.",
    githubLink: "https://github.com/aashu2006/file-lens",
    techStack: ["Flask", "Python"],
    image: "/projects/file-lens.png",
  },
  {
    title: "DocRAG",
    description:
      "Question answering over technical PDFs. Hybrid BM25 and vector retrieval, with every answer cited back to the page it came from.",
    githubLink: "https://github.com/aashu2006/docrag",
    techStack: ["Python", "Streamlit", "ChromaDB", "Gemini"],
    image: "/projects/docrag.png",
  },
  {
    title: "Paro",
    description:
      "Creative AI platform for discovering and sharing generated visuals alongside the prompts behind them.",
    githubLink: "https://github.com/paro-studio/web",
    techStack: ["React", "TypeScript", "Vite", "Supabase", "TailwindCSS"],
    image: "/projects/paro.jpg",
  },
];
