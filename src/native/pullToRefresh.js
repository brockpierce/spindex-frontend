// Instagram-style pull-to-refresh for the Capacitor app.
//
// When the page is scrolled to the very top, dragging down pulls the main
// content container (`data-swipe-surface`) down and reveals the "square ticks"
// indicator (design handoff option 1c): eight square-cornered ticks fill in
// clockwise as you pull (gray), turn brand blue once releasing will refresh,
// then a blue head chases around the ring until `onRefresh()` settles.
//
// Mobile web is left alone: Safari and Chrome already pull-to-reload the page.

const SLOP = 8;           // px of movement before we decide pull vs scroll/swipe
const DAMPING = 0.5;      // content moves half as far as the finger
const THRESHOLD = 64;     // px of content displacement that arms a refresh
const MAX_PULL = 120;     // px cap on content displacement
const SETTLE_MS = 400;    // spring-back / fade duration
const STEP_MS = 1000 / 12; // chase head advances 12 ticks per second
const MIN_SPIN_MS = 600;  // keep the chase visible at least this long

const BLUE = "#1F388A";   // --nb-blue: armed + refreshing
const GRAY = "#A8A8A8";   // --nb-gray-400: ticks while pulling
const TRAIL = [1, 0.55, 0.32, 0.18, 0.18, 0.18, 0.18, 0.18]; // opacity by distance behind the head
const SVG_NS = "http://www.w3.org/2000/svg";

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

export function installPullToRefresh(onRefresh) {
  let g = null;           // active gesture
  let busy = false;       // refreshing or settling: ignore new pulls
  let chaseTimer = null;
  let settleRaf = null;
  const ind = makeIndicator();

  // ---- indicator drawing ----
  function place(surface, offset, progress) {
    const r = surface.getBoundingClientRect();
    // r.top already includes the translate; the gap opened by the pull starts offset px above it.
    const gapTop = Math.max(0, r.top - offset);
    const lift = -(1 - progress) * 6;
    ind.el.style.top = `${gapTop + Math.max(0, offset / 2 - 20) + lift}px`;
    ind.el.style.left = `${r.left + r.width / 2 - 20}px`;
  }

  function drawPulling(progress) {
    const armed = progress >= 1;
    ind.ticks.forEach((t, i) => {
      t.setAttribute("fill", armed ? BLUE : GRAY);
      t.setAttribute("opacity", progress * 8 > i ? "1" : "0");
    });
    ind.el.style.opacity = String(Math.min(1, progress * 1.6));
  }

  function drawChase(head) {
    ind.ticks.forEach((t, i) => {
      t.setAttribute("fill", BLUE);
      t.setAttribute("opacity", String(reduceMotion() ? 0.55 : TRAIL[(head - i + 8) % 8]));
    });
  }

  function startChase() {
    let head = 0;
    drawChase(head);
    if (reduceMotion()) return;
    chaseTimer = setInterval(() => { head = (head + 1) % 8; drawChase(head); }, STEP_MS);
  }

  function stopChase() {
    if (chaseTimer) clearInterval(chaseTimer);
    chaseTimer = null;
  }

  // ---- gesture ----
  function onStart(e) {
    if (g || busy || e.touches.length !== 1) return;
    if ((window.scrollY || document.documentElement.scrollTop || 0) > 0) return;
    const surface = document.querySelector("[data-swipe-surface]");
    if (!surface || !surface.contains(e.target)) return;
    if (isEditable(e.target) || inFixedLayer(e.target, surface) || inScrolledBox(e.target, surface)) return;
    const t = e.touches[0];
    g = { surface, x0: t.clientX, y0: t.clientY, offset: 0, dragging: false };
    document.addEventListener("touchmove", onMove, { passive: false });
  }

  function onMove(e) {
    if (!g) return;
    const t = e.touches[0];
    const dx = t.clientX - g.x0;
    const dy = t.clientY - g.y0;
    if (!g.dragging) {
      if (Math.abs(dx) > SLOP && Math.abs(dx) > Math.abs(dy)) return release(); // horizontal: swipe-back's job
      if (dy < -SLOP) return release();   // scrolling up the page
      if (dy < SLOP) return;
      g.dragging = true;
      g.surface.style.transition = "none";
      g.surface.style.willChange = "transform";
      ind.el.style.display = "block";
    }
    e.preventDefault(); // stop the WKWebView rubber-band while we own the gesture
    g.offset = Math.min(MAX_PULL, Math.max(0, dy) * DAMPING);
    const progress = Math.min(1, g.offset / THRESHOLD);
    g.surface.style.transform = `translate3d(0,${g.offset}px,0)`;
    drawPulling(progress);
    place(g.surface, g.offset, progress);
  }

  function onEnd() {
    if (!g) return;
    const cur = g;
    release();
    if (!cur.dragging) return;
    if (cur.offset >= THRESHOLD) runRefresh(cur.surface, cur.offset);
    else settle(cur.surface, cur.offset, false);
  }

  async function runRefresh(surface, from) {
    busy = true;
    // Ease into the 64px hold position, then chase until the reload settles.
    await animate(from, THRESHOLD, 160, (o) => {
      surface.style.transform = `translate3d(0,${o}px,0)`;
      place(surface, o, 1);
    });
    ind.el.style.opacity = "1";
    ind.label.textContent = "Refreshing";
    startChase();
    const started = Date.now();
    try { await onRefresh(); } catch (e) { /* the screen shows its own errors */ }
    const wait = MIN_SPIN_MS - (Date.now() - started);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    settle(surface, THRESHOLD, true);
  }

  // Content eases back to 0 while the indicator fades; the chase keeps running.
  function settle(surface, from, refreshed) {
    busy = true;
    const startOpacity = parseFloat(ind.el.style.opacity) || (refreshed ? 1 : 0);
    animate(from, 0, SETTLE_MS, (o, k) => {
      surface.style.transform = `translate3d(0,${o}px,0)`;
      ind.el.style.opacity = String(startOpacity * (1 - k));
      place(surface, o, refreshed ? 1 : Math.min(1, o / THRESHOLD));
    }).then(() => {
      stopChase();
      surface.style.transition = "";
      surface.style.transform = "";
      surface.style.willChange = "";
      ind.el.style.display = "none";
      ind.label.textContent = "";
      busy = false;
    });
  }

  function animate(from, to, ms, frame) {
    if (settleRaf) cancelAnimationFrame(settleRaf);
    return new Promise((resolve) => {
      const t0 = performance.now();
      const step = (now) => {
        const x = Math.min(1, (now - t0) / ms);
        const k = easeOutCubic(x);
        frame(from + (to - from) * k, k);
        if (x < 1) settleRaf = requestAnimationFrame(step);
        else { settleRaf = null; resolve(); }
      };
      settleRaf = requestAnimationFrame(step);
    });
  }

  function release() {
    document.removeEventListener("touchmove", onMove);
    g = null;
  }

  function onCancel() {
    const cur = g;
    release();
    if (cur && cur.dragging) settle(cur.surface, cur.offset, false);
  }

  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
  document.addEventListener("touchcancel", onCancel, { passive: true });

  return () => {
    document.removeEventListener("touchstart", onStart);
    document.removeEventListener("touchend", onEnd);
    document.removeEventListener("touchcancel", onCancel);
    release();
    stopChase();
    if (settleRaf) cancelAnimationFrame(settleRaf);
    ind.el.remove();
  };
}

// 40x40 box, eight 3.5x9 square-cornered ticks from r=8 to r=17, 45° apart,
// tick 0 pointing straight up and the rest clockwise.
function makeIndicator() {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "fixed", width: "40px", height: "40px", zIndex: "5",
    pointerEvents: "none", display: "none", opacity: "0",
  });
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "40");
  svg.setAttribute("height", "40");
  svg.setAttribute("viewBox", "0 0 40 40");
  svg.setAttribute("aria-hidden", "true");
  svg.style.display = "block";
  const grp = document.createElementNS(SVG_NS, "g");
  grp.setAttribute("transform", "translate(20 20)");
  const ticks = [];
  for (let i = 0; i < 8; i++) {
    const r = document.createElementNS(SVG_NS, "rect");
    r.setAttribute("x", "-1.75");
    r.setAttribute("y", "-17");
    r.setAttribute("width", "3.5");
    r.setAttribute("height", "9");
    r.setAttribute("transform", `rotate(${i * 45})`);
    r.setAttribute("fill", GRAY);
    r.setAttribute("opacity", "0");
    grp.appendChild(r);
    ticks.push(r);
  }
  svg.appendChild(grp);
  el.appendChild(svg);
  // Screen readers hear "Refreshing" while the reload runs.
  const label = document.createElement("span");
  label.setAttribute("role", "status");
  label.setAttribute("aria-live", "polite");
  Object.assign(label.style, { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" });
  el.appendChild(label);
  document.body.appendChild(el);
  return { el, ticks, label };
}

function reduceMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Inside a scrolled-down inner box (a list in a modal, a horizontal row...):
// pulling down there should scroll that box, not refresh the page.
function inScrolledBox(el, stopAt) {
  for (let n = el; n && n !== stopAt && n !== document.body; n = n.parentElement) {
    if (n.scrollTop > 0) return true;
  }
  return false;
}

function inFixedLayer(el, stopAt) {
  for (let n = el; n && n !== stopAt && n !== document.body; n = n.parentElement) {
    if (getComputedStyle(n).position === "fixed") return true;
  }
  return false;
}

function isEditable(el) {
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
}
