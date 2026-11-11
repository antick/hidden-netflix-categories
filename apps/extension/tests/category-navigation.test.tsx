import { expect, test } from "bun:test";
import { parseHTML } from "linkedom";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { CategoryBrowser } from "../components/CategoryBrowser";
import { DEFAULT_PREFERENCES } from "../lib/preferences";

const noop = () => {};

test("category selection is saved before navigation can close the popup", async () => {
  const { window, document } = parseHTML(
    "<html><body><div id='root'></div></body></html>",
  );
  const navigations: unknown[] = [];
  const globals = {
    window,
    document,
    IS_REACT_ACT_ENVIRONMENT: true,
    browser: {
      tabs: {
        query: async () => [{ id: 7 }],
        update: async (...args: unknown[]) => {
          navigations.push(args);
        },
      },
    },
  };
  const originals = new Map(
    Object.keys(globals).map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
  const root = createRoot(document.getElementById("root")!);
  let finishSave!: () => void;
  let selections = 0;
  const saved = new Promise<void>((resolve) => {
    finishSave = resolve;
  });
  try {
    await act(async () => {
      root.render(
        <CategoryBrowser
          prefs={DEFAULT_PREFERENCES}
          onFavorite={noop}
          onHide={noop}
          onUnhide={noop}
          onRestoreHidden={noop}
          onUnmarkEmpty={noop}
          onClearEmpty={noop}
          onClearRecent={noop}
          onOpened={async () => {
            selections++;
            await saved;
          }}
        />,
      );
    });
    const button = document.querySelector<HTMLButtonElement>(
      'button[aria-label$="in this tab"]',
    );
    expect(button).not.toBeNull();
    await act(async () => {
      button!.click();
    });
    expect(selections).toBe(1);
    expect(navigations).toEqual([]);
    await act(async () => {
      finishSave();
      await saved;
    });
    expect(navigations).toHaveLength(1);
  } finally {
    finishSave();
    await act(async () => {
      root.unmount();
    });
    for (const [key, original] of originals) {
      if (original) Object.defineProperty(globalThis, key, original);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
