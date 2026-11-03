import type { APIRoute } from "astro";
import { isIndexable } from "../lib/seo";

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      "User-agent: *",
      isIndexable ? "Allow: /" : "Disallow: /",
      `Sitemap: ${new URL("/sitemap-index.xml", site).href}`,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
