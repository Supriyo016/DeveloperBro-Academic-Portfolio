# Identity card: reference analysis

Reference: Facebook Reel 1837507500720221 (48 s, 920 × 719), inspected on 20 November 2026 by pausing and enlarging
frames at 0.5, 3, 3.2, 6, 8, 9, 10, 11, 12, 12.6, 13.4, 14, 20, 27, 34, 41 and 46.5 s. Facebook showed a sign-in
prompt that could be closed; the video then played without signing in.

The badge appears only in the hero (about 2 to 13.5 s). The rest of the reel scrolls through another person's
portfolio (work, about, contact) and is not part of this feature.

## A. Visual design (observed)

| Element | Observation | Implementation |
| --- | --- | --- |
| Object | A physical ID badge hanging from a lanyard, not a flat profile box | Badge + strap rendered as one hanging object |
| Proportions | About 135 × 185 px in a 767 px-wide frame: width to height ≈ 0.73; ≈ 250 px wide on a 1440 px page | 250 × 342 px on desktop, scaled down on small screens |
| Card | Off-white, slightly warm, matte; corner radius ≈ 7% of width; soft drop shadow | Theme-aware off-white surface, radius 18 px, soft shadow |
| Top | A dark rounded slot punched near the top edge; a small metal clip joins it to the strap | Slot and metal clip |
| Header row | Left: grey letter-spaced monospaced label ("CREW PASS"). Right: red dot + red monospaced "REC" | Left: "RESEARCH PASS". Right: red dot + "OPEN TO PHD" |
| Edges | Thin dotted perforation lines down both long edges, inset from the border | Dotted inset lines |
| Photo | Near-square photo with rounded corners on a light background, framed by camera-viewfinder corner brackets | Owner's existing portrait, with corner brackets |
| Role | Small red monospaced, letter-spaced label above the name ("VIDEO EDITOR") | "CSE RESEARCHER" |
| Name | Large, bold, tight sans-serif in near-black | "Supriyo Sarkar" |
| Footer | Small grey text bottom-left (unreadable in the video) and a barcode bottom-right | "M.Tech CSE · KGEC" and a decorative barcode |
| Strap | Red woven strap, ≈ 9% of card width, printed with white monospaced repeating text | Red strap with "SUPRIYO SARKAR · DEVELOPERBRO. ·" printed along it |
| Anchor | The strap runs off the top of the hero, behind the glass navigation bar, right of centre | Anchor above the hero's top edge, on the right |
| Environment | Very dark charcoal background, soft radial light behind the hero, glass pill navigation | Uses the site's existing background and header |

Not observed and therefore not added: a back side, glare or holographic reflections, particles or neon.

## B. 3D and physical behaviour (observed)

- At rest the badge hangs slightly turned, with a gentle idle sway.
- The strap behaves as a flexible rope: it bends into a curve when the badge is pulled sideways (11 s) and stretches
  diagonally when the badge is flung (9 s).
- The cursor grabs the badge and drags it anywhere over the hero, even up to the navigation bar (10 s) and across the
  name (12 s).
- While moving, the badge rotates in its own plane to follow the strap and turns in depth (yaw), showing perspective.
- On release it swings back like a damped pendulum and settles at the anchor in about two to three seconds.
- The shadow follows the badge.

## C. Interaction (observed)

- Pointer down on the badge grabs it; dragging moves it; release throws it with the pointer's velocity.
- No click action, flip or panel reveal was seen on the badge itself. Contact actions live in the hero buttons and a
  floating "let's collab" pill.

## D. Timing (estimated from frames)

| Behaviour | Estimate |
| --- | --- |
| Swing period after release | ≈ 1.2 to 1.6 s |
| Settling | ≈ 2 to 3 s, strongly damped |
| Rotation while swinging | up to ≈ 35° in plane, ≈ 25° yaw |
| Idle sway | ≈ ±2° over ≈ 4 to 5 s |

## Implementation requirements

1. A rope of short segments simulated with Verlet integration and distance constraints, anchored above the hero; the
   badge is the last point. The strap is drawn through the rope points.
2. Drag with pointer events and pointer capture; throw with release velocity; damping so it settles in about 2.5 s.
3. In-plane rotation from the last strap segment, yaw and pitch from velocity, all in CSS 3D (`perspective`,
   `preserve-3d`), with layered depth for photo and text.
4. The simulation runs only while the badge moves and is on screen; at rest a CSS idle sway takes over.
5. Keyboard: the badge is focusable; arrow keys give it a push. Reduced motion or the site's pause switch: it hangs still.
6. Touch: drag works with touch; the card's information is plain text, so nothing depends on hover.
7. Real content only: name, M.Tech CSE, KGEC, research focus, and links that already exist on the site.

Reference elements deliberately not reproduced: the other person's photo, name and branding; the superhero-mask photo
effect in the About section of the reel.

## As built (20 November 2026)

| File | Role |
| --- | --- |
| `src/components/identity-card/IdentityHero.tsx` | Server component: the hero's left column and the badge |
| `src/components/identity-card/IdentityBadge.tsx` | Client component: Verlet rope (9 segments, 120 Hz fixed step, 14 constraint passes), drag and throw, keyboard nudges, sleep when settled, IntersectionObserver and ResizeObserver |
| `src/components/identity-card/BadgeFace.tsx` | The printed card front, layered with `translateZ` for parallax |
| `src/components/identity-card/identity-card.module.css` | Card, clip, strap, depth layers, idle sway, theme and reduced-motion rules; text scales with container query units |
| `src/components/identity-card/identity-card-data.ts` | Every word printed on the badge, from `profile.ts` |

Visual comparison with the reel frame at 3 s, at 1440 × 900: same composition (name left, badge on a long red
printed strap right of centre, anchored behind the navigation), same card proportions (0.73), same printed layout,
and the same slight 3D turn at rest. Differences that remain: the reel uses WebGL with real lighting on the card, so
its specular highlights and strap fabric texture are richer; the site uses CSS 3D, as the brief prefers, and draws
the strap as a vector band. The floating "let's collab" pill and the About-photo effect from the reel are separate
features and were not part of this request.
