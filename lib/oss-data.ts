export interface OSSWork {
  org: string;
  project: string;
  role: string;
  description: string;
  link: string;
  tags: string[];
}

export const ossWork: OSSWork[] = [
  {
    org: "Processing Foundation",
    project: "p5.js",
    role: "Micrograntee 2026 - WebGPU Instancing",
    description:
      "Designed and implemented the instances(n).model() API and instanceIndex system for WebGPU instanced rendering. 50+ merged PRs.",
    link: "https://github.com/processing/p5.js",
    tags: ["WebGL", "WebGPU", "JavaScript", "Open Source"],
  },
  {
    org: "CNCF",
    project: "KubeStellar",
    role: "Contributor - Ranked #3 on contributor leaderboard",
    description:
      "500+ verified bug reports, documentation, and infrastructure contributions to the CNCF cloud-native project.",
    link: "https://github.com/kubestellar/kubestellar",
    tags: ["Distributed Systems", "Kubernetes", "Go"],
  },
  {
    org: "LFDT",
    project: "Hiero (Hedera SDK)",
    role: "Contributor",
    description:
      "Contributed to the Linux Foundation Decentralized Trust Hiero project - SDK tooling and documentation.",
    link: "https://github.com/hiero-ledger",
    tags: ["Blockchain", "SDK", "TypeScript"],
  },
];
