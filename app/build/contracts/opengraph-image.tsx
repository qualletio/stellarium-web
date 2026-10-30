import { ogSize, renderOgImage } from "../../lib/og";

export const alt = "Contracts: RequestScript resources deployed to any Stellarium node";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ kicker: "Build / Contracts", title: "Contracts." });
}
