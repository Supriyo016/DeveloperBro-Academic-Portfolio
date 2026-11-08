// Cookie and storage consent. The site sets no tracking or advertising cookies. One first-party cookie records the
// visitor's choice; "preferences" covers what the browser remembers for convenience (theme, animation switch,
// bookmarks, this tab's chat). With "essential", those stay for the current page view only and are cleared.

export const CONSENT_COOKIE = "dbro_consent";
const CONSENT_EVENT = "consentchange";
export const OPEN_SETTINGS_EVENT = "open-cookie-settings";
const MAX_AGE = 60 * 60 * 24 * 180;

export type Consent = "all" | "essential";

export const STORAGE_KEYS = {
  theme: "theme",
  motion: "motion",
  bookmarks: "bookmarked-articles",
  chat: "assistant-chat-v1",
} as const;

export const storedPreferences = [
  { key: STORAGE_KEYS.theme, store: "localStorage", purpose: "Remembers light or dark theme if you chose one", lifetime: "Until you clear it" },
  { key: STORAGE_KEYS.motion, store: "localStorage", purpose: "Remembers that you paused animations", lifetime: "Until you clear it" },
  { key: STORAGE_KEYS.bookmarks, store: "localStorage", purpose: "Research notes you bookmarked", lifetime: "Until you clear it" },
  { key: STORAGE_KEYS.chat, store: "sessionStorage", purpose: "Your conversation with Bro in this tab", lifetime: "Until the tab closes" },
] as const;

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(all|essential)`));
  return (match?.[1] as Consent | undefined) ?? null;
}

/** Preferences are stored only after the visitor allows them. */
export function canRemember(): boolean {
  return readConsent() === "all";
}

/** True when the visitor asked for less motion, in the system settings or with the site's pause switch. */
export function isCalm(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "paused";
}

export function writeConsent(value: Consent) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  if (value === "essential") {
    for (const item of storedPreferences) {
      try {
        (item.store === "localStorage" ? localStorage : sessionStorage).removeItem(item.key);
      } catch {
        // Storage may be blocked already.
      }
    }
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export const subscribeConsent = (callback: () => void) => {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
};
