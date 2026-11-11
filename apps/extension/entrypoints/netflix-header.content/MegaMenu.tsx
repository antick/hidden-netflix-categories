import { useEffect, useRef } from "react";
import { CategoryBrowser } from "../../components/CategoryBrowser";
import type { ExtensionPreferences } from "../../lib/types";

interface MegaMenuProps {
  prefs: ExtensionPreferences;
  open: boolean;
  onClose: () => void;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
  onUnhide: (id: string) => void;
  onRestoreHidden: () => void;
  onUnmarkEmpty: (id: string) => void;
  onClearEmpty: () => void;
  onClearRecent: () => void;
  onOpened: (id: string) => Promise<unknown>;
}

export function MegaMenu({
  prefs,
  open,
  onClose,
  onFavorite,
  onHide,
  onUnhide,
  onRestoreHidden,
  onUnmarkEmpty,
  onClearEmpty,
  onClearRecent,
  onOpened,
}: MegaMenuProps) {
  const panelRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onClick = (event: MouseEvent) => {
      const path = event.composedPath();
      if (path.includes(panelRef.current as EventTarget)) return;
      if (
        (event.target as HTMLElement | null)?.closest?.(
          "[data-nc-categories-button]",
        )
      )
        return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <dialog
      open
      className="nc-mega"
      data-theme={prefs.theme}
      ref={panelRef}
      aria-label="Hidden categories"
    >
      <div className="nc-body">
        <CategoryBrowser
          prefs={prefs}
          compact
          onFavorite={onFavorite}
          onHide={onHide}
          onUnhide={onUnhide}
          onRestoreHidden={onRestoreHidden}
          onUnmarkEmpty={onUnmarkEmpty}
          onClearEmpty={onClearEmpty}
          onClearRecent={onClearRecent}
          onOpened={async (id) => {
            await onOpened(id);
            onClose();
          }}
        />
      </div>
    </dialog>
  );
}
