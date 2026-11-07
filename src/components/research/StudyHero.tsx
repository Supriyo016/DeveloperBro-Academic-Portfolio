import Image from "next/image";
import { QuantumScene } from "@/components/illustrations/scenes-extra";
import { Anim, il, Scene, Sparkle } from "@/components/illustrations/base";
import { mriSamples } from "@/content/data/alzheimers-figures";
import type { ResearchStudy } from "@/types/content";

/** Real scans from the dissertation dataset in a fanned stack, with a scan beam and the five clients orbiting. */
function MriHero() {
  const picks = [mriSamples.NonDemented?.[3], mriSamples.MildDemented?.[0], mriSamples.VeryMildDemented?.[4]].filter(Boolean);
  const labels = ["Non-demented", "Mild", "Very mild"];
  return (
    <div className="study-hero relative mx-auto aspect-square w-full max-w-[26rem]" aria-hidden>
      <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle,var(--lavender),transparent_70%)] opacity-70 il-glow" />
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <ellipse cx="200" cy="200" rx="186" ry="186" fill="none" stroke="var(--primary)" strokeOpacity="0.25" strokeDasharray="4 10" className="il-dash" />
        {[0, 1, 2, 3, 4].map((index) => (
          <g key={index} className="il-orbit" style={{ offsetPath: 'path("M14 200a186 186 0 1 0 372 0a186 186 0 1 0 -372 0")', animationDuration: "22s", animationDelay: `${index * -4.4}s`, offsetRotate: "0deg" }}>
            <circle r="15" fill="var(--surface)" stroke="var(--series-1)" strokeWidth="2" />
            <path d="M-4-7h8v4h4v6h-4v4h-8v-4h-4v-6h4Z" fill="var(--series-1)" />
          </g>
        ))}
      </svg>
      {picks.map((sample, index) => (
        <figure
          key={sample?.src}
          className="mri-card absolute top-1/2 left-1/2 w-[52%] overflow-hidden rounded-2xl border-4 border-surface bg-black shadow-xl"
          style={{ ["--r" as string]: `${(index - 1) * 11}deg`, ["--dx" as string]: `${(index - 1) * 26}%`, animationDelay: `${index * -2}s`, zIndex: index === 1 ? 3 : 1 }}
        >
          {sample && <Image src={sample.src} alt="" width={sample.width} height={sample.height} className="aspect-square h-auto w-full object-cover" priority={index === 1} sizes="220px" />}
          <span className="mri-scan" />
          <figcaption className="absolute bottom-1.5 left-1.5 rounded-full bg-black/65 px-2 text-[0.7rem] text-white">{labels[index]}</figcaption>
        </figure>
      ))}
      <div className="hero-chip absolute top-6 right-2 z-10 rounded-full bg-surface px-3 py-1 text-sm font-medium shadow-lg">
        <span className="text-ok-ink">94.59%</span> accuracy
      </div>
      <div className="hero-chip absolute bottom-8 left-0 z-10 rounded-full bg-surface px-3 py-1 text-sm shadow-lg" style={{ animationDelay: "-2s" }}>
        5 clients · 30 rounds
      </div>
    </div>
  );
}

/** Teacher network passing knowledge to a smaller student, through an encrypted channel. */
function DistillHero() {
  const teacher = [
    [60, [120, 170, 220, 270, 320]],
    [120, [100, 150, 200, 250, 300, 350]],
    [180, [130, 180, 230, 280]],
  ] as const;
  const student = [
    [300, [170, 230, 290]],
    [350, [200, 260]],
  ] as const;
  return (
    <Scene viewBox="0 0 400 420" label="A large teacher network passing soft predictions through a padlock to a small student network." className="mx-auto h-auto w-full max-w-[26rem]">
      <circle cx="200" cy="220" r="180" fill={il.soft} />
      {teacher.slice(0, -1).map(([x, ys], layer) =>
        ys.map((y) => (teacher[layer + 1]?.[1] ?? []).map((y2) => <path key={`${x}-${y}-${y2}`} d={`M${x} ${y}L${teacher[layer + 1]?.[0]} ${y2}`} stroke={il.line} strokeWidth="1.2" />)),
      )}
      {student[0][1].map((y) => student[1][1].map((y2) => <path key={`s-${y}-${y2}`} d={`M300 ${y}L350 ${y2}`} stroke={il.line} strokeWidth="1.2" />))}
      {teacher.map(([x, ys]) => ys.map((y, index) => <circle key={`${x}-${y}`} cx={x} cy={y} r="11" fill={il.primary} className="il-pulse" style={{ animationDelay: `${index * 0.2}s` }} />))}
      {student.map(([x, ys]) => ys.map((y, index) => <circle key={`${x}-${y}`} cx={x} cy={y} r="10" fill={il.cyan} className="il-pulse" style={{ animationDelay: `${index * 0.3}s` }} />))}
      <path id="kd-flow" d="M190 230C220 200 250 200 288 230" fill="none" stroke={il.amber} strokeWidth="3" strokeDasharray="6 7" className="il-dash" />
      {[0, 1, 2].map((index) => (
        <circle key={index} r="5" fill={il.amber} className="il-packet" style={{ offsetPath: 'path("M190 230C220 200 250 200 288 230")', animationDelay: `${index * 1.6}s` }} />
      ))}
      <g transform="translate(239 168)">
        <rect x="-15" y="0" width="30" height="24" rx="6" fill={il.amber} />
        <path d="M-9 0v-6a9 9 0 0 1 18 0v6" fill="none" stroke={il.amber} strokeWidth="4" />
        <circle cy="12" r="3.5" fill={il.paper} />
      </g>
      <text x="120" y="392" textAnchor="middle" fontSize="15" fontWeight="600" fill={il.ink}>Teacher</text>
      <text x="120" y="408" textAnchor="middle" fontSize="11" fill={il.ink}>ResNet18</text>
      <text x="325" y="352" textAnchor="middle" fontSize="15" fontWeight="600" fill={il.ink}>Student</text>
      <text x="325" y="368" textAnchor="middle" fontSize="11" fill={il.ink}>light CNN</text>
      <Anim kind="il-bob">
        <text x="210" y="140" fontSize="13" fill={il.ink} fontFamily="var(--font-geist-mono), monospace">soft labels</text>
      </Anim>
      <Sparkle x={330} y={110} size={9} />
      <Sparkle x={60} y={70} size={7} color={il.cyan} delay={0.8} />
    </Scene>
  );
}

export function StudyHero({ study }: { study: ResearchStudy }) {
  if (study.hero === "mri") return <MriHero />;
  if (study.hero === "quantum") return <div className="mx-auto w-full max-w-[26rem]"><QuantumScene /></div>;
  if (study.hero === "distill") return <DistillHero />;
  return null;
}
