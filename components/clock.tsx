"use client";

import { useSyncExternalStore } from "react";

function now() {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());
  } catch {
    return "";
  }
}

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15000);
  return () => clearInterval(id);
};

export function Clock() {
  return <span>{useSyncExternalStore(subscribe, now, () => "--:--")}</span>;
}
