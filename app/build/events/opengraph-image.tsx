import { ogSize, renderOgImage } from "../../lib/og";

export const alt = "Events: contracts that react to each other across Stellarium nodes";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "Build / Events", title: "Events." });
}
