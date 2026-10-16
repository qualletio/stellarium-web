import { ogSize, renderOgImage } from "../lib/og";

export const alt = "Run a Stellarium node: a step by step guide";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "Build / Node guide", title: "Run a Stellarium node." });
}
