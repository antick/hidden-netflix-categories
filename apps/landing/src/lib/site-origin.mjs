export const siteOrigin = (
  process.env.SITE_URL ?? "http://127.0.0.1:4321"
).replace(/\/$/, "");
