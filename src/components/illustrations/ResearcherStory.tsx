import { Anim, il, Scene, Sparkle, toon, ToonEyes, ToonFace, ToonGlasses, ToonMoustache, ToonMouth } from "./base";
import { Arm, BookBack, BookGrip, SHOULDER_L, SHOULDER_R, Torso } from "./body";

/*
 * A 28-second looping story, told in CSS keyframes (see "Researcher story" in globals.css, and the overrides in
 * toon.css):
 *   0–22%   reads a book held up in both hands (we see its cover), a page turning now and then, eyes on the lines
 *   22–34%  puts the book down and sips coffee, the mug at his lips
 *   34–50%  writes notes, the pen tip on the notebook
 *   50–58%  closes the book and puts it away on the book stack beside him
 *   58–76%  notices you, waves with an open hand and says hello
 *   76–90%  wonders about a result, chin on his fist, then has an idea and raises a finger
 *   90–100% invites you to explore, takes the book back off the stack and reads again
 * Every act is a separate group whose visibility follows its window. The windows switch with hard cuts (never two
 * poses or two copies of an object at once), 0% and 100% are the same frame, and with reduced motion the scene
 * rests on the friendly "hello" frame.
 *
 * The researcher is drawn in body units (see body.tsx): BODY places him behind the desk.
 */

const BODY = "translate(250 483.6) scale(1.32)";

function DeskBook({ color }: { color: string }) {
  return (
    <g>
      <path d="M-54 2c16-8 36-9 54-3 18-6 38-5 54 3l-3 6c-16-6-34-6-51 0-17-6-35-6-51 0Z" fill={color} />
      <path d="M-50 0c14-7 34-8 50-3 16-5 36-4 50 3l-2 4c-15-6-33-6-48-1-15-5-33-5-48 1Z" fill={il.paper} stroke={il.line} strokeWidth="1" />
      <path d="M0-3v8" stroke={il.line} strokeWidth="1" />
    </g>
  );
}

/** A closed book lying flat, seen from the front: cover edge, page block and spine. (x, y) is its top-left corner. */
function ClosedBook({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="80" height="16" rx="3" fill={il.amber} />
      <rect x="4" y="4" width="68" height="8" rx="1.5" fill={il.paper} />
      <path d="M8 6.5h60M8 9.5h60" stroke={il.paper2} strokeWidth="1" />
      <rect x="72" width="8" height="16" rx="2" fill="color-mix(in srgb, var(--il-amber) 72%, #000)" />
    </g>
  );
}

function Bubble({ x, y, w, lines, think = false, tail }: { x: number; y: number; w: number; lines: string[]; think?: boolean; tail: "left" | "right" }) {
  const h = 26 + lines.length * 19;
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

const sleeve = toon.lavender;

export function ResearcherStory() {
  return (
    <Scene
      viewBox="0 0 480 440"
      label="An animated bearded researcher with glasses sits at his desk. He reads a book held up in both hands, sips coffee, writes notes and puts the book away on a stack. Now and then he notices you, waves and says hello, wonders why the earliest stage of Alzheimer's is hardest to detect, has an idea and invites you to explore."
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
        <rect x="78" y="88" width="14" height="44" rx="2" fill={il.cyan} />
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

      {/* arms that reach out to the side go behind the torso, so the sleeve starts at the shoulder */}
      <g className="il-story-wave">
        <g transform={BODY}>
          <Arm shoulder={[-44, -166]} elbow={[-88, -148]} wrist={[-96, -198]} sleeve={sleeve} pose="open" flip foreKind="il-hi" />
        </g>
      </g>
      <g className="il-story-idea">
        <g transform={BODY}>
          <Arm shoulder={[-44, -166]} elbow={[-84, -140]} wrist={[-88, -192]} sleeve={sleeve} pose="point" flip />
        </g>
      </g>

      {/* the researcher: body and neck */}
      <g transform={BODY}>
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="sweater" color={sleeve} />
        </Anim>
        <path d="M-13-208h26v24c-8 7-18 7-26 0Z" fill={toon.skinShade} />
        <path d="M-13-200c8 4 18 4 26 0" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="3" />
      </g>

      {/* his head */}
      <g className="il-story-head" style={{ transformOrigin: "250px 236px" }}>
        <g transform="translate(250 180) scale(1.32)">
          <ToonFace hair="short" beard />
          <g className="il-story-brow">
            <path d="M-19-9c4-4 10-4 14-1M5-10c4-3 10-3 14 1" fill="none" stroke={il.hair} strokeWidth="2.8" strokeLinecap="round" />
          </g>
          <ToonEyes look="il-story-look" />
          <ToonGlasses />
          <g className="il-story-quiet">
            <ToonMouth kind="still" y={24.5} />
          </g>
          <g className="il-story-talkwin">
            <ToonMouth kind="chatter" y={24.5} />
          </g>
          <ToonMoustache />
        </g>
      </g>

      {/* desk, with a front panel */}
      <rect x="54" y="334" width="380" height="16" rx="6" fill={il.wood} />
      <rect x="64" y="350" width="360" height="66" fill={il.wood} opacity="0.8" />
      <path d="M244 350v66M150 382h40M298 382h40" stroke="#000" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="244" cy="418" rx="196" ry="7" fill={il.ground} />

      {/* the book stack on the desk */}
      <g transform="translate(74 334)">
        <rect y="-16" width="88" height="16" rx="3" fill={il.primary} />
        <rect x="6" y="-30" width="76" height="14" rx="3" fill={il.lavender} />
        <rect x="-2" y="-46" width="82" height="16" rx="3" fill={toon.coat2} />
      </g>
      <g className="il-story-stacked">
        <ClosedBook x={76} y={272} />
      </g>

      {/* the book lying open on the desk between reading and putting it away */}
      <g transform="translate(206 327) scale(0.8)">
        <g className="il-story-desk-a">
          <DeskBook color={il.amber} />
        </g>
      </g>

      {/* notebook lying on the desk */}
      <g>
        <path d="M256 333L262 321H290V333Z" fill={il.paper} stroke={il.line} strokeLinejoin="round" />
        <path d="M290 333V321H318L324 333Z" fill={il.paper} stroke={il.line} strokeLinejoin="round" />
        <path d="M296 325h20M297 329h22" stroke={il.paper2} strokeWidth="1.4" />
        <path d="M266 325.5h20M264 329.5h22" stroke={il.primary} strokeWidth="1.6" strokeLinecap="round" className="il-story-lines" />
      </g>

      {/* mug on the desk; the handle faces right */}
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

      {/* reading: the book's cover faces us, his fingers hook over its edges */}
      <g className="il-story-read">
        <g transform={BODY}>
          <Anim kind="il-bob-soft" origin="0 -148">
            <Arm shoulder={SHOULDER_R} elbow={[-80, -114]} wrist={[-62, -136]} sleeve={sleeve} pose="none" />
            <Arm shoulder={SHOULDER_L} elbow={[80, -114]} wrist={[62, -136]} sleeve={sleeve} pose="none" />
            <g transform="translate(0 -142)">
              <BookBack color={il.amber} flip />
              <BookGrip y={6} />
            </g>
          </Anim>
        </g>
        <g fontFamily="var(--font-newsreader), serif" fontStyle="italic" fill={il.primary}>
          <text x="118" y="236" fontSize="22" className="il-float">Σ</text>
          <text x="150" y="256" fontSize="20" fill={il.cyan} className="il-float" style={{ animationDelay: "-2s" }}>∇</text>
        </g>
      </g>

      {/* coffee break: the mug at his lips, his fingers through the handle */}
      <g className="il-story-sip">
        <g transform={BODY}>
          <g transform="translate(-1 -202) rotate(-8)">
            <path d="M-12-12h24v18a6 6 0 0 1-6 6h-12a6 6 0 0 1-6-6Z" fill={il.paper} stroke={il.line} strokeWidth="0.9" />
            <path d="M12-7h4a5 5 0 0 1 0 10h-4" fill="none" stroke={il.line} strokeWidth="2.6" />
            <path d="M-6-3h12" stroke={il.primary} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M-12-12h24" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" />
          </g>
          <Arm shoulder={SHOULDER_L} elbow={[58, -150]} wrist={[32, -198]} sleeve={sleeve} pose="fist" twist={-51.6} />
        </g>
      </g>

      {/* writing notes: the pen tip rests on the notebook */}
      <g className="il-story-write">
        <g transform={BODY}>
          <Arm shoulder={SHOULDER_L} elbow={[92, -138]} wrist={[59.3, -153.6]} sleeve={sleeve} pose="pen" twist={-55.4} foreKind="il-scribble" />
        </g>
      </g>

      {/* thinking, chin on his fist */}
      <g className="il-story-chin">
        <g transform={BODY}>
          <Arm shoulder={SHOULDER_R} elbow={[-40, -122]} wrist={[-14, -172]} sleeve={sleeve} pose="fist" />
        </g>
      </g>

      {/* resting arms, hands on the desk */}
      <g className="il-story-rest-l">
        <g transform={BODY}>
          <Arm shoulder={SHOULDER_R} elbow={[-76, -128]} wrist={[-42, -124]} sleeve={sleeve} pose="mitten" />
        </g>
      </g>
      <g className="il-story-rest-r">
        <g transform={BODY}>
          <Arm shoulder={SHOULDER_L} elbow={[76, -128]} wrist={[42, -124]} sleeve={sleeve} pose="mitten" flip />
        </g>
      </g>

      {/* his hand carries the closed book onto the stack (and later takes it back), gripping its end */}
      <g className="il-story-carry">
        <ClosedBook x={76} y={266} />
        <g transform={BODY}>
          <Arm shoulder={SHOULDER_R} elbow={[-80, -120]} wrist={[-78, -147.5]} sleeve={sleeve} pose="fist" />
        </g>
      </g>

      {/* speech and thought */}
      <g className="il-story-hello">
        <Bubble x={304} y={146} w={163} lines={["Oh! Hello there 👋", "Nice of you to visit."]} tail="right" />
      </g>
      <g className="il-story-think">
        <Bubble x={306} y={140} w={147} lines={["Hmm… why is", "Very Mild always", "the hardest? 🤔"]} think tail="left" />
      </g>
      <g className="il-story-aha">
        <g transform="translate(250 84)">
          <circle r="26" fill={il.amber} opacity="0.25" className="il-pulse" />
          <path d="M0-18a14 14 0 0 1 8 25v6h-16v-6a14 14 0 0 1 8-25Z" fill={il.amber} />
          <rect x="-7" y="15" width="14" height="6" rx="2" fill={il.line} />
        </g>
        <Bubble x={304} y={146} w={167} lines={["Aha! Group Norm,", "write that down! ✍️"]} tail="right" />
        <Sparkle x={196} y={92} size={9} />
        <Sparkle x={306} y={86} size={7} color={il.cyan} delay={0.3} />
      </g>
      <g className="il-story-bye">
        <Bubble x={304} y={140} w={157} lines={["Make yourself", "at home.", "Go on, explore! ✨"]} tail="right" />
      </g>

      <Sparkle x={300} y={34} size={7} delay={0.5} />
    </Scene>
  );
}
