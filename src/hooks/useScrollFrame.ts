"use client";

import { useEffect, useRef } from "react";

export function useScrollFrame(onFrame: () => void) {
  const latest = useRef(onFrame);

  useEffect(() => {
    latest.current = onFrame;
  });

  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      latest.current();
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(run);
    };
    run();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
}
