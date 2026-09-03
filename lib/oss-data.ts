export interface OSSWork {
  org: string;
  project: string;
  role: string;
  period: string;
  description: string;
  link: string;
  tags: string[];
}

export const ossWork: OSSWork[] = [
  {
    org: "Processing Foundation",
    project: "p5.js",
    role: "Steward, Micrograntee 2026 - WebGPU Instancing",
    period: "since 2025",
    description:
      "Designed and implemented the instances(n).model() API and instanceIndex system for WebGPU instanced rendering. 30+ merged PRs across core, website, and the web editor. Now reviews and merges contributions as a project steward.",
    link: "https://github.com/processing/p5.js",
    tags: ["WebGL", "WebGPU", "JavaScript", "Open Source"],
  },
  {
    org: "RISC-V International",
    project: "riscv-unified-db",
    role: "Contributor",
    period: "2026",
    description:
      "Seven PRs fixing correctness bugs in the machine-readable RISC-V specification: sign-extension of narrow results in the Zaamo, Zabha and Zalrsc atomics, a non-terminating IDL helper, ctzw on a zero low word, and the Sv48 canonical-address boundary in stvec/vstvec.",
    link: "https://github.com/riscv/riscv-unified-db",
    tags: ["RISC-V", "ISA Semantics", "IDL"],
  },
  {
    org: "CNCF",
    project: "KubeStellar",
    role: "Contributor - Admiral badge, ranked #3 on contributor leaderboard",
    period: "2026",
    description:
      "500+ verified bug reports, plus documentation and infrastructure contributions to the CNCF cloud-native project.",
    link: "https://github.com/kubestellar/kubestellar",
    tags: ["Distributed Systems", "Kubernetes", "Go"],
  },
  {
    org: "LFDT",
    project: "Hiero (Hedera SDK)",
    role: "Contributor",
    period: "2026",
    description:
      "15+ merged PRs across hiero-sdk-cpp and hiero-website for the Linux Foundation Decentralized Trust project. SDK internals and site work.",
    link: "https://github.com/hiero-ledger",
    tags: ["Distributed Ledger", "SDK", "C++"],
  },
];
