// Instagram-style pull-to-refresh for the Capacitor app.
//
// When the page is scrolled to the very top, dragging down pulls the main
// content container (`data-swipe-surface`) down and reveals a spinner. Letting
// go past the threshold calls `onRefresh()` (which may return a promise); the
// spinner keeps spinning until it settles, then everything slides back.
//
// Mobile web is left alone: Safari and Chrome already pull-to-reload the page.

const SLOP = 8;          // px of movement before we decide pull vs scroll/swipe
const THRESHOLD = 70;    // px of (damped) pull needed to trigger a refresh
const HOLD = 52;         // px the content stays pulled down while refreshing
const MAX_PULL = 120;    // px cap on the damped pull
const MIN_SPIN_MS = 600; // keep the spinner up at least this long, so it reads
const ANIM_MS = 220;

export function installPullToRefresh(onRefresh) {
  let g = null;           // active gesture
  let refreshing = false;
  const spinner = makeSpinner();

  function onStart(e) {
    if (g || refreshing || e.touches.length !== 1) return;
    if ((window.scrollY || document.documentElement.scrollTop || 0) > 0) return;
    const surface = document.querySelector("[data-swipe-surface]");
    if (!surface || !surface.contains(e.target)) return;
    if (isEditable(e.target) || inFixedLayer(e.target, surface) || inScrolledBox(e.target, surface)) return;
    const t = e.touches[0];
    g = { surface, x0: t.clientX, y0: t.clientY, pull: 0, dragging: false };
    document.addEventListener("touchmove", onMove, { passive: false });
  }

  function onMove(e) {
    if (!g) return;
    const t = e.touches[0];
    const dx = t.clientX - g.x0;
    const dy = t.clientY - g.y0;
    if (!g.dragging) {
      if (Math.abs(dx) > SLOP && Math.abs(dx) > Math.abs(dy)) return cancel(); // horizontal: swipe-back's job
      if (dy < -SLOP) return cancel();   // scrolling up the page
      if (dy < SLOP) return;
      g.dragging = true;
      g.surface.style.transition = "none";
      g.surface.style.willChange = "transform";
      showSpinner(g.surface);
    }
    e.preventDefault(); // stop the WKWebView rubber-band while we own the gesture
    // Rubber-band damping: the further you pull, the less it moves.
    g.pull = Math.min(MAX_PULL, Math.max(0, dy) * 0.5);
    g.surface.style.transform = `translate3d(0,${g.pull}px,0)`;
    const p = Math.min(1, g.pull / THRESHOLD);
    spinner.style.opacity = String(p);
    spinner.firstChild.style.transform = `rotate(${p * 270}deg)`;
    spinner.firstChild.style.borderTopColor = p >= 1 ? "currentColor" : "transparent";
  }

  function onEnd() {
    if (!g) return;
    const cur = g;
    cancel(true);
    if (!cur.dragging) return;
    if (cur.pull >= THRESHOLD) runRefresh(cur.surface);
    else settle(cur.surface);
  }

  async function runRefresh(surface) {
    refreshing = true;
    surface.style.transition = `transform ${ANIM_MS}ms ease-out`;
    surface.style.transform = `translate3d(0,${HOLD}px,0)`;
    spinner.style.opacity = "1";
    spinner.firstChild.style.borderTopColor = "currentColor";
    spinner.firstChild.style.transform = "";
    spinner.firstChild.style.animation = "nb-ptr-spin 0.8s linear infinite";
    const started = Date.now();
    try { await onRefresh(); } catch (e) { /* the screen shows its own errors */ }
    const wait = MIN_SPIN_MS - (Date.now() - started);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    settle(surface);
  }

  function settle(surface) {
    surface.style.transition = `transform ${ANIM_MS}ms ease-out`;
    surface.style.transform = "translate3d(0,0,0)";
    spinner.style.transition = `opacity ${ANIM_MS}ms ease-out`;
    spinner.style.opacity = "0";
    setTimeout(() => {
      surface.style.transition = "";
      surface.style.transform = "";
      surface.style.willChange = "";
      spinner.style.display = "none";
      spinner.style.transition = "";
      spinner.firstChild.style.animation = "";
      refreshing = false;
    }, ANIM_MS);
  }

  function cancel() {
    document.removeEventListener("touchmove", onMove);
    g = null;
  }

  function showSpinner(surface) {
    const top = Math.max(0, surface.getBoundingClientRect().top);
    spinner.style.top = `${top + 12}px`;
    spinner.style.color = getComputedStyle(surface).color || "#888";
    spinner.style.display = "block";
    spinner.style.opacity = "0";
  }

  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });
  document.addEventListener("touchcancel", () => { if (g && g.dragging) settle(g.surface); cancel(); }, { passive: true });

  return () => {
    document.removeEventListener("touchstart", onStart);
    document.removeEventListener("touchend", onEnd);
    cancel();
    spinner.remove();
  };
}

function makeSpinner() {
  if (!document.getElementById("nb-ptr-style")) {
    const st = document.createElement("style");
    st.id = "nb-ptr-style";
    st.textContent = "@keyframes nb-ptr-spin { to { transform: rotate(360deg); } }";
    document.head.appendChild(st);
  }
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  Object.assign(wrap.style, {
    position: "fixed", left: "50%", width: "26px", height: "26px", marginLeft: "-13px",
    zIndex: "5", pointerEvents: "none", display: "none", opacity: "0",
  });
  const ring = document.createElement("div");
  Object.assign(ring.style, {
    width: "100%", height: "100%", boxSizing: "border-box", borderRadius: "50%",
    border: "2.5px solid currentColor", borderTopColor: "transparent", opacity: "0.7",
  });
  wrap.appendChild(ring);
  document.body.appendChild(wrap);
  return wrap;
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
