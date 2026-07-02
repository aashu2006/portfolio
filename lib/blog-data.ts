export interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  slug: string | null;
}

export const posts: BlogPost[] = [
  {
    title: "How WebGPU Instancing Works in p5.js",
    date: "Coming soon",
    tags: ["WebGPU", "p5.js", "Open Source"],
    slug: null,
  },
  {
    title: "What 50 Merged PRs Taught Me About Open Source",
    date: "Coming soon",
    tags: ["OSS", "Learning"],
    slug: null,
  },
];
