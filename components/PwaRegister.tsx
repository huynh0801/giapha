"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.debug("PWA Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.debug("PWA Service Worker registration error:", err);
        });
    }
  }, []);

  return null;
}
