import { describe, expect, it } from "vitest";
import { initialState, normalise, respond, searchArticles, welcome, type ChatState } from "@/lib/assistant/engine";
import { buildKnowledge } from "@/lib/assistant/knowledge";
import { getArticleMetas } from "@/lib/articles";

const kb = buildKnowledge(getArticleMetas());
const fixed = () => 0;
const ask = (text: string, state: ChatState = initialState) => respond(text, state, kb, fixed);
const all = (text: string) => {
  const { reply } = ask(text);
  return [...reply.text, ...(reply.links ?? []).map((link) => `${link.label} ${link.href}`)].join(" ");
};

describe("site assistant", () => {
  it("greets and introduces itself honestly as an assistant, not as the owner", () => {
    expect(all("hello")).toMatch(/I'm Bro/);
    expect(all("are you a bot?")).toMatch(/not Supriyo/);
    expect(welcome(kb).text.join(" ")).toMatch(/assistant/);
  });

  it("answers the main topics from site content", () => {
    expect(all("Tell me about the M.Tech work")).toContain("94.59%");
    expect(all("what about the quantum research")).toContain("IBM Quantum");
    expect(all("show me your projects")).toContain("Third Hand-Eye");
    expect(all("Tell me about the arduino device")).toContain("HC-SR04");
    expect(all("tour india")).toContain("Smart India Hackathon 2022");
    expect(all("how was this website built")).toContain("Next.js");
    expect(all("How can I contact Supriyo for a PhD position?")).toContain(kb.email);
    expect(all("can I download the cv")).toContain("/documents/academic-cv-public.pdf");
    expect(all("who supervised the dissertation")).toContain("Mandal");
  });

  it("lists exactly the two research works and three projects", () => {
    const research = ask("what research has been done").reply;
    expect(research.links?.map((link) => link.href)).toEqual(["/research/federated-alzheimers-detection", "/research/quantum-gate-assessment"]);
    expect(kb.projects.map((project) => project.slug)).toEqual(["third-hand-eye", "tour-india", "developerbro-academic-portfolio"]);
  });

  it("never states marks, and points to About Me instead", () => {
    const text = all("what was the CGPA?");
    expect(text).toContain("/about#qualifications");
    expect(text).not.toMatch(/\d\.\d{2}\s*\/\s*10|\d{2}\.\d{2}%/);
    expect(all("tell me about the education")).not.toMatch(/CGPA|\d\.\d{2}\s*\/\s*10/);
  });

  it("follows up on the last topic", () => {
    const first = ask("tell me about the alzheimer dissertation");
    const more = respond("tell me more", first.state, kb, fixed);
    expect(more.reply.text.join(" ")).toContain("EfficientNetB0");
  });

  it("remembers a visitor's name", () => {
    const first = ask("my name is Priya");
    expect(first.reply.text[0]).toContain("Priya");
    expect(respond("hi", first.state, kb, fixed).reply.text[0]).toContain("Priya");
    expect(ask("I am looking for projects").state.visitorName).toBeUndefined();
  });

  it("finds research notes by topic and falls back politely", () => {
    expect(searchArticles("data leakage duplicates", kb.articles).map((article) => article.slug)).toContain("duplicates-in-an-augmented-dataset");
    expect(all("posts about ckks")).toMatch(/CKKS/);
    const unknown = ask("what is the capital of mongolia").reply;
    expect(unknown.text.join(" ")).toMatch(/not sure|don't have/);
  });

  it("does not let a greeting hide a real question", () => {
    expect(all("hi, show me the projects")).toContain("Tour India");
  });

  it("normalises input safely", () => {
    expect(normalise("  What's <script>CKKS</script>?? ")).toBe("whats script ckks script");
    expect(ask("x".repeat(5000)).reply.text.length).toBeGreaterThan(0);
  });

  it("only links to the site, verified accounts or email", () => {
    const allowed = [/^\//, /^mailto:/, /^https:\/\/(github\.com\/Supriyo016|www\.linkedin\.com|x\.com|www\.instagram\.com|www\.facebook\.com|www\.youtube\.com|supriyo016\.github\.io)/];
    const questions = ["hello", "projects", "contact", "social links", "third hand eye", "tour india", "this website", "research", "cv", "blog", "what is ckks", "cost of encryption"];
    for (const question of questions) {
      for (const link of ask(question).reply.links ?? []) {
        expect(allowed.some((pattern) => pattern.test(link.href)), `${question}: ${link.href}`).toBe(true);
      }
    }
  });
});
