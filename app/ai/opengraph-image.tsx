import { ogSize, renderOgImage } from "../lib/og";

export const alt = "AI on Stellarium: call and host AI models on the network";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "AI / The basics", title: "AI on Stellarium." });
}
