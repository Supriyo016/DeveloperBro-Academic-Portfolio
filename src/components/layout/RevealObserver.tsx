"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Sections fade and rise into view, and play again every time they come back on screen.
// Every <section> inside <main> takes part automatically, except inside the home carousel.
const AUTO = "main section:not([aria-roledescription] section):not(.no-reveal)";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.ready = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle("is-visible", entry.isIntersecting);
      },
      { rootMargin: "0px 0px -6% 0px" },
    );

    const seen = new WeakSet<Element>();
    const watch = () => {
      document.querySelectorAll(AUTO).forEach((element) => element.classList.add("reveal"));
      document.querySelectorAll(".reveal").forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        observer.observe(element);
      });
    };
    watch();

    const mutations = new MutationObserver(watch);
    mutations.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
