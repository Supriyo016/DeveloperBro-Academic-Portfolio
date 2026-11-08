import type { ReactNode } from "react";

// A template remounts on every navigation, so each page plays the entrance transition.
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
