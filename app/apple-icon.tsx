import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#102b31" }}>
        <svg width={128} height={128} viewBox="0 0 48 48" fill="none">
          <path d="M24 2v44M2 24h44" stroke="#d6f36a" strokeWidth="2" />
          <path d="m7 7 34 34M41 7 7 41" stroke="#d6f36a" strokeWidth="1.5" opacity=".5" />
          <circle cx="24" cy="24" r="6" fill="#d6f36a" />
        </svg>
      </div>
    ),
    size,
  );
}
