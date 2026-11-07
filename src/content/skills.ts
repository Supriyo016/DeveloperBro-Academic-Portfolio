import type { SkillGroup, WorkRef } from "@/types/content";

const fl: WorkRef = { type: "research", slug: "federated-alzheimers-detection" };
const kd: WorkRef = { type: "article", slug: "knowledge-distillation-from-first-principles" };
const qc: WorkRef = { type: "research", slug: "quantum-gate-assessment" };
const eye: WorkRef = { type: "project", slug: "third-hand-eye" };
const tour: WorkRef = { type: "project", slug: "tour-india" };
const dev: WorkRef = { type: "project", slug: "developerbro-academic-portfolio" };

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    name: "Programming Languages",
    blurb: "What I write research and systems code in.",
    skills: [
      { name: "Python", usedIn: [fl, kd, qc] },
      { name: "C", usedIn: [eye] },
      { name: "C++", usedIn: [eye] },
      { name: "JavaScript", usedIn: [tour, dev] },
    ],
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    blurb: "The fields my research draws on.",
    skills: [
      { name: "Federated Learning", usedIn: [fl, kd] },
      { name: "Medical Image Analysis", usedIn: [fl, kd] },
      { name: "Knowledge Distillation", usedIn: [kd] },
      { name: "Model Compression", usedIn: [kd] },
      { name: "Natural Language Processing" },
      { name: "Large Language Models" },
    ],
  },
  {
    id: "ml",
    name: "Machine Learning and Deep Learning",
    blurb: "Models and methods used in my dissertation work.",
    skills: [
      { name: "Convolutional Neural Networks", usedIn: [fl, kd] },
      { name: "Transfer Learning", usedIn: [fl] },
      { name: "Group Normalisation", usedIn: [fl] },
      { name: "FedAvg, FedProx, FedDyn", usedIn: [fl] },
      { name: "Homomorphic Encryption (CKKS)", usedIn: [fl, kd] },
    ],
  },
  {
    id: "methods",
    name: "Research Methodologies",
    blurb: "How I set up and evaluate experiments.",
    skills: [
      { name: "Controlled factorial design", usedIn: [fl] },
      { name: "Non-IID data simulation", usedIn: [fl, kd] },
      { name: "Stratified cross-validation", usedIn: [fl] },
      { name: "Group-safe data splitting", usedIn: [kd] },
      { name: "Literature review", usedIn: [fl] },
    ],
  },
  {
    id: "frameworks",
    name: "Frameworks and Libraries",
    blurb: "The research stack.",
    skills: [
      { name: "PyTorch", usedIn: [fl, kd] },
      { name: "Flower", usedIn: [fl, kd] },
      { name: "TenSEAL", usedIn: [fl, kd] },
      { name: "scikit-learn", usedIn: [fl] },
      { name: "NumPy and pandas", usedIn: [fl] },
      { name: "Matplotlib", usedIn: [fl] },
    ],
  },
  {
    id: "tools",
    name: "Development Tools",
    blurb: "Everyday tools.",
    skills: [
      { name: "Jupyter Notebook", usedIn: [fl, kd] },
      { name: "VS Code" },
      { name: "Git", usedIn: [qc, dev] },
      { name: "GitHub", usedIn: [qc, dev, tour, eye] },
      { name: "Kaggle Notebooks", usedIn: [fl] },
      { name: "LaTeX", usedIn: [fl] },
      { name: "Arduino IDE", usedIn: [eye] },
      { name: "IBM Quantum", usedIn: [qc] },
      { name: "MS Office" },
    ],
  },
  {
    id: "databases",
    name: "Database Technologies",
    blurb: "Studied as core computer science.",
    skills: [{ name: "Database Management Systems" }],
  },
  {
    id: "core",
    name: "Core Computer Science",
    blurb: "Foundations from my degrees.",
    skills: [
      { name: "Data Structures and Algorithms" },
      { name: "Operating Systems" },
      { name: "Computer Networks" },
      { name: "Quantum Computing", usedIn: [qc] },
    ],
  },
];
