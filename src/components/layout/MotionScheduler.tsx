"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Keeps the always-moving illustrations cheap: a scene only animates while it is on screen.
// Off-screen scenes get data-offscreen="true", which pauses their animations in CSS.
export function MotionScheduler() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.setAttribute("data-offscreen", entry.isIntersecting ? "false" : "true");
      },
      { rootMargin: "120px 0px" },
    );
    const scenes = document.querySelectorAll("svg[role='img']");
    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
