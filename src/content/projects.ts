import type { Project, ProjectCategory } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "third-hand-eye",
    title: "Third Hand-Eye",
    tagline: "An Arduino obstacle detector that warns visually impaired users with sound.",
    year: "2024",
    featured: true,
    kind: "Academic project",
    categories: ["Embedded Systems"],
    tech: ["C/C++", "Arduino Uno", "Arduino IDE", "HC-SR04"],
    overview: [
      "An assistive device built on an Arduino Uno. An HC-SR04 ultrasonic sensor measures the distance to nearby obstacles, and a buzzer alerts the user, aiming to make moving around safer and more independent.",
    ],
    problem: "A person with a visual impairment needs early warning of obstacles in their path, from something simple and inexpensive to build.",
    objectives: ["Detect obstacles within about one metre.", "Alert the user through sound.", "Keep the hardware to one board, one sensor and one buzzer."],
    architecture: [
      { title: "Sense", body: "The Arduino sends a short pulse on the HC-SR04 trigger pin and times the echo." },
      { title: "Decide", body: "It converts echo time to centimetres and checks whether an obstacle is within 100 cm." },
      { title: "Alert", body: "The buzzer sounds in short bursts while an obstacle stays in range." },
    ],
    highlights: ["Ultrasonic obstacle detection", "Audio alert for anything within 100 cm", "Distance logged over serial at 9600 baud", "Circuit diagram, report and video demonstration in the repository"],
    implementation: [
      "Trigger on pin 12, echo on pin 10 and buzzer on pin 5.",
      "Distance is computed from pulse width as microseconds / 29 / 2.",
      "The main loop measures continuously, with a 100 ms buzzer pulse on each detection.",
    ],
    repo: "https://github.com/Supriyo016/Arduino-Uno-Third-Hand-Eye-Project-for-Visually-Impaired-Individuals",
    repoName: "Arduino-Uno-Third-Hand-Eye-Project-for-Visually-Impaired-Individuals",
    demo: "https://www.youtube.com/watch?v=xSJj8tTnAgg",
    image: {
      src: "/images/projects/third-eye-circuit.png",
      alt: "Circuit diagram connecting an Arduino Uno to an HC-SR04 ultrasonic sensor and a buzzer.",
      caption: "Circuit diagram of the Third Hand-Eye device.",
      width: 830,
      height: 483,
    },
  },
  {
    slug: "tour-india",
    title: "Tour India",
    tagline: "A travel website, developed after selection for Smart India Hackathon 2022.",
    year: "2022",
    featured: true,
    kind: "Academic project",
    categories: ["Web Development"],
    tech: ["HTML", "CSS", "JavaScript"],
    overview: ["A multi-page travel website with home, about and contact pages, hosted on GitHub Pages. Selected for Smart India Hackathon 2022."],
    highlights: ["Destination gallery", "Services section covering hotels, food and safety", "Video tour section", "Contact page with an enquiry form"],
    repo: "https://github.com/Supriyo016/TourIndia",
    repoName: "TourIndia",
    live: "https://supriyo016.github.io/TourIndia/",
  },
  {
    slug: "developerbro-academic-portfolio",
    title: "DeveloperBro. Academic Portfolio",
    tagline: "This website: a research portfolio with live case studies, research notes and a built-in assistant.",
    year: "2026",
    featured: true,
    kind: "Personal project",
    categories: ["Web Development"],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MDX", "Zod", "Playwright", "Vercel"],
    overview: [
      "A server-rendered research portfolio. Research results are generated from notebook logs, content lives in typed files, research notes are MDX with maths, charts and diagrams, and each response carries its own strict Content Security Policy.",
      "Animated SVG illustrations, a carousel and a chat assistant run without any external service. The assistant answers only from the site's own content, entirely in the browser.",
    ],
    problem: "An academic portfolio has to be accurate before it is attractive, because a supervisor will check its claims.",
    architecture: [
      { title: "Content", body: "Typed data files and MDX articles, with no database because nothing needs one." },
      { title: "Rendering", body: "Server components by default, with client components only for interaction." },
      { title: "Assistant", body: "A rule-based chat assistant that runs in the browser and answers from the site's content, so no visitor message leaves the page." },
      { title: "Protection", body: "A per-request nonce, validated input and rate limiting on the one write endpoint." },
    ],
    highlights: [
      "29 research notes with KaTeX maths, code, charts and diagrams",
      "Accessible carousel, global search, reading mode and RSS",
      "Continuous SVG animation with a pause control and reduced-motion support",
      "Unit, integration, security and browser tests, including WCAG 2.2 AA scans",
    ],
    repo: "https://github.com/Supriyo016/DeveloperBro-Academic-Portfolio",
    repoName: "DeveloperBro-Academic-Portfolio",
    live: "https://developerbro.vercel.app",
  },
];

export const projectCategories: ProjectCategory[] = ["Web Development", "Embedded Systems"];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
