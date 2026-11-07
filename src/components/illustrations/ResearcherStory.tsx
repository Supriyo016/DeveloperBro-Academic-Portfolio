import { Anim, il, Scene, Sparkle, toon, ToonEyes, ToonFace, ToonGlasses, ToonMouth } from "./base";

/*
 * A 28-second looping story, told in CSS keyframes (see "Researcher story" in globals.css):
 *   0–22%   reads a book, flipping pages, eyes scanning the lines
 *   22–34%  puts the book down and sips coffee
 *   34–50%  writes notes
 *   50–58%  swaps the book for a new one from the shelf
 *   58–76%  notices you, waves and says hello
 *   76–90%  wonders about a result, then has an idea
 *   90–100% invites you to explore, and picks up the new book
 * Every act is a separate group whose visibility follows its window, so with reduced motion the scene rests on
 * the friendly "hello" frame.
 */

const SHOULDER_L = "214 252";

function OpenBook({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <g>
      <path d="M-62-4c20-8 42-8 62 2v46c-20-10-42-10-62-2Z" fill={il.paper} stroke={il.line} />
      <path d="M62-4c-20-8-42-8-62 2v46c20-10 42-10 62-2Z" fill={il.paper2} stroke={il.line} />
      {flip && <path d="M0-2c14-8 34-8 52-2v44c-18-6-38-6-52 2Z" fill={il.paper} stroke={il.line} className="il-page" />}
      <path d="M-52 8c12-4 26-4 40 0M-52 18c12-4 26-4 40 0M-52 28c12-4 26-4 34 0M12 8c12-4 26-4 40 0M12 18c12-4 26-4 34 0" stroke={il.line} strokeWidth="2" fill="none" />
      <path d="M-64 40c22-10 44-10 64 2 20-12 42-12 64-2v6c-22-8-44-8-64 4-20-12-42-12-64-4Z" fill={color} />
    </g>
  );
}

function Bubble({ x, y, w, lines, think = false, tail }: { x: number; y: number; w: number; lines: string[]; think?: boolean; tail: "left" | "right" }) {
  const h = 22 + lines.length * 19;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="16" fill={il.paper} stroke={il.primary} strokeWidth="2" />
      {think ? (
        <g fill={il.paper} stroke={il.primary} strokeWidth="2">
          <circle cx={tail === "left" ? 22 : w - 22} cy={h + 12} r="7" />
          <circle cx={tail === "left" ? 10 : w - 10} cy={h + 28} r="4.5" />
        </g>
      ) : (
        <path d={tail === "left" ? `M${w - 46} ${h - 1}l26 22-4-22Z` : `M46 ${h - 1}l-26 22 4-22Z`} fill={il.paper} stroke={il.primary} strokeWidth="2" strokeLinejoin="round" />
      )}
      {!think && <path d={tail === "left" ? `M${w - 44} ${h - 2}h22` : `M24 ${h - 2}h22`} stroke={il.paper} strokeWidth="4" />}
      {lines.map((line, index) => (
        <text key={line} x="16" y={27 + index * 19} fontSize="15" fontWeight={index === 0 ? 600 : 400} fill={il.onPaper}>
          {line}
        </text>
      ))}
    </g>
  );
}

export function ResearcherStory() {
  return (
    <Scene
      viewBox="0 0 480 440"
      label="An animated researcher at a desk reads a book, flips pages, sips coffee, writes notes and swaps books. Now and then the researcher notices you, waves and says hello, wonders why the earliest stage of Alzheimer's is hardest to detect, has an idea and invites you to explore."
    >
      <circle cx="240" cy="226" r="204" fill={il.soft} />

      {/* window with a night sky */}
      <g transform="translate(330 44)">
        <rect width="112" height="92" rx="10" fill={il.coat} />
        <rect x="6" y="6" width="100" height="80" rx="6" fill={toon.coat2} />
        <circle cx="78" cy="28" r="12" fill={il.amber} className="il-glow" />
        <circle cx="84" cy="24" r="10" fill={toon.coat2} />
        {[[22, 22], [44, 46], [20, 64], [64, 66], [90, 58]].map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r="2" fill={il.paper} className="il-twinkle" style={{ animationDelay: `${index * 0.4}s` }} />
        ))}
        <path d="M56 6v80M6 46h100" stroke={il.coat} strokeWidth="4" />
      </g>

      {/* bookshelf */}
      <g transform="translate(34 70)">
        <rect y="58" width="122" height="8" rx="3" fill={il.wood} />
        <rect y="132" width="122" height="8" rx="3" fill={il.wood} />
        {[[6, 14, il.primary], [22, 10, il.amber], [34, 16, il.cyan], [52, 12, il.lavender], [66, 8, il.primary], [76, 14, il.amber]].map(([x, w, color], index) => (
          <rect key={index} x={x as number} y={index % 2 ? 14 : 8} width={w as number} height={index % 2 ? 44 : 50} rx="2" fill={color as string} />
        ))}
        <path d="M94 58l14-46 10 4-12 42Z" fill={il.cyan} />
        {[[6, 18, il.amber], [26, 12, il.cyan], [40, 16, il.primary], [58, 14, il.lavender]].map(([x, w, color], index) => (
          <rect key={index} x={x as number} y={index % 2 ? 90 : 84} width={w as number} height={index % 2 ? 42 : 48} rx="2" fill={color as string} />
        ))}
        {/* the gap where the new book came from */}
        <rect x="78" y="88" width="14" height="44" rx="2" fill={il.cyan} className="il-story-shelf" />
      </g>

      {/* wall clock */}
      <g transform="translate(194 50)">
        <circle r="22" fill={il.paper} stroke={il.line} strokeWidth="3" />
        <Anim kind="il-clock" origin="0 0">
          <path d="M0 0v-15" stroke={il.ink} strokeWidth="2.5" strokeLinecap="round" />
        </Anim>
        <path d="M0 0l9 4" stroke={il.ink} strokeWidth="3" strokeLinecap="round" />
        <circle r="2.5" fill={il.amber} />
      </g>

      {/* the researcher */}
      <g>
        <Anim kind="il-breathe" origin="250 336">
          <path d="M178 336c2-50 18-84 46-92h52c28 8 44 42 46 92Z" fill={toon.lavender} />
          <path d="M232 244l18 24 18-24Z" fill={toon.shirt} />
          <path d="M224 244l-10 18 30 22 6-16ZM276 244l10 18-30 22-6-16Z" fill={toon.coat2} />
        </Anim>
        <path d="M236 214h28v34c-8 8-20 8-28 0Z" fill={toon.skinShade} />

        <g className="il-story-head" style={{ transformOrigin: "250px 236px" }}>
          <g transform="translate(250 180) scale(1.32)">
            <ToonFace hair="short" beard />
            <g className="il-story-brow">
              <path d="M-19-9c4-4 10-4 14-1M5-10c4-3 10-3 14 1" fill="none" stroke={il.hair} strokeWidth="2.8" strokeLinecap="round" />
            </g>
            <ToonEyes look="il-story-look" />
            <ToonGlasses />
            <g className="il-story-quiet">
              <path d="M-7 18c3 4 11 4 14 0" fill="none" stroke="#7a2638" strokeWidth="2.4" strokeLinecap="round" />
            </g>
            <g className="il-story-talkwin">
              <ToonMouth kind="il-chatter" />
            </g>
          </g>
        </g>

        {/* reading: both hands hold the book up */}
        <g className="il-story-read">
          <path d="M214 252c-14 10-20 28-14 44l18 2c0-14 6-24 14-30Z" fill={toon.lavender} />
          <path d="M286 252c14 10 20 28 14 44l-18 2c0-14-6-24-14-30Z" fill={toon.lavender} />
          <g transform="translate(250 262) rotate(-4)">
            <g className="il-story-held-a">
              <OpenBook color={il.amber} flip />
            </g>
            <g className="il-story-held-b">
              <OpenBook color={il.cyan} flip />
            </g>
          </g>
          <circle cx="198" cy="298" r="10" fill={toon.skin} />
          <circle cx="302" cy="298" r="10" fill={toon.skin} />
          <g fontFamily="var(--font-newsreader), serif" fontStyle="italic" fill={il.primary}>
            <text x="166" y="214" fontSize="22" className="il-float">Σ</text>
            <text x="318" y="206" fontSize="20" fill={il.cyan} className="il-float" style={{ animationDelay: "-2s" }}>∇</text>
          </g>
        </g>

        {/* coffee break */}
        <g className="il-story-sip">
          <Anim kind="il-bob">
            <path d="M286 252c18 6 18 26 4 34l-24-30" fill={toon.lavender} />
            <path d="M290 286c-10-14-16-30-18-50l-14 4c2 20 10 36 22 52Z" fill={toon.lavender} />
            <g transform="translate(250 222) rotate(-18)">
              <path d="M0-18h22v18a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5Z" fill={il.paper} stroke={il.line} />
              <path d="M22-12h3a5 5 0 0 1 0 10h-3" fill="none" stroke={il.line} strokeWidth="3" />
              <path d="M5-10h12" stroke={il.primary} strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="266" cy="232" r="9" fill={toon.skin} />
          </Anim>
          {[0, 1].map((index) => (
            <Anim key={index} kind="il-steam" delay={index * 1.2}>
              <path d={`M${252 + index * 10} 196c-5-6 5-10 0-16`} fill="none" stroke={il.line} strokeWidth="2.5" strokeLinecap="round" />
            </Anim>
          ))}
        </g>

        {/* writing notes */}
        <g className="il-story-write">
          <path d="M286 252c14 12 26 36 30 66l-16 6c-6-24-14-42-26-54Z" fill={toon.lavender} />
          <Anim kind="il-write">
            <circle cx="312" cy="322" r="10" fill={toon.skin} />
            <path d="M314 324l22-32" stroke={il.primary} strokeWidth="4" strokeLinecap="round" />
            <path d="M334 294l4-6" stroke={il.amber} strokeWidth="4" strokeLinecap="round" />
          </Anim>
        </g>

        {/* waving hello */}
        <g className="il-story-wave">
          <Anim kind="il-wave" origin={SHOULDER_L}>
            <path d="M214 252c-18-10-30-30-34-54l16-6c4 20 12 34 26 44Z" fill={toon.lavender} />
            <circle cx="186" cy="188" r="11" fill={toon.skin} />
            <path d="M178 182l-6-10M184 178l-3-12M191 178l1-12" stroke={il.skinShade} strokeWidth="3.5" strokeLinecap="round" />
          </Anim>
        </g>

        {/* resting arms */}
        <g className="il-story-rest-l">
          <path d="M214 252c-14 14-18 46-10 74h20c-2-22 2-44 10-60Z" fill={toon.lavender} />
          <ellipse cx="216" cy="328" rx="13" ry="8" fill={toon.skin} />
        </g>
        <g className="il-story-rest-r">
          <path d="M286 252c14 14 18 46 10 74h-20c2-22-2-44-10-60Z" fill={toon.lavender} />
          <ellipse cx="284" cy="328" rx="13" ry="8" fill={toon.skin} />
        </g>
      </g>

      {/* desk */}
      <rect x="54" y="334" width="380" height="16" rx="6" fill={il.wood} />
      <path d="M78 350h14l-4 66h-8ZM398 350h14l-2 66h-8Z" fill={il.wood} opacity="0.75" />

      {/* the book stack on the desk */}
      <g transform="translate(74 334)">
        <rect y="-16" width="88" height="16" rx="3" fill={il.primary} />
        <rect x="6" y="-30" width="76" height="14" rx="3" fill={il.lavender} />
        <rect x="-2" y="-46" width="82" height="16" rx="3" fill={il.amber} />
      </g>

      {/* books on the desk between acts */}
      <g transform="translate(250 312) scale(0.8)">
        <g className="il-story-desk-a">
          <OpenBook color={il.amber} />
        </g>
        <g className="il-story-desk-b">
          <OpenBook color={il.cyan} />
        </g>
      </g>

      {/* the swap: the old book flies to the stack, a new one comes off the shelf */}
      <g className="il-story-fly-out">
        <rect x="200" y="300" width="80" height="16" rx="3" fill={il.amber} />
      </g>
      <g className="il-story-fly-in">
        <rect x="112" y="158" width="14" height="44" rx="2" fill={il.cyan} />
      </g>

      {/* notebook */}
      <g transform="translate(316 312)">
        <rect width="62" height="22" rx="3" fill={il.paper} stroke={il.line} transform="skewX(-18)" />
        <path d="M2 8h40M0 15h30" stroke={il.primary} strokeWidth="2" strokeLinecap="round" className="il-story-lines" />
      </g>

      {/* mug */}
      <g className="il-story-mug">
        <path d="M392 334v-22h24v17a5 5 0 0 1-5 5h-14a5 5 0 0 1-5-5Z" fill={il.paper} stroke={il.line} />
        <path d="M416 316h3a5 5 0 0 1 0 10h-3" fill="none" stroke={il.line} strokeWidth="3" />
        <path d="M397 320h14" stroke={il.primary} strokeWidth="3" strokeLinecap="round" />
        {[0, 1].map((index) => (
          <Anim key={index} kind="il-steam" delay={index * 1.4}>
            <path d={`M${398 + index * 10} 306c-5-6 5-10 0-16`} fill="none" stroke={il.line} strokeWidth="2.5" strokeLinecap="round" />
          </Anim>
        ))}
      </g>

      {/* speech and thought */}
      <g className="il-story-hello">
        <Bubble x={22} y={124} w={186} lines={["Oh! Hello there 👋", "Nice of you to visit."]} tail="left" />
      </g>
      <g className="il-story-think">
        <Bubble x={280} y={150} w={194} lines={["Hmm… why is Very Mild", "always the hardest? 🤔"]} think tail="left" />
      </g>
      <g className="il-story-aha">
        <g transform="translate(250 84)">
          <circle r="26" fill={il.amber} opacity="0.25" className="il-pulse" />
          <path d="M0-18a14 14 0 0 1 8 25v6h-16v-6a14 14 0 0 1 8-25Z" fill={il.amber} />
          <rect x="-7" y="15" width="14" height="6" rx="2" fill={il.line} />
        </g>
        <Bubble x={290} y={150} w={180} lines={["Aha! Group Norm,", "write that down! ✍️"]} tail="right" />
        <Sparkle x={196} y={92} size={9} />
        <Sparkle x={306} y={86} size={7} color={il.cyan} delay={0.3} />
      </g>
      <g className="il-story-bye">
        <Bubble x={22} y={124} w={196} lines={["Make yourself at home.", "Go on, explore! ✨"]} tail="left" />
      </g>

      <Sparkle x={300} y={34} size={7} delay={0.5} />
    </Scene>
  );
}
