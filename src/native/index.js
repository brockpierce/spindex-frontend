// Native-only (Capacitor iOS) behaviour. Imported lazily from main.jsx so none
// of this reaches the web build's startup path.
import { installKeyboardHandling } from "./keyboard.js";
import { installSwipeBack } from "./swipeBack.js";

export function installNativeEnhancements() {
  installKeyboardHandling();
  installSwipeBack();
}
