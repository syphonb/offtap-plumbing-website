import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { site } from "./src/data/site";

export default defineConfig({
  site: site.url,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  server: {
    host: true,
    allowedHosts: process.env.PUBLIC_URL
      ? [new URL(process.env.PUBLIC_URL).hostname]
      : [],
  },
});
