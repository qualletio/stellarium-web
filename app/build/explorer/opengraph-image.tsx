import { ogSize, renderOgImage } from "../../lib/og";

export const alt = "Stellarium Explorer: a desktop app for writing and running requests";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "Build / Desktop app", title: "Stellarium Explorer." });
}
