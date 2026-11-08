import { ogSize, renderOgImage } from "../../lib/og";

export const alt = "Autonomous agents: deploy and call your own code on Stellarium";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "AI / Autonomous agents", title: "Autonomous agents." });
}
