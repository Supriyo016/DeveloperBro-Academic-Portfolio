import { profile } from "@/content/profile";

// Everything printed on the badge. Only facts already published elsewhere on the site.
export const badge = {
  pass: "RESEARCH PASS",
  status: "OPEN TO PHD",
  role: "CSE RESEARCHER",
  name: profile.name,
  footer: "M.TECH CSE · KGEC",
  portrait: profile.portrait,
  strapText: "SUPRIYO SARKAR · DEVELOPERBRO. · PRIVACY-PRESERVING ML · ",
  /** The barcode is decorative. Its bars are derived from this text so the pattern is stable. */
  barcodeSeed: "developerbro.vercel.app",
} as const;

export const identity = {
  status: "Open to doctoral research and collaboration",
  name: profile.name,
  summary:
    "Computer Science and Engineering researcher with an M.Tech from Kalyani Government Engineering College. I work on privacy-preserving machine learning: federated learning, deep learning, medical image analysis and homomorphic encryption.",
  tools: [
    { short: "Py", label: "Python" },
    { short: "PT", label: "PyTorch" },
    { short: "FL", label: "Flower" },
    { short: "HE", label: "TenSEAL" },
  ],
} as const;

/** Widths of the decorative barcode bars, from the seed text. */
export function barcodeBars(seed: string): number[] {
  return [...seed].flatMap((char) => {
    const code = char.charCodeAt(0);
    return [1 + (code % 3), 1 + ((code >> 2) % 2)];
  });
}
