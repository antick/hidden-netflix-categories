import {
  CONTENT_SCRIPT_ID,
  NETFLIX_HOST_PERMISSION,
  registerNetflixContentScript,
  unregisterNetflixContentScript,
} from "../lib/permissions";

async function syncRegistration() {
  const allowed = await browser.permissions.contains({
    permissions: ["scripting"],
    origins: [NETFLIX_HOST_PERMISSION],
  });
  if (allowed) {
    await registerNetflixContentScript();
  } else {
    await unregisterNetflixContentScript();
  }
}

export default defineBackground(() => {
  void syncRegistration();
  browser.runtime.onInstalled.addListener(() => {
    void syncRegistration();
  });
  browser.runtime.onStartup.addListener(() => {
    void syncRegistration();
  });
  browser.permissions.onAdded.addListener(() => {
    void syncRegistration();
  });
  browser.permissions.onRemoved.addListener(() => {
    void syncRegistration();
  });
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.preferences) void syncRegistration();
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === "nc:get-script-id")
      return Promise.resolve(CONTENT_SCRIPT_ID);
    return undefined;
  });
});
