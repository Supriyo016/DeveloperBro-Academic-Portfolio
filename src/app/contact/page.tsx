import { FlaskConical, GraduationCap, Mail } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { CollaborationScene } from "@/components/illustrations/scenes-research";
import { MailScene } from "@/components/illustrations/scenes-objects";
import { CopyButton } from "@/components/shared/CopyButton";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Supriyo Sarkar about doctoral opportunities or research collaboration.",
  alternates: { canonical: "/contact" },
};

const invitations = [
  { Icon: GraduationCap, title: "Doctoral research", body: "I am looking for PhD positions in privacy-preserving and federated machine learning." },
  { Icon: FlaskConical, title: "Research collaboration", body: "I welcome collaboration on federated learning, medical imaging or model compression." },
];

export default function ContactPage() {
  return (
    <div className="container-page pt-12 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Let&apos;s talk research</h1>
          <p className="mt-4 max-w-md text-lg text-ink-2">Questions about my work, doctoral positions and technical discussions are all welcome.</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center gap-2 break-all text-primary">
              <Mail className="size-4 shrink-0" aria-hidden />
              {profile.email}
            </a>
            <CopyButton value={profile.email} label="Copy email" />
          </div>
          <SocialLinks className="mt-3 -ml-2" />

          <ul className="mt-6 space-y-3">
            {invitations.map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <Icon className="size-4.5" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-[0.95rem] text-ink-2">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
      <div className="mx-auto mt-10 hidden max-w-2xl grid-cols-2 gap-6 md:grid">
        <CollaborationScene />
        <MailScene />
      </div>
    </div>
  );
}
