export interface Project {
  title: string;
  description: string;
  imagePath: string;
  liveLink: string;
  githubLink: string;
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: "Split-it-Wise",
    description:
      "Group expense splitter built for my hostel floor. Real users, real splits.",
    imagePath: "/split-it-wise.png",
    liveLink: "",
    githubLink: "https://github.com/aashu2006/split-it-wise",
    techStack: ["Next.js", "Firebase", "TailwindCSS", "TypeScript"],
  },
  {
    title: "File-Lens",
    description:
      "Local storage analyzer - find what's eating your disk space.",
    imagePath: "/file-lens.png",
    liveLink: "",
    githubLink: "https://github.com/aashu2006/file-lens",
    techStack: ["Flask", "Python"],
  },
  {
    title: "Know-Your-Plate",
    description:
      "Food nutrition visualizer. Scan what you eat, understand what it does.",
    imagePath: "/know-your-plate.png",
    liveLink: "",
    githubLink: "https://github.com/aashu2006/know-your-plate",
    techStack: ["React.js", "TailwindCSS"],
  },
];
