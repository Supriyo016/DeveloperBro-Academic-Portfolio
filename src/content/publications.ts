import type { Publication, PublicationStatus } from "@/types/content";

export const publicationStatuses: PublicationStatus[] = ["Published", "Accepted", "Under Review", "Preprint", "In Progress"];

export const publications: Publication[] = [
  {
    title: "Knowledge distillation for CKKS-secured federated learning",
    status: "In Progress",
    authors: ["Supriyo Sarkar"],
    summary: "Working title. Experiments are under way. Preliminary development runs are discussed in my research notes, and no paper results have been released.",
  },
];
