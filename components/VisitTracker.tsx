"use client";

import { recordSiteVisit } from "@/app/actions/analytics";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function getVisitorId() {
  const key = "gpd_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(key, id);
  return id;
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const timeoutId = window.setTimeout(() => {
      const formData = new FormData();
      formData.set("visitor_id", getVisitorId());
      formData.set("path", pathname);
      formData.set("referrer", document.referrer || "");
      formData.set("user_agent", navigator.userAgent || "");

      recordSiteVisit(formData).catch(() => {
        // Analytics should never block the visitor experience.
      });
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
