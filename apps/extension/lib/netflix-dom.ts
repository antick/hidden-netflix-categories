const NAV_SELECTORS = [
  ".tabbed-primary-navigation",
  "ul[data-uia='tabbed-primary-navigation']",
  "[data-uia='tabbed-primary-navigation']",
  ".main-header ul[role='navigation']",
  "div.main-header nav ul",
  "ul.main-navigation",
  "header ul[data-uia='primary-navigation']",
  "[data-uia='nmhp-header'] nav",
  "header nav",
  ".main-header nav",
  "[class*='tabbed-primary-navigation']",
  "nav[aria-label]",
];

const NAV_LABELS = new Set([
  "home",
  "shows",
  "tv shows",
  "movies",
  "games",
  "new & popular",
  "my list",
  "browse by languages",
]);

const SKIP_PATHS = [
  /^\/watch\b/,
  /^\/login/,
  /^\/Logout/,
  /^\/account/,
  /^\/signup/,
];

function isHtmlElement(value: unknown): value is HTMLElement {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as Node).nodeType === 1 &&
    typeof (value as HTMLElement).tagName === "string"
  );
}

const NAV_ITEM_SELECTOR = "a, button, [role='link'], [role='tab']";
const LOGO_HREFS = new Set([
  "/",
  "https://www.netflix.com/",
  "https://www.netflix.com",
  "https://netflix.com/",
  "https://netflix.com",
  "https://www.netflix.com/browse",
]);

export function normalizeLabel(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isNavLabel(text: string | null | undefined): boolean {
  return NAV_LABELS.has(normalizeLabel(text));
}

export function isNetflixHeaderAvailable(
  doc: Document = document,
  pathname = location.pathname,
): boolean {
  return Boolean(findNetflixNavigationAnchor(doc, pathname));
}

export function shouldMountOnPath(pathname: string): boolean {
  return !SKIP_PATHS.some((pattern) => pattern.test(pathname));
}

function elementLabel(el: Element): string {
  const aria = normalizeLabel(el.getAttribute("aria-label"));
  if (aria) return aria;
  return normalizeLabel(el.textContent);
}

function navLabelHits(text: string): number {
  const normalized = normalizeLabel(text);
  let hits = 0;
  for (const label of NAV_LABELS) {
    if (normalized.includes(label)) hits += 1;
  }
  return hits;
}

function isPlausibleNav(node: HTMLElement): boolean {
  if (navLabelHits(node.textContent ?? "") >= 2) return true;
  const itemHits = [...node.querySelectorAll(NAV_ITEM_SELECTOR)].filter((el) =>
    isNavLabel(elementLabel(el)),
  ).length;
  return itemHits >= 2;
}

function isHeaderishHref(el: Element): boolean {
  if (el.tagName !== "A") return false;
  const href = el.getAttribute("href") ?? "";
  const path = href.replace(/^https?:\/\/(www\.)?netflix\.com/, "");
  return (
    path === "/browse" ||
    path.startsWith("/latest") ||
    path.startsWith("/games") ||
    path.includes("/my-list") ||
    path.includes("/browse/genre/") ||
    path.includes("/browse/languages")
  );
}

function findLogo(root: ParentNode): HTMLElement | null {
  const labeled = root.querySelector(
    'a[aria-label="Netflix"], a[aria-label="Netflix Home"]',
  );
  if (isHtmlElement(labeled)) return labeled;

  for (const el of root.querySelectorAll("a")) {
    const href = el.getAttribute("href") ?? "";
    const label = normalizeLabel(el.getAttribute("aria-label"));
    if (label === "netflix" || label === "netflix home") return el;
    if (!LOGO_HREFS.has(href)) continue;
    if (
      el.querySelector("svg, img") ||
      el.closest("header, [class*='header']")
    ) {
      return el;
    }
  }
  return null;
}

function isUtilityControl(el: HTMLElement): boolean {
  const label = elementLabel(el);
  if (
    label === "search" ||
    label.includes("notification") ||
    label === "children" ||
    label.includes("account menu")
  ) {
    return true;
  }
  if (el.getAttribute("data-uia")?.includes("search")) return true;
  return false;
}

function findSearchControl(parent: HTMLElement): HTMLElement | null {
  for (const el of parent.querySelectorAll("button, [role='button']")) {
    if (!isHtmlElement(el)) continue;
    if (
      elementLabel(el) === "search" ||
      normalizeLabel(el.textContent) === "search"
    ) {
      return el;
    }
  }
  for (const child of parent.children) {
    if (isHtmlElement(child) && isUtilityControl(child)) return child;
  }
  return null;
}

function findNavNearLogo(root: ParentNode): HTMLElement | null {
  const logo = findLogo(root);
  if (!logo) return null;

  let last: HTMLElement | null = null;
  let sibling = logo.nextElementSibling;
  while (isHtmlElement(sibling) && !isUtilityControl(sibling)) {
    last = sibling;
    sibling = sibling.nextElementSibling;
  }
  if (last) return last;

  const parent = logo.parentElement;
  if (isHtmlElement(parent)) {
    for (const child of parent.children) {
      if (child === logo || !isHtmlElement(child)) continue;
      if (isPlausibleNav(child)) return child;
    }
  }
  return null;
}

function findNavCluster(start: HTMLElement): HTMLElement {
  const semantic = start.closest("ul, ol, nav, [role='navigation']");
  if (isHtmlElement(semantic) && isPlausibleNav(semantic)) return semantic;

  let node: HTMLElement | null = start.parentElement;
  const root = start.ownerDocument.body;
  while (node && node !== root) {
    const uniqueLabels = new Set(
      [...node.querySelectorAll(NAV_ITEM_SELECTOR)]
        .map((el) => elementLabel(el))
        .filter((text) => NAV_LABELS.has(text)),
    );
    if (uniqueLabels.size >= 3) return node;
    node = node.parentElement;
  }

  return isHtmlElement(start.parentElement) ? start.parentElement : start;
}

export function findNetflixNavigationAnchor(
  doc: Document = document,
  pathname = typeof location === "undefined" ? "/" : location.pathname,
): HTMLElement | null {
  if (!shouldMountOnPath(pathname)) return null;

  const nearLogo = findNavNearLogo(doc);
  if (nearLogo) return nearLogo;

  for (const selector of NAV_SELECTORS) {
    const node = doc.querySelector(selector);
    if (isHtmlElement(node) && isPlausibleNav(node)) return node;
  }

  const firstLabeled = [...doc.querySelectorAll(NAV_ITEM_SELECTOR)].find((el) =>
    isNavLabel(elementLabel(el)),
  );
  if (isHtmlElement(firstLabeled)) {
    const cluster = findNavCluster(firstLabeled);
    if (isPlausibleNav(cluster)) return cluster;
  }

  const firstHref = [...doc.querySelectorAll("a[href]")].find(isHeaderishHref);
  if (isHtmlElement(firstHref)) {
    const cluster = findNavCluster(firstHref);
    if (isPlausibleNav(cluster)) return cluster;
  }

  return null;
}

export function placeCategoriesButton(
  nav: HTMLElement,
  item: HTMLElement,
): void {
  if (nav.tagName === "UL" || nav.tagName === "OL") {
    nav.append(item);
    return;
  }

  const logo = findLogo(nav.ownerDocument);
  let header: HTMLElement | null = logo?.parentElement ?? nav.parentElement;
  while (isHtmlElement(header)) {
    const search = findSearchControl(header);
    if (search) {
      search.before(item);
      return;
    }
    if (header === nav.ownerDocument.body) break;
    header = header.parentElement;
  }

  nav.after(item);
}

export const HEADER_CONTROL_LABEL = "Hidden Categories";
export const HEADER_OVERLAY_TAG = "netflix-categories-menu";
export const HEADER_EXTENSION_MARK = "netflix-categories-chrome";

function headerControlLabel(host: Element): string {
  const button =
    host.shadowRoot?.querySelector("button") ?? host.querySelector("button");
  return button?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export function hasInjectedButton(root: ParentNode = document): boolean {
  return Boolean(root.querySelector("[data-nc-categories-button]"));
}

export function hasCurrentHeaderControl(root: ParentNode = document): boolean {
  const host = root.querySelector("[data-nc-categories-button]");
  if (!isHtmlElement(host)) return false;
  return headerControlLabel(host) === HEADER_CONTROL_LABEL;
}

export function removeInjectedButtons(root: ParentNode = document): void {
  for (const node of root.querySelectorAll("[data-nc-categories-button]")) {
    node.remove();
  }
}

export function removeInjectedHeaderUi(root: ParentNode = document): void {
  removeInjectedButtons(root);
  for (const node of root.querySelectorAll(HEADER_OVERLAY_TAG)) {
    node.remove();
  }
}
