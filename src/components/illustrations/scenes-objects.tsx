import { Anim, CodeLines, il, Mug, Plant, Scene, Sparkle } from "./base";

export function CodeScene() {
  return (
    <Scene viewBox="0 0 480 400" label="An open code editor window connected to a small graph of tools.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <rect x="66" y="84" width="266" height="206" rx="12" fill={il.coat} />
      <rect x="66" y="84" width="266" height="28" rx="12" fill={il.coat2} />
      {[84, 100, 116].map((x, index) => (
        <circle key={x} cx={x} cy="98" r="5" fill={[il.amber, il.cyan, il.lavender][index]} />
      ))}
      {[
        [84, 134, 54, il.lavender],
        [146, 134, 76, il.cyan],
        [104, 156, 96, il.paper2],
        [104, 178, 62, il.amber],
        [174, 178, 86, il.paper2],
        [124, 200, 118, il.cyan],
        [104, 222, 72, il.paper2],
        [84, 244, 40, il.lavender],
      ].map(([x, y, width, fill], index) => (
        <rect key={`${x}-${y}`} x={x as number} y={y as number} width={width as number} height="9" rx="4.5" fill={fill as string} className="il-code" style={{ animationDelay: `${index * 0.4}s` }} />
      ))}
      <rect x="166" y="244" width="3" height="10" fill={il.paper} className="caret" />
      <g className="il-float">
        <g stroke={il.line} strokeWidth="2">
          <path d="M380 170l-50 64M380 170l36 76M330 234l86 12M330 234l14 76M416 246l-72 64" className="il-dash" />
        </g>
        {[
          [380, 170, il.primary],
          [330, 234, il.cyan],
          [416, 246, il.amber],
          [344, 310, il.primary],
        ].map(([cx, cy, fill]) => (
          <circle key={`${cx}`} cx={cx as number} cy={cy as number} r="17" fill={fill as string} stroke={il.paper} strokeWidth="3" className="il-pulse" style={{ animationDelay: `${(cx as number) / 200}s` }} />
        ))}
      </g>
      <Plant x={92} y={332} scale={0.85} />
      <Sparkle x={420} y={110} size={8} delay={0.3} />
    </Scene>
  );
}

export function AwardScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A certificate with a seal next to a trophy on a podium.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="372" rx="180" ry="11" fill={il.ground} />
      <g transform="rotate(-5 160 200)">
        <rect x="60" y="94" width="210" height="150" rx="6" fill={il.paper} stroke={il.line} />
        <rect x="72" y="106" width="186" height="126" rx="3" fill="none" stroke={il.lavender} strokeWidth="2" />
        <path d="M112 134h106" stroke={il.primary} strokeWidth="6" strokeLinecap="round" />
        <path d="M96 160h138M96 176h138M96 192h86" stroke={il.paper2} strokeWidth="5" strokeLinecap="round" />
        <circle cx="222" cy="206" r="17" fill={il.amber} className="il-pulse" />
        <path d="M214 220l-5 24 13-8 13 8-5-24" fill={il.primary} />
      </g>
      <rect x="282" y="306" width="130" height="64" rx="5" fill={il.primary} />
      <rect x="306" y="286" width="82" height="20" rx="4" fill={il.coat2} />
      <path d="M328 286c2-18 6-26 19-30 13 4 17 12 19 30Z" fill={il.amber} />
      <Anim kind="il-bob">
        <path d="M302 150h90v42c0 36-24 62-45 66-21-4-45-30-45-66Z" fill={il.amber} />
        <path d="M302 164h-22c0 32 12 48 32 54M392 164h22c0 32-12 48-32 54" fill="none" stroke={il.amber} strokeWidth="9" />
        <path d="M347 176l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z" fill={il.paper} className="il-pulse" />
        <path d="M318 160c-2 14 0 28 6 38" fill="none" stroke={il.paper} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </Anim>
      <Sparkle x={290} y={128} size={9} delay={0.2} />
      <Sparkle x={414} y={118} size={7} color={il.cyan} delay={0.9} />
      <Sparkle x={436} y={232} size={6} color={il.primary} delay={1.5} />
    </Scene>
  );
}

export function WritingScene() {
  return (
    <Scene viewBox="0 0 480 400" label="An open notebook with a pen, a desk lamp and a cup of coffee.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <rect x="44" y="310" width="392" height="14" rx="5" fill={il.wood} />
      <path d="M86 324h14l-5 54h-6ZM380 324h14l-2 54h-6Z" fill={il.wood} opacity="0.75" />
      <path d="M96 310l22-120c34-16 72-14 104 8 32-22 70-24 104-8l22 120c-36-14-90-14-126 0-36-14-90-14-126 0Z" fill={il.paper} stroke={il.line} />
      <path d="M222 198v112" stroke={il.line} strokeWidth="2" />
      <g stroke={il.paper2} strokeWidth="5" strokeLinecap="round">
        <path d="M130 220c24-8 48-8 72 0M126 244c26-8 52-8 76 0M122 268c28-8 56-8 80 0" />
        <path d="M242 220c24-8 48-8 72 0M242 244c26-8 52-8 76 0" />
      </g>
      <path d="M248 268c14-20 28 14 42-6s24 12 34 0" fill="none" stroke={il.primary} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" />
      <Anim kind="il-write">
        <g transform="rotate(38 330 230)">
          <rect x="324" y="176" width="13" height="96" rx="3" fill={il.primary} />
          <path d="M324 272h13l-6.5 18Z" fill={il.amber} />
          <rect x="324" y="188" width="13" height="8" fill={il.paper} opacity="0.5" />
        </g>
      </Anim>
      <g>
        <path d="M402 310V180l-48-60" fill="none" stroke={il.coat2} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M330 92l50 12-26 46-44-26Z" fill={il.primary} />
        <path d="M310 124l44 26-90 90Z" fill={il.amber} opacity="0.15" className="il-glow" />
        <rect x="380" y="302" width="44" height="8" rx="3" fill={il.coat2} />
      </g>
      <g transform="translate(46 262)">
        <path d="M0 0h42v34a10 10 0 0 1-10 10H10a10 10 0 0 1-10-10Z" fill={il.cyan} />
        <path d="M42 8h6a9 9 0 0 1 0 18h-6" fill="none" stroke={il.cyan} strokeWidth="4" />
        {[12, 26].map((dx, index) => (
          <Anim key={dx} kind="il-steam" delay={index * 1.2}>
            <path d={`M${dx}-10c-5-6 5-10 0-18`} fill="none" stroke={il.line} strokeWidth="2.5" strokeLinecap="round" />
          </Anim>
        ))}
      </g>
    </Scene>
  );
}

export function MailScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A paper plane flying from an open envelope along a dotted path.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <path d="M150 268C210 190 250 300 306 214s54-90 84-112" fill="none" stroke={il.primary} strokeWidth="2.5" strokeLinecap="round" className="il-dash" />
      <g className="il-float">
        <path d="M332 112l112-50-46 118-26-44Z" fill={il.paper} stroke={il.line} />
        <path d="M444 62L372 136l-4 44 30-24" fill={il.lavender} />
      </g>
      <rect x="64" y="226" width="196" height="130" rx="10" fill={il.paper} stroke={il.line} />
      <path d="M64 236c0-6 4-10 10-10h176c6 0 10 4 10 10l-98 74Z" fill={il.lavender} />
      <path d="M64 346l74-56M260 346l-74-56" stroke={il.line} strokeWidth="2" />
      <circle cx="162" cy="306" r="17" fill={il.amber} className="il-pulse" />
      <Sparkle x={300} y={90} size={8} delay={0.4} />
      <path d="M154 306l6 6 11-12" fill="none" stroke={il.paper} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(330 276)">
        <rect width="104" height="62" rx="14" fill={il.primary} />
        <path d="M24 62v20l22-20Z" fill={il.primary} />
        {[32, 52, 72].map((cx, index) => (
          <circle key={cx} cx={cx} cy="31" r="6" fill={il.paper} className="il-pulse" style={{ animationDelay: `${index * 0.25}s` }} />
        ))}
      </g>
    </Scene>
  );
}

export function PapersScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A manuscript draft with marked up lines next to an hourglass.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="372" rx="170" ry="11" fill={il.ground} />
      <g transform="rotate(5 200 210)">
        <rect x="96" y="70" width="210" height="280" rx="6" fill={il.paper2} />
      </g>
      <g transform="rotate(-3 200 210)">
        <rect x="90" y="70" width="210" height="282" rx="6" fill={il.paper} stroke={il.line} />
        <path d="M120 106h150" stroke={il.primary} strokeWidth="7" strokeLinecap="round" />
        <path d="M144 124h102" stroke={il.paper2} strokeWidth="5" strokeLinecap="round" />
        <path d="M116 156h72M116 172h72M116 188h72M116 204h72M116 220h52M204 156h72M204 172h72" stroke={il.paper2} strokeWidth="5" strokeLinecap="round" />
        <rect x="204" y="188" width="72" height="62" rx="4" fill={il.cyanSoft} />
        <path d="M212 240c14-24 30-28 56-36" fill="none" stroke={il.primary} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" />
        <path d="M116 270h160M116 286h160M116 302h104" stroke={il.paper2} strokeWidth="5" strokeLinecap="round" />
        <path d="M116 268c46-10 60 6 112 0" fill="none" stroke={il.amber} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" style={{ animationDelay: "1.5s" }} />
      </g>
      <g transform="translate(346 216)">
        <Anim kind="il-clock" origin="38 77">
        <rect x="0" width="76" height="11" rx="4" fill={il.coat} />
        <rect x="0" y="143" width="76" height="11" rx="4" fill={il.coat} />
        <path d="M8 11h60c0 32-22 44-24 66 2 22 24 34 24 66H8c0-32 22-44 24-66-2-22-24-34-24-66Z" fill={il.paper} stroke={il.line} />
        <path d="M18 30h40c-4 14-16 26-20 38-4-12-16-24-20-38Z" fill={il.amber} />
        <path d="M18 134c4-14 16-24 20-30 4 6 16 16 20 30Z" fill={il.amber} />
        </Anim>
      </g>
    </Scene>
  );
}

export function WorkbenchScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A laptop showing a website next to an Arduino board with an ultrasonic sensor.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <rect x="40" y="306" width="400" height="14" rx="5" fill={il.wood} />
      <path d="M80 320h14l-5 56h-6ZM386 320h14l-2 56h-6Z" fill={il.wood} opacity="0.75" />
      <Mug x={46} y={306} />
      <rect x="84" y="112" width="208" height="150" rx="10" fill={il.coat} />
      <rect x="94" y="122" width="188" height="130" rx="4" fill={il.paper} />
      <rect x="94" y="122" width="188" height="20" rx="4" fill={il.lavender} />
      <rect x="106" y="154" width="70" height="46" rx="4" fill={il.cyanSoft} />
      <path d="M112 196l18-20 14 12 12-8 16 16Z" fill={il.cyan} />
      <CodeLines x={188} y={156} widths={[82, 70, 52]} gap={14} />
      <rect x="106" y="212" width="164" height="28" rx="4" fill={il.soft} />
      <path d="M66 262h244l14 16H52Z" fill={il.coat2} />
      <rect x="52" y="278" width="272" height="8" rx="3" fill={il.coat} />
      <g transform="translate(330 214)">
        <rect width="104" height="86" rx="6" fill={il.cyan} />
        <rect x="10" y="10" width="46" height="26" rx="3" fill={il.coat} />
        <rect x="66" y="10" width="28" height="10" rx="2" fill={il.paper2} />
        <rect x="66" y="26" width="28" height="10" rx="2" fill={il.paper2} />
        <path d="M12 54h80M12 72h80" stroke={il.paper} strokeWidth="4" className="il-dash" />
        <circle cx="94" cy="44" r="4" fill={il.amber} className="il-twinkle" />
      </g>
      <g transform="translate(346 148)">
        <rect width="72" height="30" rx="4" fill={il.primary} />
        <circle cx="19" cy="15" r="11" fill={il.paper} stroke={il.coat} strokeWidth="3" />
        <circle cx="53" cy="15" r="11" fill={il.paper} stroke={il.coat} strokeWidth="3" />
        <path d="M30 30v36M42 30v36" stroke={il.line} strokeWidth="3" />
        <g transform="rotate(-90 36 15)">
          <path d="M78-14c12 8 12 40 0 48" fill="none" stroke={il.amber} strokeWidth="3" strokeLinecap="round" className="il-twinkle" />
          <path d="M90-26c18 14 18 62 0 76" fill="none" stroke={il.amber} strokeWidth="3" strokeLinecap="round" className="il-twinkle" style={{ animationDelay: "0.6s" }} />
        </g>
      </g>
    </Scene>
  );
}
