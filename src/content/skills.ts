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
    id: "ml",
    name: "Machine Learning and Deep Learning",
    blurb: "Models and training methods used in my dissertation work.",
    skills: [
      { name: "Machine Learning", usedIn: [fl] },
      { name: "Deep Learning", usedIn: [fl, kd] },
      { name: "Convolutional Neural Networks", usedIn: [fl, kd] },
      { name: "Transfer Learning", usedIn: [fl] },
      { name: "Group Normalisation", usedIn: [fl] },
      { name: "Knowledge Distillation", usedIn: [kd] },
      { name: "Model Compression", usedIn: [kd] },
    ],
  },
  {
    id: "privacy",
    name: "Federated and Privacy-Preserving Learning",
    blurb: "Training across institutions without pooling their data.",
    skills: [
      { name: "Federated Learning", usedIn: [fl, kd] },
      { name: "FedAvg, FedProx, FedDyn", usedIn: [fl] },
      { name: "Homomorphic Encryption (CKKS)", usedIn: [fl, kd] },
    ],
  },
  {
    id: "ai",
    name: "Application Areas",
    blurb: "Where I apply these methods, and where I want to.",
    skills: [
      { name: "Medical Image Analysis", usedIn: [fl, kd] },
      { name: "Natural Language Processing" },
      { name: "Large Language Models" },
    ],
  },
  {
    id: "quantum",
    name: "Quantum Computing",
    blurb: "From my B.Tech dissertation.",
    skills: [
      { name: "Quantum Computing", usedIn: [qc] },
      { name: "Qiskit", usedIn: [qc] },
      { name: "IBM Quantum", usedIn: [qc] },
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
      { name: "Matplotlib", usedIn: [fl, qc] },
    ],
  },
  {
    id: "web",
    name: "Web Development",
    blurb: "For project sites and this portfolio.",
    skills: [
      { name: "HTML", usedIn: [tour] },
      { name: "CSS", usedIn: [tour] },
      { name: "Bootstrap" },
      { name: "PHP" },
    ],
  },
  {
    id: "embedded",
    name: "Embedded Systems",
    blurb: "Hardware projects.",
    skills: [
      { name: "Arduino Uno", usedIn: [eye] },
      { name: "Arduino IDE", usedIn: [eye] },
    ],
  },
  {
    id: "tools",
    name: "Tools and Platforms",
    blurb: "Everyday tools.",
    skills: [
      { name: "Jupyter Notebook", usedIn: [fl, kd, qc] },
      { name: "Kaggle Notebooks", usedIn: [fl] },
      { name: "Google Colab", usedIn: [qc] },
      { name: "VS Code" },
      { name: "Git", usedIn: [dev] },
      { name: "GitHub", usedIn: [dev, tour, eye] },
      { name: "LaTeX", usedIn: [fl] },
      { name: "MS Office" },
    ],
  },
  {
    id: "core",
    name: "Core Computer Science",
    blurb: "Foundations from my degrees.",
    skills: [
      { name: "Data Structures and Algorithms" },
      { name: "Operating Systems" },
      { name: "Computer Networks" },
      { name: "Database Management Systems" },
    ],
  },
];
