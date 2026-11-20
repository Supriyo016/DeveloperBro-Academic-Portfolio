"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { isCalm } from "@/lib/consent";
import { cn } from "@/lib/utils";

// Values from the firmware (firmware/third_hand_eye in the project repository).
const ALERT_RANGE_CM = 100;
const ECHO_TIMEOUT_US = 30000;
/** distance.h: microseconds / 29 / 2, with integer division and 0 for no echo */
const toCentimetres = (microseconds: number) => (microseconds <= 0 ? 0 : Math.floor(Math.floor(microseconds / 29) / 2));
const shouldAlert = (cm: number) => cm > 0 && cm <= ALERT_RANGE_CM;

/** The device in 3D: Arduino Uno with the HC-SR04 "eyes" on the front and the buzzer on top. */
export function DeviceModel3D() {
  return (
    <div className="device-stage" role="img" aria-label="A 3D model of the Third Hand-Eye device turning slowly: an Arduino Uno board with an HC-SR04 ultrasonic sensor on the front sending out sound waves, and a buzzer on top.">
      <div className="device-float">
        <div className="device-box">
          <div className="device-face device-front">
            <span className="sensor-eye" />
            <span className="sensor-eye" />
            <span className="sensor-label">HC-SR04</span>
            {[0, 1, 2].map((ring) => (
              <span key={ring} className="sonar-ring" style={{ animationDelay: `${ring * 0.7}s` }} />
            ))}
          </div>
          <div className="device-face device-back">
            <span className="board-label">ARDUINO UNO</span>
            <span className="board-chip" />
          </div>
          <div className="device-face device-left" />
          <div className="device-face device-right" />
          <div className="device-face device-top">
            <span className="buzzer" />
          </div>
          <div className="device-face device-bottom" />
        </div>
        <div className="device-shadow" />
      </div>
    </div>
  );
}

const subscribeTick = (callback: () => void) => {
  const id = window.setInterval(callback, 400);
  return () => window.clearInterval(id);
};

/** Move the obstacle and watch the firmware's measurement and decision, step by step. */
export function SonarSimulator() {
  const [distance, setDistance] = useState(160);
  const [log, setLog] = useState<string[]>([]);
  const tick = useSyncExternalStore(subscribeTick, () => Math.floor(Date.now() / 400), () => 0);

  const echo = distance * 58;
  const timedOut = echo > ECHO_TIMEOUT_US;
  const measured = timedOut ? 0 : toCentimetres(echo);
  const alert = shouldAlert(measured);
  const x = 96 + Math.min(distance, 520) * 0.95;
  const travel = (0.5 + Math.min(distance, 520) / 260).toFixed(2);

  // Each tick adds a reading to the serial monitor, as the firmware prints one per loop.
  const [lastTick, setLastTick] = useState(0);
  if (tick !== lastTick) {
    setLastTick(tick);
    if (tick && !isCalm()) setLog([...log.slice(-5), `${measured}cm${alert ? "  BEEP" : ""}`]);
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <svg viewBox="0 0 640 200" className="h-auto w-full min-w-[34rem]" role="img" aria-label={`Sensor and obstacle ${distance} centimetres apart. ${timedOut ? "No echo within the 30 millisecond timeout." : `Measured ${measured} centimetres.`} ${alert ? "The buzzer sounds." : "The buzzer stays silent."}`}>
          <rect width="640" height="200" fill="var(--surface-2)" />
          <path d={`M60 100H${96 + ALERT_RANGE_CM * 0.95}`} stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
          <rect x="60" y="150" width={ALERT_RANGE_CM * 0.95 + 36} height="22" rx="6" fill="var(--accent-soft)" />
          <text x={78 + (ALERT_RANGE_CM * 0.95) / 2} y="165" textAnchor="middle" fontSize="11" fill="var(--accent)">alert zone, 100 cm</text>
          {/* device */}
          <rect x="20" y="70" width="56" height="60" rx="8" fill="#0f7d8c" />
          <circle cx="62" cy="88" r="9" fill="#cfd6e4" stroke="#7d8aa3" strokeWidth="2" />
          <circle cx="62" cy="112" r="9" fill="#cfd6e4" stroke="#7d8aa3" strokeWidth="2" />
          {/* buzzer */}
          <circle cx="36" cy="58" r="10" fill={alert ? "var(--accent)" : "#2b2f45"} className={alert ? "buzz" : undefined} />
          {alert && [0, 1].map((arc) => <path key={arc} d={`M${30 - arc * 8} ${44 - arc * 6}a${12 + arc * 8} ${12 + arc * 8} 0 0 1 ${12 + arc * 16} 0`} fill="none" stroke="var(--accent)" strokeWidth="2.5" className="buzz-wave" style={{ animationDelay: `${arc * 0.2}s` }} />)}
          {/* waves */}
          <g key={distance} style={{ ["--dx" as string]: `${x - 80}px`, ["--t" as string]: `${travel}s` }}>
            {[0, 1, 2].map((wave) => (
              <path key={wave} d="M74 82q10 18 0 36" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" className="sonar-out" style={{ animationDelay: `${wave * 0.25}s` }} />
            ))}
            {!timedOut &&
              [0, 1].map((wave) => (
                <path key={`e${wave}`} d={`M${x - 6} 82q-10 18 0 36`} fill="none" stroke="var(--series-2)" strokeWidth="3" strokeLinecap="round" className="sonar-back" style={{ animationDelay: `${wave * 0.25}s` }} />
              ))}
          </g>
          {/* obstacle */}
          <g transform={`translate(${x} 0)`} className="transition-transform">
            <rect x="0" y="54" width="18" height="96" rx="4" fill="var(--ink-2)" opacity="0.85" />
            <text x="9" y="44" textAnchor="middle" fontSize="12" fill="var(--ink)">{distance} cm</text>
          </g>
          <text x="20" y="190" fontSize="11" fill="var(--muted)">Echo time: {echo.toLocaleString("en-GB")} µs{timedOut ? " (beyond the 30,000 µs timeout)" : ""}</text>
        </svg>
      </div>
      <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-[1fr_15rem] sm:p-5">
        <div>
          <label className="block text-sm font-medium" htmlFor="obstacle-distance">
            Obstacle distance: <span className="tabular-nums">{distance} cm</span>
          </label>
          <input id="obstacle-distance" type="range" min={2} max={600} value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="mt-2 w-full accent-[var(--primary)]" />
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg bg-surface-2 p-2"><dt className="text-muted">Echo</dt><dd className="font-mono tabular-nums">{timedOut ? "timeout" : `${echo.toLocaleString("en-GB")} µs`}</dd></div>
            <div className="rounded-lg bg-surface-2 p-2"><dt className="text-muted">µs ÷ 29 ÷ 2</dt><dd className="font-mono tabular-nums">{measured} cm</dd></div>
            <div className="rounded-lg bg-surface-2 p-2"><dt className="text-muted">0 &lt; cm ≤ 100</dt><dd className="font-mono">{alert ? "true" : "false"}</dd></div>
            <div className={cn("flex items-center gap-1.5 rounded-lg p-2", alert ? "bg-accent-soft text-accent" : "bg-surface-2")}>
              <dt className="sr-only">Buzzer</dt>
              {alert ? <Volume2 className="size-4" aria-hidden /> : <VolumeX className="size-4" aria-hidden />}
              <dd className="font-medium">{alert ? "Beep 100 ms" : "Silent"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl bg-[#0b1020] p-3 font-mono text-xs text-[#9fe6c1]" aria-label="Serial monitor at 9600 baud">
          <p className="mb-1 text-[0.65rem] tracking-wide text-[#8a93b8] uppercase">Serial monitor · 9600 baud</p>
          <div aria-live="off">
            {(log.length ? log : [`${measured}cm${alert ? "  BEEP" : ""}`]).map((line, index) => (
              <p key={`${index}-${line}`} className={cn(line.includes("BEEP") && "text-[#ffb4a8]")}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const LOOP = [
  { label: "Trigger", detail: "LOW 2 µs, HIGH 10 µs, LOW" },
  { label: "Listen", detail: "pulseIn on pin 10, 30 ms timeout" },
  { label: "Convert", detail: "µs ÷ 29 ÷ 2 = centimetres" },
  { label: "Decide", detail: "0 < cm ≤ 100?" },
  { label: "Alert", detail: "buzzer on pin 5 for 100 ms" },
  { label: "Report", detail: "print cm over serial, wait 10 ms" },
];

/** The firmware loop, with a highlight that walks through each step. */
export function FirmwareLoop() {
  return (
    <ol className="loop-track grid gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Firmware loop, repeated continuously">
      {LOOP.map((step, index) => (
        <li key={step.label} className="loop-step card relative p-3" style={{ animationDelay: `${index * 0.8}s` }}>
          <span className="font-mono text-xs text-muted">{index + 1}</span>
          <p className="font-medium text-ink">{step.label}</p>
          <p className="mt-1 text-xs text-ink-2">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
