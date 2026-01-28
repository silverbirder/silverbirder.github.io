import type { MetadataRoute } from "next";

import { createSiteManifest } from "@repo/metadata";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return createSiteManifest();
}
