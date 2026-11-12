import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { site } from "../src/lib/site.ts";

// These checks run against the static build in dist/, after `astro build`.
const read = (file) => readFileSync(join("dist", file), "utf8");
const dataset = JSON.parse(
  readFileSync("../../packages/categories/netflix-categories.json", "utf8"),
);
const countAll = (categories) =>
  categories.reduce(
    (total, category) => total + 1 + countAll(category.children ?? []),
    0,
  );
const total = countAll(dataset.categories);
const store =
  "https://chromewebstore.google.com/detail/categories-for-netflix-un/dhmkkdcngbedlfggdpdnoahebcdnmdlj";
const origin = site.url;
const pages = ["index.html", "codes.html", "privacy.html", "404.html"];

test("every page has one h1, a canonical URL, and working local links", () => {
  for (const page of pages) {
    const html = read(page);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page);
    assert.ok(html.includes(`<link rel="canonical" href="${origin}`));
    assert.match(html, /Not affiliated with, endorsed by, or sponsored by/);
    for (const [, asset] of html.matchAll(
      /(?:src|href)="(\/_astro\/[^"?#]+)"/g,
    )) {
      assert.ok(existsSync(join("dist", asset)), `Missing asset: ${asset}`);
    }
    for (const [, path, hash] of html.matchAll(/href="(\/[a-z]*)?#([^"]+)"/g)) {
      const target = path && path !== "/" ? `${path.slice(1)}.html` : page;
      const source = path === "/" ? read("index.html") : read(target);
      assert.ok(source.includes(`id="${hash}"`), `Missing anchor: #${hash}`);
    }
    for (const [, path] of html.matchAll(/href="(\/[a-z]+)"/g)) {
      assert.ok(existsSync(join("dist", `${path}.html`)), `Dead link ${path}`);
    }
  }
});

test("the landing page sells the extension honestly", () => {
  const html = read("index.html");
  assert.ok(html.includes(`href="${store}"`));
  assert.match(html, /Storage-only/);
  assert.equal((html.match(/<details\b/g) ?? []).length, 5);
  assert.ok(
    html.includes(
      `<meta property="og:image" content="${origin}/_astro/social-card`,
    ),
  );
  assert.match(html, new RegExp(`${total.toLocaleString("en-US")} CATEGORIES`));
  for (const name of [
    "popup-browse",
    "popup-favorites",
    "popup-search",
    "options",
  ]) {
    assert.match(
      html,
      new RegExp(`<img[^>]*src="[^"]*${name}[^"]*"[^>]*alt="[^"]+"`),
      name,
    );
  }
});

test("the codes page and JSON list every category from the shared dataset", () => {
  const html = read("codes.html");
  const rows = (html.match(/<li data-row>/g) ?? []).length;
  const groups = (html.match(/<section id="[^"]+" data-group/g) ?? []).length;
  assert.equal(groups, dataset.categories.length);
  assert.equal(rows + groups, total);

  const json = JSON.parse(read("codes.json"));
  assert.equal(json.updatedAt, dataset.updatedAt);
  assert.equal(json.categories.length, total);
  for (const [name, code, group] of json.categories) {
    assert.ok(name && group, `Incomplete entry for ${code}`);
    assert.match(code, /^\d{2,}$/);
    assert.ok(
      html.includes(`href="https://www.netflix.com/browse/genre/${code}"`),
      `Missing link for ${code}`,
    );
  }
});

test("the privacy page mirrors the repository policy", () => {
  const html = read("privacy.html");
  assert.match(html, /chrome\.storage\.local/);
  assert.match(html, /Limited Use/);
});

test("search engines get a sitemap, and the 404 page stays out of it", () => {
  assert.ok(read("robots.txt").includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemap = read("sitemap.xml");
  for (const path of ["", "/codes", "/privacy"]) {
    assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`));
  }
  assert.doesNotMatch(sitemap, /404/);
  assert.match(read("404.html"), /<meta name="robots" content="noindex"/);
});

test("the site never borrows Netflix's red as its own accent", () => {
  const css = readdirSync("dist/_astro")
    .filter((file) => file.endsWith(".css"))
    .map((file) => read(join("_astro", file)))
    .join("");
  assert.doesNotMatch(css, /#e50914/i);
});
