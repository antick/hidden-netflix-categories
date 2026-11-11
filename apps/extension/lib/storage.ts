import { sanitizePreferences } from "./preference-sanitization";
import { migratePreferences, PREFERENCES_KEY } from "./preferences";
import type { ExtensionPreferences } from "./types";

async function readPreferences(): Promise<ExtensionPreferences> {
  const stored = await browser.storage.local.get(PREFERENCES_KEY);
  return migratePreferences(stored[PREFERENCES_KEY]);
}

export async function loadPreferences(): Promise<ExtensionPreferences> {
  // Cleanup shares the edit lock so it cannot overwrite a newer user change.
  return navigator.locks.request(PREFERENCES_KEY, async () => {
    const current = await readPreferences();
    const cleaned = sanitizePreferences(current);
    if (JSON.stringify(current) !== JSON.stringify(cleaned)) {
      await savePreferences(cleaned);
    }
    return cleaned;
  });
}

export async function savePreferences(
  prefs: ExtensionPreferences,
): Promise<void> {
  try {
    await browser.storage.local.set({
      [PREFERENCES_KEY]: sanitizePreferences(prefs),
    });
  } catch (error) {
    console.error("Failed to save preferences", error);
    throw error;
  }
}

export async function updatePreferences(
  mutator: (current: ExtensionPreferences) => ExtensionPreferences,
): Promise<ExtensionPreferences> {
  // Popup and Options share an extension origin, so this lock prevents lost edits.
  return navigator.locks.request(PREFERENCES_KEY, async () => {
    const current = sanitizePreferences(await readPreferences());
    const next = sanitizePreferences(mutator(current));
    await savePreferences(next);
    return next;
  });
}

export function subscribeToPreferences(
  listener: (prefs: ExtensionPreferences) => void,
): () => void {
  if (typeof browser === "undefined" || !browser.storage?.onChanged) {
    return () => undefined;
  }
  const onChange: Parameters<
    typeof browser.storage.onChanged.addListener
  >[0] = (changes, area) => {
    if (area !== "local" || !changes[PREFERENCES_KEY]) return;
    listener(sanitizePreferences(changes[PREFERENCES_KEY].newValue));
  };
  browser.storage.onChanged.addListener(onChange);
  return () => browser.storage.onChanged.removeListener(onChange);
}
