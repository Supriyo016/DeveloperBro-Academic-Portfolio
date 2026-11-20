// Visuals for the DeveloperBro. portfolio project page. Pure CSS 3D and SVG, server-rendered.

const LAYERS = [
  { name: "Browser", detail: "Interactive islands: charts, filters, assistant, calendar", color: "var(--series-5)" },
  { name: "Proxy", detail: "A fresh CSP nonce and security headers on every request", color: "var(--accent)" },
  { name: "Server components", detail: "Pages render on the server by default", color: "var(--primary)" },
  { name: "Typed content", detail: "TypeScript and JSON data, 29 MDX research notes", color: "var(--series-3)" },
  { name: "Thesis notebooks", detail: "Results and figures exported by scripts, never typed by hand", color: "var(--gold)" },
];

/** The site's layers as a floating 3D stack, with data rising from the notebooks to the browser. */
export function LayerStack3D() {
  return (
    <div className="stack-stage" role="img" aria-label="A 3D stack of the site's layers, from the thesis notebooks at the bottom, through typed content, server components and the security proxy, to the browser at the top, with data rising through them.">
      <div className="stack-scene">
        {LAYERS.map((layer, index) => (
          <div key={layer.name} className="stack-layer" style={{ ["--level" as string]: LAYERS.length - 1 - index, ["--layer" as string]: layer.color }}>
            <span className="stack-name">{layer.name}</span>
          </div>
        ))}
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="stack-packet" style={{ animationDelay: `${dot * 1.1}s` }} />
        ))}
      </div>
    </div>
  );
}

export function LayerLegend() {
  return (
    <ol className="space-y-2">
      {LAYERS.map((layer) => (
        <li key={layer.name} className="flex gap-3">
          <span className="mt-1.5 size-3 shrink-0 rounded-sm" style={{ background: layer.color }} aria-hidden />
          <span>
            <span className="font-medium text-ink">{layer.name}.</span> <span className="text-ink-2">{layer.detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

const TECH = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "MDX", "KaTeX", "Shiki", "Zod", "Resend", "Vitest", "Playwright", "Vercel"];

/** The stack orbiting the site's logo on a tilted 3D ring. */
export function TechOrbit() {
  return (
    <div className="orbit-stage" role="img" aria-label={`The technologies behind the site orbiting its logo: ${TECH.join(", ")}.`}>
      <div className="orbit-core">D.</div>
      <div className="orbit-ring">
        {TECH.map((tech, index) => (
          <span key={tech} className="orbit-item" style={{ ["--i" as string]: index, ["--n" as string]: TECH.length }}>
            <span className="orbit-face">
              <span className="orbit-chip">{tech}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
