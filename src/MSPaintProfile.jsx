import React, { useRef, useState, useEffect } from "react";

// ---- MS Paint palette (28 classic colors) ----
const PAL = ["#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080","#808040","#004040","#0080ff","#004080","#8000ff","#804000",
  "#ffffff","#c0c0c0","#ff0000","#ffff00","#00ff00","#00ffff","#0000ff","#ff00ff","#ffff80","#00ff80","#80ffff","#8080ff","#ff0080","#ff8040"];

const STAR = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path d="M8 1l1.9 4.3 4.7.4-3.6 3.1 1.1 4.6L8 11.1 3.9 13.5l1.1-4.6L1.4 5.7l4.7-.4z" fill="#ffe14d" stroke="#000" stroke-width="1" stroke-linejoin="round"/></svg>');
const HEART = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 18 16"><path d="M9 15C9 15 1.5 10 1.5 5.2 1.5 2.8 3.3 1.5 5 1.5 6.8 1.5 8.3 3 9 4.2 9.7 3 11.2 1.5 13 1.5c1.7 0 3.5 1.3 3.5 3.7C16.5 10 9 15 9 15z" fill="#ff2d6a" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/></svg>');

// bevel helpers
const raised = { border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", background: "#c0c0c0" };
const sunken = { border: "2px solid", borderColor: "#404040 #ffffff #ffffff #404040", background: "#fff" };

// ---- tool SVG icons ----
const ICONS = {
  pencil: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><path d="M3 19l1.5-4.5L14 5l3 3-9.5 9.5L3 19z" fill="#ffd94a" stroke="#000" strokeWidth="1"/><path d="M14 5l3 3 1.5-1.5-3-3L14 5z" fill="#c0c0c0" stroke="#000"/><path d="M3 19l1.5-.5-1-1L3 19z" fill="#000"/></svg>,
  spray: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><rect x="7" y="9" width="8" height="9" fill="#b0b0b0" stroke="#000"/><rect x="8" y="6" width="4" height="3" fill="#808080" stroke="#000"/><path d="M12 7h3v-2" stroke="#000" fill="none"/><circle cx="17" cy="4" r="1" fill="#000"/><circle cx="19" cy="6" r="1" fill="#000"/><circle cx="18" cy="2" r="1" fill="#000"/></svg>,
  text: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><path d="M6 17L10 5h2l4 12h-2.2l-1-3H9.2l-1 3H6z" fill="#000"/><path d="M9.7 12h2.6L11 8.2 9.7 12z" fill="#fff"/></svg>,
  fill: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><path d="M9 3l7 7-6 6-7-7 6-6z" fill="#c0c0c0" stroke="#000"/><path d="M4 16l6 0-6-6-1 3 1 3z" fill="#3a6ea5" stroke="#000"/><path d="M17 12c2 2 2 4 1 5s-3 0-2-2 1-3 1-3z" fill="#c00060" stroke="#000"/></svg>,
  eyedrop: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><path d="M14 3l4 4-2 2-4-4 2-2z" fill="#c0c0c0" stroke="#000"/><path d="M12 5l4 4-8 8-3 1 1-3 6-6z" fill="#ffd94a" stroke="#000"/></svg>,
  bomb: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><circle cx="10" cy="14" r="6" fill="#111" stroke="#000"/><circle cx="8" cy="12" r="1.6" fill="#fff" opacity=".7"/><path d="M14 8l2-2" stroke="#000" strokeWidth="2" fill="none"/><path d="M16 6l1.5-1.5" stroke="#c00060" strokeWidth="2" fill="none"/><circle cx="18.5" cy="3.5" r="1.6" fill="#ff9a00" stroke="#c00060"/></svg>,
  lockClosed: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><rect x="5" y="10" width="12" height="9" fill="#ffd94a" stroke="#000"/><path d="M7 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#000" strokeWidth="2"/><rect x="10" y="13" width="2" height="3" fill="#000"/></svg>,
  lockOpen: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><rect x="5" y="10" width="12" height="9" fill="#b7e0a0" stroke="#000"/><path d="M7 10V7a4 4 0 0 1 8 0" fill="none" stroke="#000" strokeWidth="2"/><rect x="10" y="13" width="2" height="3" fill="#000"/></svg>,
  save: <svg width="22" height="22" viewBox="0 0 22 22" shapeRendering="crispEdges"><rect x="3" y="3" width="16" height="16" fill="#0a3a8a" stroke="#000"/><rect x="6" y="3" width="7" height="6" fill="#fff" stroke="#000"/><rect x="10" y="4" width="2" height="4" fill="#0a3a8a"/><rect x="6" y="12" width="10" height="6" fill="#c0c0c0" stroke="#000"/></svg>,
};

export default function MSPaintProfile({
  displayName, username, bio, avatarUrl, accentColor,
  stats, albums, reviews, isOwn, isMobile,
  initialDrawing, onSaveDrawing,
  onOpenSettings, onOpenAlbum, onOpenReview, onOpenUser,
  renderAvatar, renderAlbumCover, backButton,
}) {
  const nameColor = accentColor || "#d6006e";
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [locked, setLocked] = useState(true);
  const [confirmBomb, setConfirmBomb] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const canvasRef = useRef(null);
  const flashRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef(null);
  const lockedRef = useRef(locked);
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => { colorRef.current = color; }, [color]);

  // ---- canvas setup ----
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const wrap = c.parentElement;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctxRef.current = ctx;

    let loadedOnce = false;
    const resize = () => {
      const w = Math.round(wrap.clientWidth), h = Math.round(wrap.clientHeight);
      if (!w || !h || (c.width === w && c.height === h)) return;
      let prev = null;
      try { if (c.width && c.height) prev = ctx.getImageData(0, 0, c.width, c.height); } catch (e) {}
      c.width = w; c.height = h;
      if (prev) ctx.putImageData(prev, 0, 0);
      // load saved drawing once, after first sizing
      if (!loadedOnce && initialDrawing) {
        loadedOnce = true;
        const img = new Image();
        img.onload = () => { try { ctx.drawImage(img, 0, 0); } catch (e) {} };
        img.src = initialDrawing;
      }
    };
    resize();
    const t = setTimeout(resize, 400);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const pos = (e) => {
      const r = c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
    };
    const spray = (x, y) => {
      ctx.fillStyle = colorRef.current;
      for (let i = 0; i < 14; i++) { const a = Math.random() * Math.PI * 2, r = Math.random() * 13;
        ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 1.4, 1.4); }
    };
    const flood = (sx, sy, hex) => {
      const W = c.width, H = c.height; if (sx < 0 || sy < 0 || sx >= W || sy >= H) return;
      const image = ctx.getImageData(0, 0, W, H), d = image.data;
      const at = (x, y) => (y * W + x) * 4;
      const s = at(sx, sy);
      const tr = d[s], tg = d[s + 1], tb = d[s + 2], ta = d[s + 3];
      const n = parseInt(hex.slice(1), 16); const nr = (n >> 16) & 255, ng = (n >> 8) & 255, nb = n & 255;
      if (tr === nr && tg === ng && tb === nb && ta === 255) return;
      const match = (i) => d[i] === tr && d[i + 1] === tg && d[i + 2] === tb && d[i + 3] === ta;
      const stack = [[sx, sy]];
      while (stack.length) { const [x, y] = stack.pop(); const i = at(x, y);
        if (!match(i)) continue;
        d[i] = nr; d[i + 1] = ng; d[i + 2] = nb; d[i + 3] = 255;
        if (x > 0) stack.push([x - 1, y]); if (x < W - 1) stack.push([x + 1, y]);
        if (y > 0) stack.push([x, y - 1]); if (y < H - 1) stack.push([x, y + 1]); }
      ctx.putImageData(image, 0, 0);
    };

    const onDown = (e) => {
      if (lockedRef.current) return;
      const p = pos(e); const t2 = toolRef.current;
      if (t2 === "fill") { flood(Math.round(p.x), Math.round(p.y), colorRef.current); setDirty(true); return; }
      if (t2 === "text") { const s = window.prompt("Text:"); if (s) { ctx.fillStyle = colorRef.current;
        ctx.font = '28px "MSPain","Trebuchet MS",sans-serif'; ctx.textBaseline = "top"; ctx.fillText(s, p.x, p.y); setDirty(true); } return; }
      if (t2 === "eyedrop") { const d = ctx.getImageData(Math.round(p.x), Math.round(p.y), 1, 1).data;
        if (d[3]) setColor("#" + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, "0")).join("")); return; }
      drawingRef.current = true; lastRef.current = p; c.setPointerCapture(e.pointerId); setDirty(true);
      if (t2 === "spray") spray(p.x, p.y);
      else { ctx.strokeStyle = colorRef.current; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 0.1, p.y + 0.1); ctx.stroke(); }
    };
    const onMove = (e) => {
      if (!drawingRef.current) return; const p = pos(e); const t2 = toolRef.current;
      if (t2 === "spray") spray(p.x, p.y);
      else { ctx.strokeStyle = colorRef.current; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.beginPath(); ctx.moveTo(lastRef.current.x, lastRef.current.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
      lastRef.current = p;
    };
    const stop = () => { drawingRef.current = false; };
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", stop);
    c.addEventListener("pointercancel", stop);
    return () => { clearTimeout(t); ro.disconnect();
      c.removeEventListener("pointerdown", onDown); c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerup", stop); c.removeEventListener("pointercancel", stop); };
  }, [initialDrawing]);

  const doBomb = () => {
    if (lockedRef.current) { setConfirmBomb(false); return; }
    setConfirmBomb(false);
    const c = canvasRef.current, ctx = ctxRef.current;
    if (ctx && c) ctx.clearRect(0, 0, c.width, c.height);
    setDirty(true);
    const f = flashRef.current;
    if (f) { f.style.transition = "none"; f.style.opacity = "1"; f.style.transform = "translate(-50%,-50%) scale(.3)";
      requestAnimationFrame(() => { f.style.transition = "opacity .5s ease-out, transform .5s ease-out";
        f.style.opacity = "0"; f.style.transform = "translate(-50%,-50%) scale(2.4)"; }); }
  };

  const handleSave = () => {
    const c = canvasRef.current; if (!c || !onSaveDrawing) return;
    setSaving(true);
    try {
      const dataUrl = c.toDataURL("image/png");
      Promise.resolve(onSaveDrawing(dataUrl)).finally(() => { setSaving(false); setDirty(false); });
    } catch (e) { setSaving(false); }
  };

  const toolBtnStyle = (active, size) => ({
    width: size, height: size, cursor: "pointer", padding: 0,
    display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit",
    border: "2px solid", borderColor: active ? "#404040 #ffffff #ffffff #404040" : "#ffffff #404040 #404040 #ffffff",
    background: active ? "#e8e8e8" : "#c0c0c0",
  });

  const toolName = { pencil: "Pencil", spray: "Airbrush", text: "Text", fill: "Fill With Color", eyedrop: "Pick Color" }[tool];
  const statusMsg = locked ? "\uD83D\uDD12 Locked \u00b7 unlock to draw on the background" : `${toolName} \u00b7 draw on the background`;

  const btnSize = isMobile ? 38 : 34;

  // ---- tool button list ----
  const tools = [
    { key: "pencil", icon: ICONS.pencil, title: "Pencil", onClick: () => setTool("pencil"), active: tool === "pencil" },
    { key: "spray", icon: ICONS.spray, title: "Airbrush", onClick: () => setTool("spray"), active: tool === "spray" },
    { key: "text", icon: ICONS.text, title: "Text", onClick: () => setTool("text"), active: tool === "text" },
    { key: "fill", icon: ICONS.fill, title: "Fill With Color", onClick: () => setTool("fill"), active: tool === "fill" },
    { key: "eyedrop", icon: ICONS.eyedrop, title: "Pick Color", onClick: () => setTool("eyedrop"), active: tool === "eyedrop" },
  ];

  const ToolButtons = () => (
    <>
      {tools.map((t) => (
        <button key={t.key} title={t.title} onClick={t.onClick} style={toolBtnStyle(t.active, btnSize)}>{t.icon}</button>
      ))}
      <div style={{ position: "relative", marginTop: isMobile ? 0 : 6, marginLeft: isMobile ? 4 : 0 }}>
        <button title="Bomb — erase everything" onClick={() => !locked && setConfirmBomb(true)}
          style={{ ...toolBtnStyle(false, btnSize), background: "#ffd6d6", borderColor: confirmBomb ? "#404040 #ffffff #ffffff #404040" : "#ffffff #404040 #404040 #ffffff" }}>{ICONS.bomb}</button>
        {confirmBomb && !isMobile && (
          <div style={{ position: "absolute", top: 40, left: 0, width: 172, zIndex: 20, background: "#ffffe1", border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", boxShadow: "3px 3px 0 rgba(0,0,0,.4)", padding: 10, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontSize: 16, color: "#000", lineHeight: 1.15 }}>are you sure? this will erase your art</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={doBomb} style={{ flex: 1, cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#000", padding: "5px 4px", border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", background: "#ffb3b3" }}>yes, blow it up</button>
              <button onClick={() => setConfirmBomb(false)} style={{ flex: 1, cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#000", padding: "5px 4px", border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", background: "#c0c0c0" }}>cancel</button>
            </div>
          </div>
        )}
      </div>
      <button title={locked ? "Locked — click to unlock" : "Unlocked — click to lock"} onClick={() => setLocked((v) => !v)}
        style={{ ...toolBtnStyle(false, btnSize), marginTop: isMobile ? 0 : 6, marginLeft: isMobile ? 4 : 0, background: locked ? "#ffe9a8" : "#d3f0c4" }}>
        {locked ? ICONS.lockClosed : ICONS.lockOpen}
      </button>
      {isOwn && !locked && (
        <button title="Save drawing" onClick={handleSave} disabled={saving}
          style={{ ...toolBtnStyle(false, btnSize), marginTop: isMobile ? 0 : 6, marginLeft: isMobile ? 4 : 0, background: dirty ? "#c8e0ff" : "#c0c0c0" }}>
          {ICONS.save}
        </button>
      )}
    </>
  );

  // section bar
  const SectionBar = ({ children, stars }) => (
    <div style={{ background: "linear-gradient(90deg,#000080,#1084d0)", color: "#fff", fontSize: isMobile ? 19 : 20, textAlign: "center", padding: "5px 12px", boxShadow: "2px 2px 0 rgba(0,0,0,.35)", margin: "18px 0 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {stars && <img src={STAR} width="20" height="20" alt="" />}
      {children}
      {stars && <img src={STAR} width="20" height="20" alt="" />}
    </div>
  );

  const statChips = [
    { n: stats.followers, label: "followers", bg: "#ffd1dc" },
    { n: stats.following, label: "following", bg: "#d1ecff" },
    { n: stats.listened, label: "listened", bg: "#d9ffd1" },
    { n: stats.reviews, label: "reviews", bg: "#fff3c4" },
  ];

  return (
    <div style={{ background: "#008080", padding: isMobile ? 8 : 22, fontFamily: '"MSPain","Trebuchet MS",Tahoma,sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", border: isMobile ? "2px solid" : "3px solid", borderColor: "#ffffff #404040 #404040 #ffffff", background: "#c0c0c0", boxShadow: isMobile ? "2px 2px 0 rgba(0,0,0,.4)" : "3px 3px 0 rgba(0,0,0,.5)" }}>

        {/* title bar */}
        <div style={{ background: "linear-gradient(90deg,#000080,#1084d0)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 5px", fontSize: 15 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" shapeRendering="crispEdges"><rect x="1" y="4" width="9" height="7" fill="#fff" stroke="#000"/><rect x="3" y="1" width="4" height="3" fill="#c00060" stroke="#000"/></svg>
            </span>
            {username}.bmp{isMobile ? "" : " - Spindex Paint"}
          </span>
          <span style={{ display: "flex", gap: 4 }}>
            {["_", "\u25a1", "\u00d7"].map((s, i) => (
              <span key={i} style={{ ...raised, width: 18, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#000", lineHeight: 1 }}>{s}</span>
            ))}
          </span>
        </div>

        {/* menu bar (desktop only) */}
        {!isMobile && (
          <div style={{ background: "#c0c0c0", display: "flex", gap: 14, padding: "3px 8px", fontSize: 14, borderBottom: "1px solid #808080" }}>
            {[["F", "ile"], ["E", "dit"], ["V", "iew"], ["I", "mage"], ["C", "olors"], ["H", "elp"]].map(([c, rest], i) => (
              <span key={i} style={{ color: "#000" }}><u>{c}</u>{rest}</span>
            ))}
          </div>
        )}

        {/* body: toolbar + canvas */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", background: "#c0c0c0" }}>
          {/* toolbar */}
          <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: isMobile ? 4 : 6, padding: 5, background: "#c0c0c0", overflowX: isMobile ? "auto" : "visible", alignItems: "flex-start" }}>
            <ToolButtons />
          </div>

          {/* canvas + content */}
          <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
            <div style={{ position: "relative", background: "#fff", ...sunken, minHeight: 400 }}>
              <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, cursor: locked ? "default" : "crosshair", touchAction: "none", width: "100%", height: "100%" }} />
              <div ref={flashRef} style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%) scale(.3)", fontSize: 120, opacity: 0, pointerEvents: "none", zIndex: 2 }}>{"\uD83D\uDCA5"}</div>

              {/* profile content — pointer-events none, interactive children re-enable */}
              <div style={{ position: "relative", zIndex: 1, pointerEvents: "none", padding: isMobile ? "16px 14px" : "22px 26px" }}>
                {backButton && <div style={{ pointerEvents: "auto", marginBottom: 12 }}>{backButton}</div>}

                {/* header */}
                <div style={{ position: "relative", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "flex-start", gap: isMobile ? 10 : 20, textAlign: isMobile ? "center" : "left" }}>
                  <div style={{ pointerEvents: "auto", width: isMobile ? 120 : 170, height: isMobile ? 120 : 170, ...sunken, padding: 3, flexShrink: 0 }}>
                    {renderAvatar ? renderAvatar(isMobile ? 114 : 164) : (avatarUrl ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#0a3a8a" }} />)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? 40 : 52, color: nameColor, lineHeight: 1 }}>{displayName}</div>
                    <div style={{ fontSize: 18, color: "#0000c0", marginTop: 4 }}>@{username}</div>
                    {bio && <div style={{ display: "inline-block", marginTop: 10, background: "#fff8b0", border: "2px solid #000", padding: "4px 10px", fontSize: 16, color: "#000", boxShadow: "2px 2px 0 rgba(0,0,0,.3)" }}>{bio}</div>}
                  </div>
                  {isOwn && onOpenSettings && (
                    isMobile ? (
                      <button onClick={onOpenSettings} title="settings" style={{ pointerEvents: "auto", position: "absolute", top: 0, right: 0, width: 34, height: 34, ...raised, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u2699"}</button>
                    ) : (
                      <button onClick={onOpenSettings} style={{ pointerEvents: "auto", ...raised, cursor: "pointer", fontFamily: "inherit", fontSize: 15, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>{"\u2699"} settings</button>
                    )
                  )}
                </div>

                {/* stats */}
                <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", gap: 6, marginTop: 18 }}>
                  {statChips.map((s, i) => (
                    <div key={i} style={{ flex: isMobile ? "1 1 0" : "0 0 auto", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: isMobile ? "6px 4px" : "8px 16px", background: s.bg, border: "2px solid #000", boxShadow: "2px 2px 0 rgba(0,0,0,.35)" }}>
                      <div style={{ fontSize: isMobile ? 20 : 22, color: "#000" }}>{s.n}</div>
                      <div style={{ fontSize: 11, color: "#000" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* top 3 albums */}
                <SectionBar stars>{displayName}'s top 3 albums</SectionBar>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: isMobile ? 10 : 14 }}>
                  {(albums || []).map((alb, i) => (
                    <div key={i} style={{ pointerEvents: "auto", cursor: "pointer" }} onClick={() => onOpenAlbum && onOpenAlbum(alb.id)}>
                      <div style={{ ...sunken, padding: 3, aspectRatio: "1" }}>
                        {renderAlbumCover ? renderAlbumCover(alb) : (alb.src ? <img src={alb.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#0a3a8a" }} />)}
                      </div>
                      <div style={{ fontSize: 15, color: "#0000c0", textAlign: "center", marginTop: 6 }}>{alb.title}</div>
                    </div>
                  ))}
                </div>

                {/* recent reviews */}
                <SectionBar>recent reviews</SectionBar>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(reviews || []).map((r, i) => (
                    <div key={i} style={{ background: "#f4f4f4", border: "2px solid #808080", padding: 12, pointerEvents: "auto", cursor: "pointer" }} onClick={() => onOpenReview && onOpenReview(r)}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 84, height: 84, ...sunken, padding: 2, flexShrink: 0 }}>
                          {r.renderCover ? r.renderCover(80) : (r.src ? <img src={r.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#0a3a8a" }} />)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 22, color: nameColor }}>{r.score}/10</div>
                          <div style={{ fontSize: 16, color: "#000", fontWeight: 700 }}>{r.albumTitle}</div>
                          <div style={{ fontSize: 14, color: "#444" }}>{r.artist}</div>
                        </div>
                      </div>
                      {r.body && <div style={{ fontSize: 15, color: "#000", marginTop: 8, lineHeight: 1.4 }}>{r.body}</div>}
                      {r.favoriteTrack && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 14, color: "#444" }}><img src={HEART} width="18" height="16" alt="" /> {r.favoriteTrack}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* palette footer */}
        <div style={{ background: "#c0c0c0", padding: "5px 8px", display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #ffffff" }}>
          <div style={{ ...raised, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 14, height: 14, background: color, border: "1px solid #000" }} />
          </div>
          <div style={{ display: "grid", gridTemplateRows: "repeat(2,16px)", gridAutoFlow: "column", gap: 2, overflowX: "auto" }}>
            {PAL.map((hex) => (
              <button key={hex} onClick={() => setColor(hex)} title={hex}
                style={{ width: 16, height: 16, background: hex, boxSizing: "border-box", cursor: "pointer", padding: 0, border: color.toLowerCase() === hex ? "2px solid #ff0080" : "1px solid #808080" }} />
            ))}
          </div>
        </div>

        {/* status bar */}
        <div style={{ background: "#c0c0c0", padding: "3px 6px" }}>
          <div style={{ border: "1px solid", borderColor: "#808080 #ffffff #ffffff #808080", padding: "3px 8px", fontSize: 13, color: "#000" }}>{statusMsg}</div>
        </div>
      </div>

      {/* mobile bomb confirm modal */}
      {confirmBomb && isMobile && (
        <div onClick={() => setConfirmBomb(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.25)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 250, background: "#ffffe1", border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", boxShadow: "3px 3px 0 rgba(0,0,0,.4)", padding: 16, fontFamily: '"MSPain","Trebuchet MS",sans-serif' }}>
            <div style={{ fontSize: 16, color: "#000", marginBottom: 12, lineHeight: 1.2 }}>are you sure? this will erase your art</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={doBomb} style={{ flex: 1, cursor: "pointer", fontFamily: "inherit", fontSize: 15, padding: "8px 4px", border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", background: "#ffb3b3" }}>yes, blow it up</button>
              <button onClick={() => setConfirmBomb(false)} style={{ flex: 1, cursor: "pointer", fontFamily: "inherit", fontSize: 15, padding: "8px 4px", border: "2px solid", borderColor: "#ffffff #404040 #404040 #ffffff", background: "#c0c0c0" }}>cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
