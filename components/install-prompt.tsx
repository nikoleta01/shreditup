"use client";

import { useState, useEffect } from "react";
import { X, Share, Plus, MoreHorizontal } from "lucide-react";
import { useLang } from "@/components/language-provider";

type InstallState = "hidden" | "android" | "ios-safari" | "ios-chrome";

export function InstallPrompt() {
  const { t } = useLang();
  const [state, setState] = useState<InstallState>("hidden");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem("install-dismissed")) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const isChrome = /CriOS/.test(navigator.userAgent);
      setState(isChrome ? "ios-chrome" : "ios-safari");
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setState("android");
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener,
      );
  }, []);

  function dismiss() {
    sessionStorage.setItem("install-dismissed", "1");
    setState("hidden");
  }

  async function installAndroid() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setState("hidden");
    setDeferredPrompt(null);
  }

  const isIOS = state === "ios-safari" || state === "ios-chrome";

  if (state === "hidden") return null;

  return (
    <div className="flex items-start gap-3 border-y-2 border-foreground bg-primary p-3 mt-3">
      <div className="flex-1 space-y-1.5">
        <p
          className="text-sm font-bold text-primary-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {t.install.title}
        </p>

        {state === "android" ? (
          <>
            <p className="text-xs text-primary-foreground/70">
              {t.install.desc}
            </p>
            <button
              onClick={installAndroid}
              className="mt-1 flex items-center gap-1.5 rounded-sm border-2 border-primary-foreground bg-primary-foreground px-3 py-1.5 text-xs font-bold text-primary transition-opacity hover:opacity-80"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {t.install.button}
            </button>
          </>
        ) : isIOS ? (
          <>
            <p className="text-xs text-primary-foreground/70">
              {t.install.desc}
            </p>
            <p className="text-xs text-primary-foreground/70">
              {state === "ios-safari" ? (
                <>
                  {t.install.iosHint}{" "}
                  <Share
                    className="inline h-3.5 w-3.5 align-text-bottom"
                    aria-hidden
                  />{" "}
                  {t.install.iosThen}
                </>
              ) : (
                <>
                  {t.install.iosChromeHint}{" "}
                  <MoreHorizontal
                    className="inline h-3.5 w-3.5 align-text-bottom"
                    aria-hidden
                  />{" "}
                  {t.install.iosChromeThen}
                </>
              )}
            </p>
          </>
        ) : null}
      </div>

      <button
        onClick={dismiss}
        className="shrink-0 rounded p-1 text-primary-foreground/60 hover:text-primary-foreground"
        aria-label={t.install.close}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
