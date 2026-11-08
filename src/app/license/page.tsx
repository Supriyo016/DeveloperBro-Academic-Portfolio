import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { LICENSE_OWNER, LICENSE_TEXT } from "@/content/license";

export const metadata: Metadata = {
  title: "License",
  description: `All rights reserved. The code, design and content of this portfolio belong to ${LICENSE_OWNER}.`,
  alternates: { canonical: "/license" },
};

export default function LicensePage() {
  return (
    <>
      <PageHeader
        eyebrow="License"
        title="All rights reserved"
        intro="You are welcome to read, link to and cite this work. Copying, reusing or redeploying any part of it needs my written permission."
      />
      <div className="container-page max-w-3xl">
        <pre className="card overflow-x-auto p-5 font-mono text-[0.82rem] leading-relaxed whitespace-pre-wrap text-ink-2 sm:p-7">{LICENSE_TEXT}</pre>
      </div>
    </>
  );
}
