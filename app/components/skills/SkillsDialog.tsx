"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SkillsMap = dynamic(() => import("./SkillsMap"), { ssr: false });

export default function SkillsDialog() {
  const dlg = useRef<HTMLDialogElement>(null);
  const returnTarget = useRef<Element | null>(null);
  const returnUrl = useRef<string | null>(null);
  const skipHistory = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState<string | null>(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const dialog = dlg.current;
    if (!dialog) return;

    const show = (name?: string) => {
      if (location.pathname === "/skills/") return;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (!dialog.open) {
        returnTarget.current = document.activeElement;
        returnUrl.current = location.pathname + location.search + (location.hash === "#skills" ? "" : location.hash);
        skipHistory.current = false;
        dialog.showModal();
      }
      if (location.hash !== "#skills") history.pushState(null, "", "#skills");
      setPin(name ?? null);
      setOpen(true);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const target = event.target;
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>("a") : null;
      if (!link) return;
      if (dialog.open && dialog.contains(link) && link.origin === location.origin && (!link.target || link.target === "_self") && !link.hasAttribute("download")) {
        if (link.pathname === location.pathname && link.search === location.search) {
          event.preventDefault();
          history.replaceState(history.state, "", link.pathname + link.search + link.hash);
          skipHistory.current = true;
          dialog.close();
          if (link.hash) {
            const id = decodeURIComponent(link.hash.slice(1));
            requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
          }
        } else {
          if (location.hash === "#skills") history.replaceState(history.state, "", returnUrl.current ?? location.pathname + location.search);
          // Let the link handle its click before reduced-motion cleanup unmounts it.
          queueMicrotask(() => {
            if (dialog.open) {
              skipHistory.current = true;
              dialog.close();
            }
          });
        }
        return;
      }
      if (!link.hasAttribute("data-skills") || location.pathname === "/skills/") return;
      event.preventDefault();
      show(link.dataset.skillsPin);
    };
    const onOpen = (event: Event) => show((event as CustomEvent<{ pin?: string }>).detail?.pin);
    const onPop = () => {
      if (dialog.open && location.hash !== "#skills") {
        skipHistory.current = true;
        dialog.close();
      }
    };
    const onClose = () => {
      if (!skipHistory.current && location.hash === "#skills") history.back();
      skipHistory.current = false;
      const target = returnTarget.current;
      const menu = target?.closest("details");
      const focusTarget = menu && !menu.open ? menu.querySelector("summary") : target;
      if (focusTarget?.isConnected && "focus" in focusTarget) (focusTarget as HTMLElement).focus({ preventScroll: true });
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) setOpen(false);
      else closeTimer.current = setTimeout(() => setOpen(false), 180);
    };

    const onBackdrop = (event: MouseEvent) => { if (event.target === dialog) dialog.close(); };
    dialog.addEventListener("click", onBackdrop);
    document.addEventListener("click", onClick, true);
    window.addEventListener("skills:open", onOpen);
    window.addEventListener("popstate", onPop);
    dialog.addEventListener("close", onClose);
    if (location.hash === "#skills") show();
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("skills:open", onOpen);
      window.removeEventListener("popstate", onPop);
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("click", onBackdrop);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (previousPathname.current !== pathname && dlg.current?.open) {
      skipHistory.current = true;
      dlg.current.close();
    }
    previousPathname.current = pathname;
  }, [pathname]);

  return (
    <dialog
      className="skills-dialog"
      ref={dlg}
      aria-labelledby="skills-dialog-h"
      aria-label="Pin map"
    >
      <div className="skills-dialog-in" role="presentation" onKeyDown={(event) => event.stopPropagation()}>
        <button type="button" className="skills-close" onClick={() => dlg.current?.close()} aria-label="Close">Close ✕</button>
        {open && <SkillsMap key={pin ?? ""} heading="h2" initialPin={pin} />}
      </div>
    </dialog>
  );
}
