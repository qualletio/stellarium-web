import { ogSize, renderOgImage } from "./lib/og";

export const alt = "Stellarium, the decentralized, programmable API network";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "The programmable API network", title: "Make APIs as open as the web." });
}
