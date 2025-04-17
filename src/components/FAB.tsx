"use client";
import { recordSmokingEvent } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FAB() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setPending(true);
    try {
      await recordSmokingEvent();         // will be queued by SW offline
      router.refresh();                   // re‑fetch server props
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="fixed bottom-6 right-6 rounded-full bg-green-600 p-4 text-white shadow-lg active:scale-95 sm:bottom-8 sm:right-8"
      aria-label="I just smoked"
    >
      🚬
    </button>
  );
}
