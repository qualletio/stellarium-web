import { ogSize, renderOgImage } from "../lib/og";

export const alt = "What is Stellarium? A decentralized, programmable API network";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "Learn / The basics", title: "What is Stellarium?" });
}
