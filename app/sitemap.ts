import type { MetadataRoute } from "next";
import { NOTES } from "./content";

export const dynamic = "force-static";

const SITE = "https://aadityad.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["/", "/datasheet/", ...NOTES.map((n) => `/work/${n.id}/`)].map((path) => ({
    url: `${SITE}${path}`,
    lastModified,
  }));
}
