import React, { useState } from "react";

export default function AdminAddAlbum({ apiFetch, backendUrl }) {
  const [f, setF] = useState({ artistName: "", title: "", coverArtUrl: "", musicbrainzId: "", releaseYear: "", releaseType: "Album" });
  const [status, setStatus] = useState(null); // { ok, msg }
  const [busy, setBusy] = useState(false);

  const upd = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!f.title.trim() || !f.artistName.trim()) { setStatus({ ok: false, msg: "Artist and title are required." }); return; }
    setBusy(true); setStatus(null);
    try {
      const r = await apiFetch(`${backendUrl}/api/albums/admin-add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await r.json();
      if (r.ok && data.album) {
        setStatus({ ok: true, msg: (data.existed ? "Already existed: " : "Added: ") + data.album.title + " — " + data.album.artistName });
        setF({ artistName: "", title: "", coverArtUrl: "", musicbrainzId: "", releaseYear: "", releaseType: "Album" });
      } else {
        setStatus({ ok: false, msg: data.error || "Failed to add." });
      }
    } catch (e) {
      setStatus({ ok: false, msg: "Request failed." });
    } finally { setBusy(false); }
  };

  const inp = { fontFamily: "inherit", fontSize: 13, padding: "8px 10px", border: "1px solid #d5d5db", borderRadius: 0, width: "100%", boxSizing: "border-box", background: "#fff", color: "#141414" };
  const lbl = { fontSize: 11, color: "#6b6b74", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.04em" };

  return (
    <div style={{ borderTop: "1px solid #eceef1", marginTop: 20, paddingTop: 18, textAlign: "left" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#b23", marginBottom: 4 }}>⚙ Admin — Add Album</div>
      <div style={{ fontSize: 11, color: "#8a8a92", marginBottom: 14 }}>Add an album to the catalog. Artist + title required; MusicBrainz ID auto-resolves the cover.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div><label style={lbl}>Artist *</label><input style={inp} value={f.artistName} onChange={upd("artistName")} placeholder="Radiohead" /></div>
        <div><label style={lbl}>Album title *</label><input style={inp} value={f.title} onChange={upd("title")} placeholder="In Rainbows" /></div>
      </div>
      <div style={{ marginBottom: 10 }}><label style={lbl}>Cover art URL (optional)</label><input style={inp} value={f.coverArtUrl} onChange={upd("coverArtUrl")} placeholder="https://..." /></div>
      <div style={{ marginBottom: 10 }}><label style={lbl}>MusicBrainz release-group ID (optional)</label><input style={inp} value={f.musicbrainzId} onChange={upd("musicbrainzId")} placeholder="b1392450-e666-3926-a536-22c65f834433" /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div><label style={lbl}>Year (optional)</label><input style={inp} value={f.releaseYear} onChange={upd("releaseYear")} placeholder="2007" inputMode="numeric" /></div>
        <div><label style={lbl}>Type</label>
          <select style={inp} value={f.releaseType} onChange={upd("releaseType")}>
            <option>Album</option><option>EP</option><option>Single</option><option>Compilation</option><option>Live</option>
          </select>
        </div>
      </div>
      <button onClick={submit} disabled={busy} style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "9px 18px", background: "#22406e", color: "#fff", border: "none", borderRadius: 0, cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
        {busy ? "Adding…" : "Add Album"}
      </button>
      {status && (
        <div style={{ marginTop: 12, fontSize: 12.5, color: status.ok ? "#1a7f37" : "#b23", padding: "8px 10px", background: status.ok ? "#eafaef" : "#fdeaea", border: `1px solid ${status.ok ? "#bfe5cb" : "#f2c2c2"}` }}>{status.msg}</div>
      )}
    </div>
  );
}
