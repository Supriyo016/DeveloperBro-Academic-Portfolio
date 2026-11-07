// A small conversational engine for the site assistant. It runs entirely in the browser, matches
// what a visitor asks against a set of topics, and answers only with facts from the site's content.
// Nothing is sent to a server, and nothing outside the Knowledge object is ever stated as fact.
import type { Knowledge, KnowledgeArticle } from "./knowledge";

export interface ChatLink {
  href: string;
  label: string;
}

export interface BotReply {
  text: string[];
  links?: ChatLink[];
  suggestions?: string[];
  mood?: "happy" | "thinking" | "waving";
}

export interface ChatState {
  lastTopic?: string;
  depth: number;
  visitorName?: string;
  turns: number;
}

export const initialState: ChatState = { depth: 0, turns: 0 };

type Random = () => number;

interface Topic {
  id: string;
  /** Words or phrases. A phrase scores more than a single word. */
  keys: string[];
  answer: (kb: Knowledge, ctx: Context) => BotReply;
}

interface Context {
  depth: number;
  pick: <T>(items: T[]) => T;
  name?: string;
  query: string;
}

const STOP = new Set(
  "a an the and or of to in on for with about is are was were be been am do does did can could would should will what which who whom whose how why when where me my your you yours i it its this that these those tell show give please any some much many more there their them his her he she they we our us at by from as into than then so just also very really know like want need".split(" "),
);

export function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const tokens = (text: string) => normalise(text).split(" ").filter((word) => word && !STOP.has(word));

function scoreKeys(query: string, keys: string[]): number {
  const words = new Set(query.split(" "));
  let score = 0;
  for (const key of keys) {
    if (key.includes(" ")) {
      if (query.includes(key)) score += 3;
    } else if (words.has(key) || (key.length > 4 && [...words].some((word) => word.startsWith(key)))) {
      score += 2;
    }
  }
  return score;
}

export function searchArticles(query: string, articles: KnowledgeArticle[], limit = 2): KnowledgeArticle[] {
  const wanted = tokens(query).filter((word) => word.length > 2);
  if (!wanted.length) return [];
  return articles
    .map((article) => {
      const haystack = normalise(`${article.title} ${article.description} ${article.tags.join(" ")} ${article.category}`);
      const hits = wanted.filter((word) => haystack.includes(word)).length;
      return { article, hits };
    })
    .filter((item) => item.hits >= Math.min(2, wanted.length))
    .sort((a, b) => b.hits - a.hits || b.article.date.localeCompare(a.article.date))
    .slice(0, limit)
    .map((item) => item.article);
}

const articleLinks = (items: KnowledgeArticle[]): ChatLink[] => items.map((article) => ({ href: `/blogs/${article.slug}`, label: article.title }));
const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`);

const openers = ["Sure!", "Happy to help.", "Good question.", "Of course.", "Great, let me tell you."];

const topics: Topic[] = [
  {
    id: "about",
    keys: ["who is", "who is supriyo", "about supriyo", "about him", "about her", "introduce", "introduction", "background", "yourself", "bio", "profile", "summary"],
    answer: (kb, ctx) => ({
      text: [
        `${ctx.pick(openers)} ${kb.name} is a ${kb.role.toLowerCase()}.`,
        kb.shortBio.replace(/^I hold/, `${kb.firstName} holds`).replace(/My dissertation/g, `${kb.firstName}'s dissertation`).replace(/I am now/, `${kb.firstName} is now`),
        kb.openTo,
      ],
      links: [{ href: "/about", label: "About Me" }],
      suggestions: ["What is the research about?", "Show me the projects", "How can I get in touch?"],
    }),
  },
  {
    id: "research",
    keys: ["research", "research work", "works", "dissertation", "dissertations", "thesis", "studies", "papers", "study"],
    answer: (kb, ctx) => ({
      text: [
        ctx.pick(["There are two research works on the site.", "Two research works, one from each degree."]),
        ...kb.studies.map((study) => `• ${study.title} (${study.kind}, ${study.period}).`),
        "Which one would you like to hear about?",
      ],
      links: kb.studies.map((study) => ({ href: `/research/${study.slug}`, label: study.kind })),
      suggestions: ["Tell me about the M.Tech work", "Tell me about the quantum work"],
    }),
  },
  {
    id: "mtech",
    keys: ["m.tech", "mtech", "alzheimer", "alzheimers", "mri", "federated", "fedavg", "fedprox", "feddyn", "non-iid", "noniid", "dementia", "medical", "brain", "accuracy", "results", "result", "custom cnn", "efficientnet", "mobilenet", "homomorphic", "ckks", "encryption", "kalyani"],
    answer: (kb, ctx) => {
      if (ctx.depth > 0) {
        return {
          text: [
            "A bit more detail, then.",
            "The surprise was the backbone: EfficientNetB0, the strongest ImageNet model of the three, reached only about 79% macro F1, while the from-scratch Custom CNN reached 94.80%. The choice of backbone moved results far more than the choice of federated algorithm, and plain FedAvg was best for every backbone.",
            "The limits are stated openly too: each configuration was run once, the dataset was pre-augmented, and CKKS was prototyped alongside training rather than used for the full aggregation.",
          ],
          links: [{ href: "/blogs/the-pretrained-backbone-that-lost", label: "Why EfficientNetB0 lost" }, { href: "/blogs/dissertation-submitted-lessons", label: "Lessons from the dissertation" }],
          suggestions: ["What is federated learning?", "What is CKKS?", "What is Supriyo working on now?"],
        };
      }
      return {
        text: [
          ctx.pick(["This is the main research work.", "Happy to explain the M.Tech dissertation."]),
          `"${kb.studies[0]?.title ?? ""}" asks which CNN and which federated algorithm to prefer when hospitals hold very different data. It compares MobileNetV2, EfficientNetB0 and a Custom CNN with FedAvg, FedProx and FedDyn, across five simulated clients with skewed class mixes.`,
          "The best setup, the Custom CNN with Group Normalisation and FedAvg, reached 94.59% test accuracy and 94.80% macro F1 on 8,800 held-out images.",
          `It was supervised by ${list(kb.supervisors.map((name) => name.split(",")[0] ?? name))}.`,
        ],
        links: [{ href: "/research/federated-alzheimers-detection", label: "Read the case study" }],
        suggestions: ["Tell me more", "What is federated learning?", "What are the limitations?"],
      };
    },
  },
  {
    id: "limits",
    keys: ["limitation", "limitations", "weakness", "weaknesses", "caveat", "caveats", "problems with", "flaws"],
    answer: () => ({
      text: [
        "Good that you asked, because the site is upfront about this.",
        "Each of the nine configurations was trained once, so small differences may not hold with another seed. The dataset was balanced by augmentation, and an image-level split can let near-copies sit on both sides. CKKS encryption was prototyped on a sample of each update, while the server averaged plaintext weights.",
      ],
      links: [{ href: "/blogs/dissertation-submitted-lessons", label: "Five things to do differently" }, { href: "/blogs/duplicates-in-an-augmented-dataset", label: "The duplicate-file audit" }],
      suggestions: ["What is Supriyo working on now?", "Show me the research notes"],
    }),
  },
  {
    id: "cost",
    keys: ["cost", "costs", "overhead", "how expensive", "ciphertext size", "encryption cost", "how big", "how slow", "expansion"],
    answer: () => ({
      text: [
        "From a full development run with a 74,508-parameter model: one client's update grew from 0.298 MB in plain float32 to 6.296 MB encrypted, about 21 times larger.",
        "Encryption took about a second per round for all clients together, aggregation about 0.13 s and decryption 0.04 s, with an error around 10⁻⁷. Local training, about 27 s per client, was the real bottleneck.",
      ],
      links: [{ href: "/blogs/measured-ckks-cost-per-round", label: "Measured CKKS costs" }],
      suggestions: ["What is CKKS?", "What is Supriyo working on now?"],
    }),
  },
  {
    id: "quantum",
    keys: ["quantum", "qubit", "ibmq", "ibm", "superposition", "gate", "gates", "nisq", "b.tech", "btech", "regent"],
    answer: (kb) => ({
      text: [
        `The B.Tech dissertation is "${kb.studies.find((study) => study.slug === "quantum-gate-assessment")?.title ?? "Quantum gate performance"}".`,
        "It measured how quantum gates perform on superposition states using IBM Quantum servers, with the aim of informing noise mitigation on today's noisy quantum devices.",
        "The site keeps this page short, because the detailed results aren't published there.",
      ],
      links: [{ href: "/research/quantum-gate-assessment", label: "Quantum gate study" }],
      suggestions: ["Tell me about the M.Tech work", "Show me the projects"],
    }),
  },
  {
    id: "projects",
    keys: ["project", "projects", "built", "build", "portfolio projects", "made", "apps"],
    answer: (kb, ctx) => ({
      text: [
        ctx.pick(["Here are the projects on the site.", "There are three projects to look at."]),
        ...kb.projects.map((project) => `• ${project.title}: ${project.tagline}`),
      ],
      links: [{ href: "/projects", label: "All projects" }, ...kb.projects.map((project) => ({ href: `/projects/${project.slug}`, label: project.title }))],
      suggestions: ["Tell me about Third Hand-Eye", "Tell me about Tour India", "How was this website built?"],
    }),
  },
  {
    id: "third-hand-eye",
    keys: ["third hand", "hand-eye", "hand eye", "arduino", "visually impaired", "blind", "ultrasonic", "hc-sr04", "sensor", "buzzer", "obstacle", "embedded"],
    answer: (kb) => {
      const project = kb.projects.find((item) => item.slug === "third-hand-eye");
      return {
        text: [
          "Third Hand-Eye is an assistive device for visually impaired people.",
          "An Arduino Uno drives an HC-SR04 ultrasonic sensor that measures the distance to obstacles, and a buzzer sounds whenever something is within about 100 cm. It's written in C/C++ in the Arduino IDE, and the repository has the circuit diagram, report and a video demo.",
        ],
        links: [
          { href: "/projects/third-hand-eye", label: "Project page" },
          ...(project?.repo ? [{ href: project.repo, label: "Code on GitHub" }] : []),
          ...(project?.demo ? [{ href: project.demo, label: "Video demo" }] : []),
        ],
        suggestions: ["Tell me about Tour India", "What skills does Supriyo have?"],
      };
    },
  },
  {
    id: "tour-india",
    keys: ["tour india", "tourindia", "travel", "tourism", "hackathon", "smart india", "sih"],
    answer: (kb) => {
      const project = kb.projects.find((item) => item.slug === "tour-india");
      return {
        text: [
          "Tour India is a multi-page travel website built with HTML, CSS and JavaScript, with a destination gallery, services for hotels, food and safety, a video tour section and an enquiry form.",
          "It was developed after selection for Smart India Hackathon 2022, and it's live on GitHub Pages.",
        ],
        links: [
          { href: "/projects/tour-india", label: "Project page" },
          ...(project?.live ? [{ href: project.live, label: "Live site" }] : []),
          ...(project?.repo ? [{ href: project.repo, label: "Code on GitHub" }] : []),
        ],
        suggestions: ["Tell me about Third Hand-Eye", "How was this website built?"],
      };
    },
  },
  {
    id: "portfolio",
    keys: ["this website", "this site", "website", "portfolio", "next.js", "nextjs", "react", "how was", "built with", "developerbro", "tech stack", "chatbot", "assistant built"],
    answer: (kb) => {
      const project = kb.projects.find((item) => item.slug === "developerbro-academic-portfolio");
      return {
        text: [
          "You're looking at it! DeveloperBro. is built with Next.js, React, TypeScript and Tailwind CSS, with research notes written in MDX with maths, code, charts and diagrams.",
          "I'm part of it too: a small assistant that runs entirely in your browser and answers from the site's own content, so nothing you type is sent anywhere.",
        ],
        links: [
          { href: "/projects/developerbro-academic-portfolio", label: "Project page" },
          ...(project?.repo ? [{ href: project.repo, label: "Code on GitHub" }] : []),
        ],
        suggestions: ["Show me the projects", "What skills does Supriyo have?"],
      };
    },
  },
  {
    id: "skills",
    keys: ["skill", "skills", "python", "pytorch", "languages programming", "programming", "tools", "technologies", "stack", "expertise", "good at"],
    answer: (kb) => {
      const pick = (group: string) => kb.skills.find((item) => item.group.toLowerCase().includes(group))?.names ?? [];
      return {
        text: [
          "A quick tour of the skills on the site:",
          `• Programming: ${list(pick("programming"))}.`,
          `• AI: ${list(pick("artificial").slice(0, 4))}.`,
          `• Tools and frameworks include PyTorch, Flower and TenSEAL, used in the research work.`,
        ],
        links: [{ href: "/skills", label: "Skills, with where each was used" }],
        suggestions: ["Show me the projects", "Tell me about the M.Tech work"],
      };
    },
  },
  {
    id: "education",
    keys: ["education", "degree", "degrees", "college", "university", "studied", "qualification", "qualifications", "academic journey", "journey", "graduate"],
    answer: (kb) => ({
      text: [
        "Here's the computer science and engineering journey:",
        ...kb.degrees.map((degree) => `• ${degree.title}, ${degree.org} (${degree.period}).`),
        "Grades are listed on the About Me page.",
      ],
      links: [{ href: "/education", label: "Academic journey" }, { href: "/about#qualifications", label: "About Me" }],
      suggestions: ["Tell me about the research", "Show me the projects"],
    }),
  },
  {
    id: "marks",
    keys: ["cgpa", "gpa", "marks", "grade", "grades", "percentage", "score in", "result in"],
    answer: () => ({
      text: ["Grades and marks are shown in one place only, the Educational qualifications section of the About Me page."],
      links: [{ href: "/about#qualifications", label: "Educational qualifications" }],
      suggestions: ["Tell me about the research", "Can I download the CV?"],
    }),
  },
  {
    id: "supervisors",
    keys: ["supervisor", "supervisors", "supervised", "supervise", "guide", "guided", "mentor", "advisor", "mandal"],
    answer: (kb) => ({
      text: ["The M.Tech dissertation was supervised by:", ...kb.supervisors.map((name) => `• ${name}.`)],
      links: [{ href: "/research/federated-alzheimers-detection", label: "M.Tech case study" }],
    }),
  },
  {
    id: "now",
    keys: ["working on", "current work", "currently", "now", "next", "distillation", "knowledge distillation", "teacher", "student model", "ongoing", "future plans", "plans"],
    answer: () => ({
      text: [
        "Right now Supriyo is studying knowledge distillation for CKKS-secured federated learning: can a small model trained across hospitals learn more from a larger teacher, while the server only ever sees encrypted updates?",
        "It's ongoing, and the research notes share early development runs honestly, including one where distillation didn't help yet.",
      ],
      links: [{ href: "/blogs/distillation-null-result", label: "The distillation null result" }, { href: "/blogs/measured-ckks-cost-per-round", label: "What encryption costs" }],
      suggestions: ["What is CKKS?", "Is Supriyo open to a PhD?"],
    }),
  },
  {
    id: "explain-fl",
    keys: ["what is federated", "federated learning mean", "explain federated", "how does federated"],
    answer: (kb) => ({
      text: [
        "In one breath: federated learning trains a shared model without moving the data.",
        "Each hospital trains the current model on its own scans and sends back only the updated weights. A server averages them into the next model, and the loop repeats. The data never leaves the hospital, although the updates themselves still need protecting.",
      ],
      links: articleLinks(searchArticles("federated learning pool hospitals FedAvg", kb.articles)),
      suggestions: ["What is CKKS?", "What is non-IID data?"],
    }),
  },
  {
    id: "explain-ckks",
    keys: ["what is ckks", "what is homomorphic", "explain ckks", "explain homomorphic", "encrypted aggregation", "secure aggregation"],
    answer: (kb) => ({
      text: [
        "CKKS is a homomorphic encryption scheme: it lets you add and multiply encrypted numbers without decrypting them.",
        "For federated learning that's handy, because averaging only needs addition. Each client encrypts its weights, the server adds the ciphertexts without any secret key, and only the clients can decrypt the result.",
      ],
      links: articleLinks(searchArticles("CKKS encryption ciphertext", kb.articles)),
      suggestions: ["What does encryption cost?", "What is federated learning?"],
    }),
  },
  {
    id: "explain-noniid",
    keys: ["what is non-iid", "non iid", "what is non iid", "dirichlet", "heterogeneous", "skewed data"],
    answer: (kb) => ({
      text: [
        "Non-IID means the clients' data don't follow the same distribution. One hospital might see mostly early cases, another mostly healthy scans.",
        "Supriyo's dissertation simulated this with a Dirichlet split (α = 0.5) across five clients, ranging from 3,521 to 11,201 images each.",
      ],
      links: articleLinks(searchArticles("non-IID Dirichlet partition", kb.articles)),
    }),
  },
  {
    id: "contact",
    keys: ["contact", "email", "reach", "get in touch", "hire", "collaborate", "collaboration", "phd", "doctoral", "position", "opportunity", "opportunities", "available", "work with", "message"],
    answer: (kb) => ({
      text: [
        `${kb.openTo} The quickest way is email: ${kb.email}.`,
        "There's also a contact page, and LinkedIn works well for a first hello.",
      ],
      links: [
        { href: "/contact", label: "Contact page" },
        { href: `mailto:${kb.email}`, label: "Send an email" },
        ...kb.social.filter((item) => item.label === "LinkedIn").map((item) => ({ href: item.url, label: "LinkedIn" })),
      ],
      suggestions: ["Can I download the CV?", "Tell me about the research"],
    }),
  },
  {
    id: "cv",
    keys: ["cv", "resume", "curriculum", "vitae", "download"],
    answer: (kb) => ({
      text: ["Of course. You can read the CV on the site, preview the PDF, or download it."],
      links: [{ href: "/cv", label: "CV page" }, { href: kb.cvPath, label: "Download the PDF" }],
    }),
  },
  {
    id: "blog",
    keys: ["blog", "blogs", "posts", "post", "articles", "article", "notes", "writing", "latest", "research notes", "posts about", "post about", "articles about", "notes on", "notes about", "blog on", "blog about", "written about"],
    answer: (kb, ctx) => {
      const found = searchArticles(ctx.query, kb.articles, 3);
      const latest = [...kb.articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
      return {
        text: found.length
          ? ["I found research notes that match:", ...found.map((article) => `• ${article.title}`)]
          : [`There are ${kb.articles.length} research notes on federated learning, privacy, medical imaging and research methods. Here are the latest:`, ...latest.map((article) => `• ${article.title}`)],
        links: [...articleLinks(found.length ? found : latest), { href: "/blogs", label: "All research notes" }],
        suggestions: ["Posts about CKKS", "Posts about data leakage"],
      };
    },
  },
  {
    id: "publications",
    keys: ["publication", "publications", "published", "journal", "conference", "paper published"],
    answer: () => ({
      text: [
        "Nothing is labelled as published yet, because nothing has been verified as published. A paper on knowledge distillation for CKKS-secured federated learning is in progress, under a working title.",
      ],
      links: [{ href: "/publications", label: "Publications" }],
    }),
  },
  {
    id: "achievements",
    keys: ["achievement", "achievements", "award", "awards", "rank", "pget", "exam", "certificate", "certificates", "courses", "nptel"],
    answer: () => ({
      text: ["The achievements page lists WB PGET 2025 (Rank 43), selection for Smart India Hackathon 2022, and courses from NPTEL, Coursera and Udemy, including Deep Learning and Python for Data Science."],
      links: [{ href: "/achievements", label: "Achievements" }],
    }),
  },
  {
    id: "social",
    keys: ["linkedin", "github", "twitter", "instagram", "facebook", "social", "socials", "follow"],
    answer: (kb) => ({
      text: ["Here's where to find Supriyo online. All of these accounts are verified on the site."],
      links: kb.social.map((item) => ({ href: item.url, label: item.label })),
    }),
  },
  {
    id: "languages",
    keys: ["speak", "spoken", "bengali", "hindi", "english", "language spoken", "languages"],
    answer: (kb) => ({ text: [`Supriyo speaks ${list(kb.languages)}.`] }),
  },
  {
    id: "hobbies",
    keys: ["hobby", "hobbies", "free time", "fun", "interests outside", "cricket", "photography", "movies"],
    answer: (kb) => ({
      text: [`Away from research, Supriyo enjoys ${list(kb.hobbies.map((hobby) => hobby.toLowerCase()))}.`],
      suggestions: ["Tell me a joke", "Tell me about the research"],
    }),
  },
  {
    id: "location",
    keys: ["where is supriyo", "where are you", "based in", "located", "location", "country", "city", "india", "bengal", "kolkata"],
    answer: () => ({
      text: ["Supriyo studied in West Bengal, India: the B.Tech in Kolkata and the M.Tech at Kalyani. For anything about relocating or remote work, email is the best place to ask."],
      links: [{ href: "/contact", label: "Contact" }],
    }),
  },
];

const smallTalk: { test: RegExp; reply: (kb: Knowledge, ctx: Context) => BotReply }[] = [
  {
    test: /^(hi|hello|hey|hiya|howdy|namaste|good (morning|afternoon|evening)|yo|greetings)\b/,
    reply: (kb, ctx) => ({
      text: [
        ctx.name ? `Hello again, ${ctx.name}!` : ctx.pick(["Hi there!", "Hello!", "Hey, nice to meet you!"]),
        `I'm Bro, the assistant on ${kb.firstName}'s site. Ask me about the research, projects, skills or how to get in touch.`,
      ],
      mood: "waving",
      suggestions: ["Who is Supriyo?", "What is the research about?", "Show me the projects"],
    }),
  },
  {
    test: /\b(how are you|how r u|how are u|how is it going|hows it going|whats up|how do you do)\b/,
    reply: (_kb, ctx) => ({
      text: [ctx.pick(["Doing great, thanks for asking! How can I help?", "All good here, my circuits are humming. What would you like to know?"])],
      mood: "happy",
    }),
  },
  {
    test: /\b(who are you|what are you|are you (a )?(bot|robot|ai|human|real)|your name)\b/,
    reply: (kb) => ({
      text: [
        `I'm Bro, a friendly assistant built into this site. I'm not ${kb.firstName} and I'm not a large language model: I answer from the site's own content, right here in your browser.`,
        `For anything I can't answer, ${kb.firstName} reads every email personally.`,
      ],
      links: [{ href: "/contact", label: "Contact" }],
      mood: "happy",
    }),
  },
  {
    test: /\b(thanks|thank you|thx|cheers|appreciate)\b/,
    reply: (_kb, ctx) => ({ text: [ctx.pick(["You're welcome!", "Any time!", "Glad I could help."]) + " Anything else?"], mood: "happy" }),
  },
  {
    test: /\b(bye|goodbye|see you|see ya|good night|thats all)\b/,
    reply: (_kb, ctx) => ({ text: [ctx.name ? `Bye, ${ctx.name}! Thanks for visiting.` : "Bye for now, and thanks for visiting!"], mood: "waving" }),
  },
  {
    test: /\b(joke|funny|make me laugh)\b/,
    reply: (_kb, ctx) => ({
      text: [
        ctx.pick([
          "Why did the federated model never gossip? It only ever shared updates, never the data.",
          "A qubit walks into a bar. The bartender asks, 'In or out?' It says, 'Yes.'",
          "Why was the neural network calm before the exam? It had plenty of dropout to fall back on.",
        ]),
      ],
      mood: "happy",
      suggestions: ["Tell me about the research", "Show me the projects"],
    }),
  },
  {
    test: /\b(great|awesome|cool|nice|amazing|love it|impressive|wow)\b/,
    reply: (kb) => ({ text: [`Thank you, I'll pass that on to ${kb.firstName}! Want to see the research notes or the projects next?`], mood: "happy", suggestions: ["Show me the research notes", "Show me the projects"] }),
  },
];

const fallback = (kb: Knowledge, ctx: Context): BotReply => {
  const found = searchArticles(ctx.query, kb.articles);
  if (found.length) {
    return {
      text: [ctx.pick(["I don't have a short answer for that, but these research notes look relevant:", "Good one. The closest things on the site are these notes:"]), ...found.map((article) => `• ${article.title}`)],
      links: articleLinks(found),
      mood: "thinking",
    };
  }
  return {
    text: [
      ctx.pick(["Hmm, I'm not sure I know that one.", "I don't have an answer for that on the site, I'm afraid."]),
      `I only know what's on this site: research, projects, skills, education, notes and contact details. For anything else, ${kb.firstName} is happy to hear from you by email.`,
    ],
    links: [{ href: `mailto:${kb.email}`, label: "Email Supriyo" }],
    suggestions: ["What is the research about?", "Show me the projects", "How can I get in touch?"],
    mood: "thinking",
  };
};

export function welcome(kb: Knowledge): BotReply {
  return {
    text: [`Hi! I'm Bro, the assistant on ${kb.firstName}'s site.`, "I can tell you about the research, the projects, skills and education, point you to research notes, or help you get in touch. What would you like to know?"],
    suggestions: ["Who is Supriyo?", "What is the research about?", "Show me the projects", "How can I get in touch?"],
    mood: "waving",
  };
}

const GENERAL = new Set(["research", "projects", "blog", "about"]);

const MORE = /^(more|tell me more|go on|continue|details|more details|and|then|what else|elaborate|explain more|yes|yes please|sure|ok|okay)$/;

export function respond(input: string, state: ChatState, kb: Knowledge, random: Random = Math.random): { reply: BotReply; state: ChatState } {
  const query = normalise(input).slice(0, 300);
  const pick = <T,>(items: T[]): T => items[Math.floor(random() * items.length) % items.length] as T;
  const nameMatch = /\b(?:my name is|i am|im|call me)\s+([a-z][a-z-]{1,20})\b/.exec(query);
  const blocked = new Set(["a", "an", "the", "looking", "interested", "here", "from", "not", "just", "fine", "good", "student", "researcher", "professor", "recruiter"]);
  const visitorName = nameMatch?.[1] && !blocked.has(nameMatch[1]) ? nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1) : state.visitorName;
  const ctx: Context = { depth: 0, pick, name: visitorName, query };
  const next: ChatState = { ...state, visitorName, turns: state.turns + 1 };

  if (!query) return { reply: { text: ["Type a question whenever you're ready, I'm listening."] }, state: next };

  if (nameMatch?.[1] && visitorName && !state.visitorName && query.split(" ").length <= 5) {
    return {
      reply: { text: [`Nice to meet you, ${visitorName}! What would you like to know about ${kb.firstName}'s work?`], mood: "waving", suggestions: ["What is the research about?", "Show me the projects"] },
      state: next,
    };
  }

  if (MORE.test(query) && state.lastTopic) {
    const topic = topics.find((item) => item.id === state.lastTopic);
    if (topic) {
      ctx.depth = state.depth + 1;
      return { reply: topic.answer(kb, ctx), state: { ...next, depth: ctx.depth } };
    }
  }

  const ranked = topics
    .map((topic) => ({ topic, score: scoreKeys(query, topic.keys) }))
    .filter((item) => item.score > 0)
    // On a tie, a specific topic beats a general one: "quantum research" is about quantum.
    .sort((a, b) => b.score - a.score || Number(GENERAL.has(a.topic.id)) - Number(GENERAL.has(b.topic.id)));
  const best = ranked[0];

  const talk = smallTalk.find((item) => item.test.test(query));
  const greeting = talk === smallTalk[0];
  // Small talk wins over a topic only for short messages, and a greeting never hides a real question.
  if (talk && (!best || (!greeting && query.split(" ").length <= 6))) {
    return { reply: talk.reply(kb, ctx), state: next };
  }

  if (best) {
    const reply = best.topic.answer(kb, ctx);
    if (greeting) reply.text[0] = `${pick(["Hi!", "Hello!"])} ${reply.text[0]}`;
    return { reply: { mood: "happy", ...reply }, state: { ...next, lastTopic: best.topic.id, depth: 0 } };
  }

  return { reply: fallback(kb, ctx), state: { ...next, lastTopic: undefined, depth: 0 } };
}
