import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
import { NETFLIX_HOST_PERMISSION } from "./lib/permissions";
import { EXTENSION_NAME, PAGE_INTEGRATION_ENABLED } from "./lib/release";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  filterEntrypoints: PAGE_INTEGRATION_ENABLED
    ? undefined
    : ["popup", "options"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: EXTENSION_NAME,
    description:
      "Unofficial, open-source Chrome extension for browsing Netflix's hidden categories and secret genre codes.",
    permissions: ["storage"],
    ...(PAGE_INTEGRATION_ENABLED
      ? {
          optional_permissions: ["scripting"],
          optional_host_permissions: [NETFLIX_HOST_PERMISSION],
        }
      : {}),
    action: {
      default_title: "Netflix Categories",
    },
    icons: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png",
    },
  },
  hooks: {
    "build:manifestGenerated": (_wxt, manifest) => {
      const optionalHosts = new Set(manifest.optional_host_permissions ?? []);
      if (manifest.host_permissions) {
        manifest.host_permissions = manifest.host_permissions.filter(
          (host: string) => {
            if (host.includes("netflix.com")) {
              optionalHosts.add(host);
              return false;
            }
            return true;
          },
        );
        if (manifest.host_permissions.length === 0) {
          delete manifest.host_permissions;
        }
      }
      if (PAGE_INTEGRATION_ENABLED) {
        manifest.optional_host_permissions = [...optionalHosts];
      } else {
        delete manifest.optional_host_permissions;
        delete manifest.optional_permissions;
        delete manifest.host_permissions;
        delete manifest.content_scripts;
        delete manifest.web_accessible_resources;
        delete manifest.background;
      }
      if (manifest.options_ui) {
        manifest.options_ui.open_in_tab = true;
      }
    },
  },
});
