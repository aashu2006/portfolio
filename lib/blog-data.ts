export interface BlogPost {
  title: string;
  date: string;
  publication: string;
  description: string;
  tags: string[];
  /** Posts live on their publisher's site, so this is always external. */
  url: string;
}

export const posts: BlogPost[] = [
  {
    title: "Drawing a Forest in One Line: A Preview of Instancing in p5.strands",
    date: "August 2026",
    publication: "Processing Foundation",
    description:
      "How the new instancing API turns hundreds of draw calls into instances(500).sphere(20), and what the GPU is doing underneath.",
    tags: ["p5.js", "WebGPU", "Instancing"],
    url: "https://medium.com/processing-foundation/drawing-a-forest-in-one-line-a-preview-of-instancing-in-p5-strands-a2e93f9c9e04",
  },
];
