import { ogSize, renderOgImage } from "../../lib/og";

export const alt = "Inference functions: per-token pricing for AI on Stellarium";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "AI / Inference functions", title: "Inference functions." });
}
