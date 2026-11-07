export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.dataset.ready)d.classList.remove('js')},4000);try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');d.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){d.dataset.theme='light'}try{if(localStorage.getItem('motion')==='paused')d.dataset.motion='paused'}catch(e){}})()`;

const systemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

export function applyPreference(preference: ThemePreference) {
  document.documentElement.dataset.theme = preference === "system" ? systemTheme() : preference;
}

export function savePreference(preference: ThemePreference) {
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be blocked. The choice still applies for this page view.
  }
  applyPreference(preference);
  window.dispatchEvent(new Event("themechange"));
}
