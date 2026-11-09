"use client";

import { useSyncExternalStore, useState, useTransition } from "react";
import { Check, ThumbsUp, Users } from "lucide-react";

import { confirmFeedbackAction } from "@/lib/actions/citizen";
import type { CitizenFeedback } from "@/types/public";
import { FeedbackCard } from "./feedback-card";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredStatus(feedbackId: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("tp_confirmed_feedbacks");
    if (!raw) return false;
    const ids: number[] = JSON.parse(raw);
    return ids.includes(feedbackId);
  } catch {
    return false;
  }
}

export function PublicFeedbackCard({ feedback }: { feedback: CitizenFeedback }) {
  const isStored = useSyncExternalStore(
    subscribe,
    () => getStoredStatus(feedback.id),
    () => false,
  );

  const [hasConfirmedLocally, setHasConfirmedLocally] = useState(false);
  const [count, setCount] = useState(feedback.confirmations_count ?? 0);
  const [isPending, startTransition] = useTransition();

  const isConfirmed = isStored || hasConfirmedLocally;

  function handleConfirm() {
    if (isConfirmed || isPending) return;

    // Optimistic UI state
    setHasConfirmedLocally(true);
    setCount((prev) => prev + 1);

    try {
      const stored = localStorage.getItem("tp_confirmed_feedbacks");
      const ids: number[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(feedback.id)) {
        ids.push(feedback.id);
        localStorage.setItem("tp_confirmed_feedbacks", JSON.stringify(ids));
        window.dispatchEvent(new Event("storage"));
      }
    } catch {
      // Local storage unavailable
    }

    startTransition(async () => {
      const res = await confirmFeedbackAction(feedback.id);
      if (res.ok && typeof res.count === "number") {
        setCount(res.count);
      } else {
        // Rollback on server failure
        setHasConfirmedLocally(false);
        setCount((prev) => Math.max(0, prev - 1));
        try {
          const stored = localStorage.getItem("tp_confirmed_feedbacks");
          if (stored) {
            const ids: number[] = JSON.parse(stored).filter((i: number) => i !== feedback.id);
            localStorage.setItem("tp_confirmed_feedbacks", JSON.stringify(ids));
            window.dispatchEvent(new Event("storage"));
          }
        } catch {
          // Local storage unavailable
        }
      }
    });
  }

  return (
    <FeedbackCard
      feedback={feedback}
      showCitizen={false}
      actions={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Users className="size-3.5 text-interactive" aria-hidden="true" />
            <span>
              <strong className="text-text font-semibold">{count}</strong> warga mengonfirmasi masalah ini
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmed || isPending}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isConfirmed
                ? "bg-success/10 text-success border border-success/30 cursor-default"
                : "bg-surface-2 border border-border text-text hover:border-interactive hover:text-interactive hover:bg-interactive/5 shadow-2xs cursor-pointer"
            }`}
          >
            {isConfirmed ? (
              <>
                <Check className="size-3.5 text-success" aria-hidden="true" />
                Telah Dikonfirmasi
              </>
            ) : (
              <>
                <ThumbsUp className="size-3.5 text-interactive" aria-hidden="true" />
                Konfirmasi Kondisi Lapangan
              </>
            )}
          </button>
        </div>
      }
    />
  );
}
