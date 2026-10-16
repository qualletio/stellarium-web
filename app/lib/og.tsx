import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const ink = "#102b31";
const paper = "#f5f2ec";
const lime = "#d6f36a";

function StarMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 2v44M2 24h44" stroke={color} strokeWidth="1.5" />
      <path d="m7 7 34 34M41 7 7 41" stroke={color} strokeWidth="1" opacity=".45" />
      <circle cx="24" cy="24" r="5.5" fill={color} />
    </svg>
  );
}

// Shared 1200x630 social card: brand row, kicker, headline.
export function renderOgImage({ kicker, title }: { kicker: string; title: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: paper, color: ink }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 600 }}>
          <StarMark size={44} color={ink} />
          stellarium
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#657e32", marginBottom: 24 }}>{kicker}</div>
          <div style={{ fontSize: 80, lineHeight: 1, letterSpacing: -3, fontWeight: 600, maxWidth: 900 }}>{title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: "#456167" }}>
          stellarium.sh
          <div style={{ display: "flex", width: 72, height: 72, borderRadius: 36, background: ink, alignItems: "center", justifyContent: "center" }}>
            <StarMark size={40} color={lime} />
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
