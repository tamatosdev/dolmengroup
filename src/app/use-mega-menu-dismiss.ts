"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

type UseMegaMenuDismissOptions = {
  isOpen: boolean;
  isClosing: boolean;
  panelId: string;
  triggerSelector: string;
  onDismiss: (restoreMobileNav?: boolean) => void;
};

function shouldRestoreMobileNav() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

export function useMegaMenuDismiss({
  isOpen,
  isClosing,
  panelId,
  triggerSelector,
  onDismiss,
}: UseMegaMenuDismissOptions) {
  const onDismissRef = useRef(onDismiss);
  const lastScrollRef = useRef<number | null>(null);
  onDismissRef.current = onDismiss;

  useLenis((lenis) => {
    if (!isOpen || isClosing) {
      lastScrollRef.current = lenis.scroll;
      return;
    }

    if (lastScrollRef.current === null) {
      lastScrollRef.current = lenis.scroll;
      return;
    }

    if (Math.abs(lenis.scroll - lastScrollRef.current) < 2) {
      return;
    }

    lastScrollRef.current = lenis.scroll;
    onDismissRef.current(shouldRestoreMobileNav());
  });

  useEffect(() => {
    if (!isOpen || isClosing) {
      lastScrollRef.current = null;
      return;
    }

    const isInsideMenu = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        return false;
      }

      if (target.closest(`#${panelId}`)) {
        return true;
      }

      if (target.closest(triggerSelector)) {
        return true;
      }

      return false;
    };

    const dismiss = () => {
      onDismissRef.current(shouldRestoreMobileNav());
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (isInsideMenu(event.target)) {
        return;
      }
      dismiss();
    };

    const handleWheel = (event: WheelEvent) => {
      if (isInsideMenu(event.target)) {
        return;
      }
      dismiss();
    };

    // Defer binding so the opening click doesn't immediately close the menu.
    const bindTimer = window.setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("wheel", handleWheel, { passive: true });
    }, 0);

    return () => {
      window.clearTimeout(bindTimer);
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, isClosing, panelId, triggerSelector]);
}
