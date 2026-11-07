import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.siteName} The research portfolio of ${profile.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#0c1024", color: "#eef0fa" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="84" height="84" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="12" fill="#3a3eb4" />
            <path fillRule="evenodd" fill="#fffdf8" d="M10 10h14c9 0 15 6 15 14s-6 14-15 14H10ZM16 16v16h8c5.5 0 9-3.5 9-8s-3.5-8-9-8Z" />
            <path d="M20 19.5l5.5 4.5-5.5 4.5" fill="none" stroke="#74d3e2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="40.5" cy="38" r="3.5" fill="#74d3e2" />
          </svg>
          <div style={{ display: "flex", fontSize: 46 }}>{profile.siteName}</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.1 }}>{profile.headline}</div>
        <div style={{ display: "flex", fontSize: 32, color: "#a5aaff" }}>
          {profile.name}, {profile.role}
        </div>
      </div>
    ),
    size,
  );
}
