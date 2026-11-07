import type { TimelineEvent } from "@/types/content";

// The Computer Science and Engineering journey: degrees, research works and projects, newest first.
// Marks are shown only on the About page, so no event here carries a result.
export const timeline: TimelineEvent[] = [
  {
    id: "portfolio",
    period: "2026",
    kind: "project",
    title: "DeveloperBro. Academic Portfolio",
    detail: "This website: research case studies, research notes and a built-in assistant, built with Next.js and TypeScript.",
    href: "/projects/developerbro-academic-portfolio",
  },
  {
    id: "mtech-dissertation",
    period: "2026",
    kind: "research",
    title: "Privacy-Preserving Alzheimer's Disease Detection for Non-IID MRI Data",
    detail: "M.Tech dissertation comparing three CNN backbones and three federated learning algorithms under homomorphic encryption, supervised by Dr. Jyotsna Kumar Mandal and Dr. Swapan Kumar Mandal.",
    href: "/research/federated-alzheimers-detection",
  },
  {
    id: "mtech",
    period: "2024 – 2026",
    kind: "degree",
    title: "Master of Technology, Computer Science and Engineering",
    org: "Kalyani Government Engineering College (MAKAUT, WB), Nadia",
  },
  {
    id: "btech-dissertation",
    period: "2024",
    kind: "research",
    title: "Quantum Gate Performance Assessment in the Presence of Superposition State using IBMQ Server",
    detail: "B.Tech dissertation measuring how quantum gates perform on superposition states on IBM Quantum servers.",
    href: "/research/quantum-gate-assessment",
  },
  {
    id: "third-hand-eye",
    period: "2024",
    kind: "project",
    title: "Third Hand-Eye",
    detail: "An Arduino Uno obstacle detector that warns visually impaired users with sound.",
    href: "/projects/third-hand-eye",
  },
  {
    id: "tour-india",
    period: "2022",
    kind: "project",
    title: "Tour India",
    detail: "A travel website built with HTML, CSS and JavaScript.",
    href: "/projects/tour-india",
  },
  {
    id: "btech",
    period: "2020 – 2024",
    kind: "degree",
    title: "Bachelor of Technology, Computer Science and Engineering",
    org: "Regent Education & Research Foundation (MAKAUT, WB), Kolkata",
  },
];
