import { describe, expect, it } from "vitest";
import { classOrder, clientDistribution, experimentRuns } from "@/content/data/alzheimers";
import { publications, publicationStatuses } from "@/content/publications";
import { projects } from "@/content/projects";
import { studies } from "@/content/research";
import { researchAreas, researchMap } from "@/content/research-areas";
import { skillGroups } from "@/content/skills";
import { resolveWork } from "@/lib/work";

describe("research results data", () => {
  it("holds nine runs of thirty rounds", () => {
    expect(experimentRuns).toHaveLength(9);
    for (const run of experimentRuns) expect(run.accuracyByRound).toHaveLength(30);
  });

  it("reports final-round accuracy, not a selected best round", () => {
    for (const run of experimentRuns) {
      expect(Math.abs((run.accuracyByRound.at(-1) ?? 0) - run.accuracy)).toBeLessThan(0.001);
    }
  });

  it("agrees with the headline figures on the case study", () => {
    const best = experimentRuns.find((run) => run.experiment === 7);
    expect(best?.backboneLabel).toBe("Custom CNN");
    expect(best?.algorithm).toBe("FedAvg");
    expect(best?.accuracy).toBe(0.9459);
    expect(best?.macroF1).toBe(0.948);
    expect(best?.macroAuc).toBe(0.99504);
    const stats = studies[0]?.stats?.map((stat) => stat.value);
    expect(stats).toContain("94.59%");
    expect(stats).toContain("94.80%");
    expect(stats).toContain("99.50%");
  });

  it("takes FedDyn AUC from the per-class AUCs on its ROC figure, as the cells printed no global value", () => {
    const expected: Record<string, number> = { "custom-cnn": 0.99243, mobilenetv2: 0.99057, efficientnetb0: 0.9376 };
    for (const run of experimentRuns.filter((item) => item.algorithm === "FedDyn")) {
      expect(run.aucSource).toBe("roc-figure");
      expect(run.macroAuc).toBeCloseTo(expected[run.backbone] ?? 0, 4);
    }
    for (const run of experimentRuns.filter((item) => item.algorithm !== "FedDyn")) expect(run.aucSource).toBeUndefined();
  });

  it("supports the finding that very mild is the hardest class in all nine runs", () => {
    for (const run of experimentRuns) {
      const lowest = classOrder.reduce((a, b) => (run.perClass[a].f1 <= run.perClass[b].f1 ? a : b));
      expect(lowest).toBe("VeryMildDemented");
    }
  });

  it("client partition sums to the training pool", () => {
    const total = clientDistribution.reduce((sum, row) => sum + Object.values(row.counts).reduce((a, b) => a + b, 0), 0);
    expect(total).toBe(35200);
  });
});

describe("content claims", () => {
  it("does not claim the dissertation trained under encryption", () => {
    const text = JSON.stringify(studies[0]).toLowerCase();
    expect(text).not.toContain("nine encrypted");
    expect(text).not.toContain("minimal accuracy loss");
    expect(text).not.toContain("258");
    expect(text).not.toContain("38.7");
  });

  it("does not claim real hardware or measured costs without evidence", () => {
    const text = JSON.stringify(studies).toLowerCase();
    // Only the B.Tech study ran on IBM hardware, and its notebooks name the backends.
    const others = JSON.stringify(studies.filter((study) => study.slug !== "quantum-gate-assessment")).toLowerCase();
    expect(others).not.toContain("real ibm");
    expect(others).not.toContain("quantum hardware");
    const quantum = JSON.stringify(studies.find((study) => study.slug === "quantum-gate-assessment")).toLowerCase();
    for (const backend of ["ibm_perth", "ibm_lagos", "ibmq_quito"]) expect(quantum).toContain(backend);
    expect(text).not.toContain("anova");
    expect(text).not.toMatch(/p\s*<\s*0\.0/);
  });

  it("keeps dataset counts consistent with the split", () => {
    const classes = studies[0]?.dataset?.classes ?? [];
    expect(classes.reduce((sum, row) => sum + row.total, 0)).toBe(44000);
    expect(classes.reduce((sum, row) => sum + row.train, 0)).toBe(35200);
    expect(classes.reduce((sum, row) => sum + row.test, 0)).toBe(8800);
  });

  it("never lists a dissertation as a publication", () => {
    for (const publication of publications) {
      expect(publicationStatuses).toContain(publication.status);
      expect(publication.title.toLowerCase()).not.toContain("dissertation");
    }
  });

  it("marks only verified publication statuses", () => {
    expect(publications.filter((item) => item.status !== "In Progress")).toHaveLength(0);
  });
});

describe("content references", () => {
  it("resolves every work reference", () => {
    const refs = [...researchAreas.flatMap((area) => area.related), ...skillGroups.flatMap((group) => group.skills.flatMap((skill) => skill.usedIn ?? []))];
    for (const ref of refs) expect(() => resolveWork(ref)).not.toThrow();
  });

  it("links projects to real research pages", () => {
    for (const project of projects.filter((item) => item.researchSlug)) {
      expect(studies.some((study) => study.slug === project.researchSlug)).toBe(true);
    }
  });

  it("has a valid research map", () => {
    const ids = new Set(Object.values(researchMap.nodes).flat().map((node) => node.id));
    for (const [from, to] of researchMap.edges) {
      expect(ids.has(from)).toBe(true);
      expect(ids.has(to)).toBe(true);
    }
  });

  it("uses no placeholder links", () => {
    for (const project of projects) {
      for (const url of [project.repo, project.live, project.demo]) {
        if (url) expect(url).toMatch(/^https:\/\/\S+\.\S+/);
      }
    }
  });
});
