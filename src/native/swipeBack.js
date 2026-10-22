// iOS-style edge swipe to go back, for the Capacitor app.
//
// The app has no router: every screen draws its own "back" control with its own
// logic (view.from, a fixed destination, closeSettings, ...). Rather than
// re-implement that, a swipe from the left edge drags the screen and, when
// released far/fast enough, clicks the screen's own back control. Screens with
// no back control (the tab roots) simply don't respond.
//
// The dragged element is the main content container, marked `data-swipe-surface`
// in SoundboardDemo.jsx. A back control is either an element marked
// `data-nav-back`, or (so existing screens need no changes) the parent of a
// lucide ChevronLeft icon whose label starts with "back", or an icon-only,
// untitled button (the DM thread header).

const EDGE = 28;            // px from the left edge where a swipe may start
const SLOP = 10;            // px of movement before we decide swipe vs scroll
const COMMIT_FRACTION = 0.35;
const COMMIT_VELOCITY = 0.5; // px/ms
const ANIM_MS = 200;

export function installSwipeBack() {
  let g = null; // active gesture

  function onStart(e) {
    if (g || e.touches.length !== 1) return;
    const t = e.touches[0];
    if (t.clientX > EDGE) return;
    const surface = document.querySelector("[data-swipe-surface]");
    if (!surface || !surface.contains(e.target)) return;
    if (isEditable(e.target) || inFixedLayer(e.target, surface)) return;
    const back = findBackControl(surface);
    if (!back) return;
    g = { surface, back, x0: t.clientX, y0: t.clientY, t0: Date.now(), dx: 0, dragging: false };
    // Non-passive only for the life of this gesture, so ordinary scrolling
    // elsewhere never waits on JS.
    document.addEventListener("touchmove", onMove, { passive: false });
  }

  function onMove(e) {
    if (!g) return;
    const t = e.touches[0];
    const dx = t.clientX - g.x0;
    const dy = t.clientY - g.y0;
    if (!g.dragging) {
      if (Math.abs(dy) > SLOP && Math.abs(dy) > Math.abs(dx)) return end(false); // vertical scroll
      if (dx < SLOP) return;
      g.dragging = true;
      g.surface.style.transition = "none";
      g.surface.style.willChange = "transform";
      g.surface.style.boxShadow = "-10px 0 24px rgba(0,0,0,0.12)";
    }
    e.preventDefault();
    g.dx = Math.max(0, dx);
    g.surface.style.transform = `translate3d(${g.dx}px,0,0)`;
  }

  function onEnd() {
    if (!g) return;
    if (!g.dragging) return end(false);
    const width = window.innerWidth;
    const velocity = g.dx / Math.max(1, Date.now() - g.t0);
    end(g.dx > width * COMMIT_FRACTION || (velocity > COMMIT_VELOCITY && g.dx > 40));
  }

  function end(commit) {
    document.removeEventListener("touchmove", onMove);
    const cur = g;
    g = null;
    if (!cur || !cur.dragging) return;
    const { surface, back } = cur;
    surface.style.transition = `transform ${ANIM_MS}ms ease-out`;
    surface.style.transform = `translate3d(${commit ? window.innerWidth : 0}px,0,0)`;
    setTimeout(() => {
      if (commit) {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        back.click();
      }
      // Next frame: the previous screen has rendered in place; drop the drag
      // styles without animating so it simply appears.
      requestAnimationFrame(() => {
        surface.style.transition = "";
        surface.style.transform = "";
        surface.style.willChange = "";
        surface.style.boxShadow = "";
      });
    }, ANIM_MS);
  }

  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
  document.addEventListener("touchcancel", () => end(false), { passive: true });
}

function findBackControl(surface) {
  const explicit = [...surface.querySelectorAll("[data-nav-back]")].find((el) => isUsable(el, surface));
  if (explicit) return explicit;
  for (const icon of surface.querySelectorAll("svg.lucide-chevron-left")) {
    const el = icon.parentElement;
    if (!el || !isUsable(el, surface)) continue;
    const label = (el.textContent || "").trim().toLowerCase();
    if (label.startsWith("back")) return el;
    // Icon-only back button (e.g. DM thread). Titled buttons are pagers like the
    // album-of-the-day "older review", not navigation.
    if (el.tagName === "BUTTON" && !label && !el.title && !el.disabled) return el;
  }
  return null;
}

function isUsable(el, surface) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && !inFixedLayer(el, surface);
}

// True when el sits inside a fixed overlay (modal, sheet, lightbox): swiping
// there should never navigate the screen underneath.
function inFixedLayer(el, stopAt) {
  for (let n = el; n && n !== stopAt && n !== document.body; n = n.parentElement) {
    if (getComputedStyle(n).position === "fixed") return true;
  }
  return false;
}

function isEditable(el) {
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
}
