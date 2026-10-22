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

  // The plugin shrinks the webview ~0.2s *after* keyboardDidShow, so checking
  // there sees the old, full height. React to the resize itself instead (plus
  // didShow as a fallback in case the frame didn't change).
  window.addEventListener("resize", () => {
    if (root.classList.contains("kb-open")) revealFocusedField();
  });
  Keyboard.addListener("keyboardDidShow", revealFocusedField).catch(() => {});
}

// iOS only scrolls far enough to show the caret, which can leave most of a
// textarea (and whatever sits under it) behind the keyboard.
function revealFocusedField() {
  const el = document.activeElement;
  if (!el || !isEditable(el)) return;
  const r = el.getBoundingClientRect();
  const h = window.innerHeight;
  if (r.bottom > h - 8 || r.top < 0) {
    el.scrollIntoView({ block: r.height < h * 0.6 ? "center" : "start", behavior: "smooth" });
  }
}

function isEditable(el) {
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
}
