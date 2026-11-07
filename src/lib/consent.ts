// Cookie and storage consent. The site sets no tracking or advertising cookies. One first-party cookie records the
// visitor's choice; "preferences" covers what the browser remembers for convenience (theme, animation switch,
// bookmarks, this tab's chat). With "essential", those stay for the current page view only and are cleared.

export const CONSENT_COOKIE = "dbro_consent";
export const CONSENT_EVENT = "consentchange";
export const OPEN_SETTINGS_EVENT = "open-cookie-settings";
const MAX_AGE = 60 * 60 * 24 * 180;

export type Consent = "all" | "essential";

export const storedPreferences = [
  { key: "theme", store: "localStorage", purpose: "Remembers light or dark theme if you chose one", lifetime: "Until you clear it" },
  { key: "motion", store: "localStorage", purpose: "Remembers that you paused animations", lifetime: "Until you clear it" },
  { key: "bookmarked-articles", store: "localStorage", purpose: "Research notes you bookmarked", lifetime: "Until you clear it" },
  { key: "assistant-chat-v1", store: "sessionStorage", purpose: "Your conversation with Bro in this tab", lifetime: "Until the tab closes" },
] as const;

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=(all|essential)`));
  return (match?.[1] as Consent | undefined) ?? null;
}

/** Preferences may be stored unless the visitor chose essential only. */
export function canRemember(): boolean {
  return readConsent() !== "essential";
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
