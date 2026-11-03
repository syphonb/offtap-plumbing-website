import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { test } from "node:test";
import { load } from "cheerio";

const origin = "https://offtapplumbingandgas.com.au";
const html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const $ = load(html);
const indexable = process.env.PUBLIC_SITE_INDEXABLE === "true";

test("homepage publishes one canonical identity and complete share metadata", async () => {
  assert.equal($("html").attr("lang"), "en-AU");
  assert.equal($("title").length, 1);
  assert.match($("title").text(), /Leak Detection Hervey Bay & Maryborough/);
  assert.ok(
    $("meta[name=description]").attr("content").includes("Fraser Coast"),
  );
  assert.equal($("link[rel=canonical]").length, 1);
  assert.equal($("link[rel=canonical]").attr("href"), `${origin}/`);
  assert.equal($('meta[property="og:url"]').attr("content"), `${origin}/`);
  assert.equal(
    $('meta[property="og:title"]').attr("content"),
    $("title").text(),
  );
  assert.equal(
    $('meta[name="twitter:card"]').attr("content"),
    "summary_large_image",
  );
  const image = new URL($('meta[property="og:image"]').attr("content"));
  assert.equal(image.origin, origin);
  assert.equal($('meta[name="twitter:image"]').attr("content"), image.href);
  await access(new URL(`../dist${image.pathname}`, import.meta.url));
  assert.equal($("link[rel=sitemap]").attr("href"), "/sitemap-index.xml");
});

test("indexing is opt-in, crawl files agree, and only actual pages enter the sitemap", async () => {
  assert.equal(
    $("meta[name=robots]").attr("content"),
    indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow",
  );
  const robots = await readFile(
    new URL("../dist/robots.txt", import.meta.url),
    "utf8",
  );
  assert.match(robots, indexable ? /^Allow: \/$/m : /^Disallow: \/$/m);
  assert.match(
    robots,
    new RegExp(`Sitemap: ${origin.replaceAll(".", "\\.")}/sitemap-index\\.xml`),
  );
  const sitemapIndex = load(
    await readFile(
      new URL("../dist/sitemap-index.xml", import.meta.url),
      "utf8",
    ),
    { xml: true },
  );
  assert.equal(sitemapIndex("loc").text(), `${origin}/sitemap-0.xml`);
  const sitemap = load(
    await readFile(new URL("../dist/sitemap-0.xml", import.meta.url), "utf8"),
    { xml: true },
  );
  assert.deepEqual(
    sitemap("loc")
      .map((_, element) => sitemap(element).text())
      .get(),
    [`${origin}/`],
  );
  const missing = load(
    await readFile(new URL("../dist/404.html", import.meta.url), "utf8"),
  );
  assert.equal(
    missing("meta[name=robots]").attr("content"),
    "noindex, nofollow",
  );
  assert.equal(missing("h1").length, 1);
});

test("content, links and all method explanations exist without executing JavaScript", async () => {
  assert.equal($("h1").length, 1);
  assert.equal($("header").length, 1);
  assert.equal($("main").length, 1);
  assert.equal($("footer").length, 1);
  assert.match($("h1").text(), /Specialist leak detection/);
  const ids = $("[id]")
    .map((_, element) => $(element).attr("id"))
    .get();
  assert.equal(ids.length, new Set(ids).size, "IDs must be unique");
  for (const id of [
    "acoustic",
    "nitrogen",
    "tracer-gas",
    "thermal",
    "locating",
  ]) {
    assert.ok($(`#${id} h3`).text());
    assert.equal(
      $(`#${id}`).attr("hidden"),
      undefined,
      "No-JS visitors can read every method",
    );
  }
  for (const element of $("a[href]").toArray()) {
    const href = $(element).attr("href");
    if (href === "#") continue;
    if (href.startsWith("#") || href.startsWith("/#"))
      assert.ok(ids.includes(href.split("#")[1]), `Broken anchor: ${href}`);
  }
  const navigationLinks = $('nav[aria-label="Primary"] a');
  assert.equal(navigationLinks.length, 5);
  for (const element of navigationLinks.toArray()) {
    assert.equal($(element).attr("href"), "#");
  }
  assert.ok($('a[href="tel:+61400152680"]').length);
  assert.ok($('a[href^="mailto:offtapplumbingandgas@hotmail.com"]').length);
  for (const element of $("img").toArray()) {
    assert.notEqual($(element).attr("alt"), undefined);
    assert.ok(Number($(element).attr("width")) > 0);
    assert.ok(Number($(element).attr("height")) > 0);
  }
  for (const element of $(
    "link[rel=stylesheet], script[src], img[src], image[href], link[rel=preload], link[rel=icon], link[rel=apple-touch-icon]",
  ).toArray()) {
    const resource = $(element).attr("href") ?? $(element).attr("src");
    assert.ok(
      resource.startsWith("/"),
      `Assets must be self-hosted: ${resource}`,
    );
    await access(new URL(`../dist${resource}`, import.meta.url));
  }
  assert.doesNotMatch(
    html,
    /fonts\.googleapis|data-placeholder|review\.js|Customer name/,
  );
});

test("structured data describes the visible business and services without fabricated trust claims", () => {
  const graph = JSON.parse($('script[type="application/ld+json"]').text());
  assert.equal(graph["@context"], "https://schema.org");
  const business = graph["@graph"].find(
    (entity) => entity["@type"] === "Plumber",
  );
  assert.equal(business.name, "OffTap Plumbing & Gas");
  assert.equal(business.telephone, "+61400152680");
  assert.deepEqual(
    business.areaServed.map((area) => area.name),
    [
      "Hervey Bay, Queensland, Australia",
      "Maryborough, Queensland, Australia",
      "Fraser Coast, Queensland, Australia",
    ],
  );
  for (const { itemOffered } of business.hasOfferCatalog.itemListElement) {
    const id = new URL(itemOffered.url).hash.slice(1);
    assert.equal($(`#${id} h3`).text(), itemOffered.name);
    assert.ok($(`#${id}`).text().includes(itemOffered.description));
    assert.equal(itemOffered.provider["@id"], business["@id"]);
  }
  assert.equal(business.hasOfferCatalog.itemListElement.length, 5);
  assert.doesNotMatch(
    JSON.stringify(graph),
    /aggregateRating|reviewRating|openingHours|streetAddress|priceRange/,
  );
});
