import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Image de partage (Open Graph) générée : cohérente avec l'identité, sans photo inventée. */
export function renderOg({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const lines = Array.from({ length: 26 }, (_, i) => i * 48);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3efe7", position: "relative", fontFamily: "sans-serif" }}>
        {lines.map((x) => (
          <div key={`v${x}`} style={{ position: "absolute", left: x, top: 0, width: 1, height: 630, background: "rgba(53,99,233,0.08)" }} />
        ))}
        {lines.slice(0, 14).map((y) => (
          <div key={`h${y}`} style={{ position: "absolute", top: y, left: 0, height: 1, width: 1200, background: "rgba(53,99,233,0.08)" }} />
        ))}
        <div style={{ position: "absolute", right: 90, top: 90, width: 300, height: 400, border: "14px solid #383c42", borderRadius: 6, background: "linear-gradient(180deg,#dfe8f8,#f4ebdc)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, color: "#0d1a2e", letterSpacing: -1 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #0d1a2e", borderRadius: 9, display: "flex" }} />
            Aéris
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#5b6780", letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ fontSize: 72, color: "#0d1a2e", lineHeight: 1.02, letterSpacing: -3, marginTop: 18 }}>{title}</div>
            <div style={{ fontSize: 28, color: "#33415c", marginTop: 22 }}>{subtitle}</div>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
