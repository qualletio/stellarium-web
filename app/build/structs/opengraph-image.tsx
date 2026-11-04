import { ogSize, renderOgImage } from "../../lib/og";

export const alt = "Structs: shared, versioned types across Stellarium nodes";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "Build / Structs", title: "Structs." });
}
