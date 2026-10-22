// iOS keyboard handling for the Capacitor app.
//
// The Keyboard plugin runs in "native" resize mode (capacitor.config.json): when
// the keyboard opens, iOS shrinks the webview to the space above it. Without
// help, the fixed bottom tab bar then rides up and sits on top of the keyboard,
// eating space the input needs. So while the keyboard is up we flag <html> with
// `kb-open` (index.css hides the tab bar and drops its spacing), and make sure
// the focused field is still on screen once the resize has settled.
import { Keyboard } from "@capacitor/keyboard";

export function installKeyboardHandling() {
  const root = document.documentElement;

  // The plugin hides iOS's "< > Done" bar by default. Without it there's no way
  // to dismiss the keyboard from a textarea (Return inserts a newline) and
  // tapping outside a field doesn't blur it in a webview, so keep it.
  Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {});

  Keyboard.addListener("keyboardWillShow", () => root.classList.add("kb-open")).catch(() => {});
  Keyboard.addListener("keyboardWillHide", () => root.classList.remove("kb-open")).catch(() => {});

  Keyboard.addListener("keyboardDidShow", () => {
    const el = document.activeElement;
    if (!el || !isEditable(el)) return;
    const r = el.getBoundingClientRect();
    // Only nudge when the field ended up hidden; otherwise leave scroll alone.
    if (r.bottom > window.innerHeight - 8 || r.top < 0) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }).catch(() => {});
}

function isEditable(el) {
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
}
