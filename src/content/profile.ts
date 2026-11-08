export const profile = {
  siteName: "DeveloperBro.",
  name: "Supriyo Sarkar",
  role: "Researcher in privacy-preserving machine learning",
  degree: "M.Tech, Computer Science and Engineering",
  email: "supriyo.sarkar016@gmail.com",
  github: "https://github.com/Supriyo016",
  githubUser: "Supriyo016",
  social: [
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/supriyo-sarkar/" },
    { id: "github", label: "GitHub", url: "https://github.com/Supriyo016" },
    { id: "x", label: "X", url: "https://x.com/Supriyo016" },
    { id: "instagram", label: "Instagram", url: "https://www.instagram.com/supriyo016/" },
    { id: "facebook", label: "Facebook", url: "https://www.facebook.com/profile.php?id=100070487584093" },
  ],
  portrait: "/images/portrait.jpg",
  cvPath: "/documents/Supriyo_Sarkar_Academic_CV.pdf",
  cvUpdated: "6 November 2026",
  headline: "How can hospitals learn from each other without sharing a single scan?",
  shortBio:
    "I hold an M.Tech in Computer Science and Engineering from Kalyani Government Engineering College. My dissertation compared nine federated learning configurations for Alzheimer's disease classification from MRI. I am now working on knowledge distillation for encrypted federated training.",
  openTo: "Open to doctoral research opportunities and academic collaboration.",
  hobbies: ["Photography", "Cricket", "Science fiction films", "Cooking", "Travelling"],
  languages: [
    { name: "Bengali", level: "Professional proficiency" },
    { name: "Hindi", level: "Professional proficiency" },
    { name: "English", level: "Moderate proficiency" },
  ],
  softSkills: ["Communication", "Teamwork", "Problem-solving", "Time management"],
} as const;

export const education = [
  {
    title: "Master of Technology in Computer Science and Engineering",
    institution: "Kalyani Government Engineering College (MAKAUT, WB), Nadia",
    period: "2024 – 2026",
    result: "CGPA 8.15 / 10",
  },
  {
    title: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Regent Education & Research Foundation (MAKAUT, WB), Kolkata",
    period: "2020 – 2024",
    result: "CGPA 8.95 / 10",
  },
  {
    title: "Class 12, West Bengal Council of Higher Secondary Education",
    institution: "Mal Adarsha Bidya Bhaban, Malbazar, Jalpaiguri",
    period: "2019",
    result: "70.10%",
  },
  {
    title: "Class 10, West Bengal Board of Secondary Education",
    institution: "Banarhat High School, Banarhat, Jalpaiguri",
    period: "2017",
    result: "68.71%",
  },
] as const;

export const about = {
  background: [
    "I came to research through engineering. I completed a B.Tech in Computer Science and Engineering at Regent Education & Research Foundation in Kolkata, then an M.Tech at Kalyani Government Engineering College, both under MAKAUT, West Bengal.",
    "My B.Tech dissertation assessed how quantum gates perform on superposition states using IBM Quantum servers, with the aim of informing noise mitigation on NISQ devices.",
  ],
  journey: [
    "My M.Tech dissertation was supervised by Dr. Jyotsna Kumar Mandal and Dr. Swapan Kumar Mandal. I compared three convolutional backbones and three federated algorithms for classifying Alzheimer's disease from MRI, with data split unevenly across five simulated hospitals.",
    "The result I found most interesting was not the best score. A compact network trained from scratch beat two ImageNet-pretrained backbones, and the choice of backbone moved accuracy far more than the choice of federated algorithm. That sent me back to basic questions about what federated training changes, and it led to my current work on distillation.",
  ],
  philosophy: [
    "I care about what a result can honestly support. A number means little without its protocol, so I try to hold everything fixed except the factor under study, report what did not work, and keep the limits next to the claim.",
    "This site follows the same rule. Where I report results, I state what was measured, what was not, and where the evidence stops.",
  ],
  objectives: [
    "Pursue doctoral research in privacy-preserving and federated machine learning.",
    "Build federated methods that hold up under realistic data heterogeneity.",
    "Bring medical imaging models closer to the settings hospitals actually work in.",
  ],
  interests: [
    "Beyond my dissertation topics, I follow natural language processing and large language models, and I keep up an interest in quantum computing from my B.Tech work.",
  ],
} as const;
