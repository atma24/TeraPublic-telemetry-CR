"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, MessageSquareReply } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, selectClass, textareaClass } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { respondFeedbackAction } from "@/lib/actions/admin";
import { FEEDBACK_STATUS } from "@/lib/constants";
import type { AdminActionResult } from "@/types/actions";
import type { CitizenFeedback } from "@/types/public";

const initialResult: AdminActionResult = { ok: false };
const responseStatuses = ["verified", "in_review", "resolved", "rejected"] as const;

export function FeedbackRespondButton({ feedback }: { feedback: CitizenFeedback }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-[11px] font-semibold text-text transition-colors hover:border-interactive/45 hover:bg-surface-2"
      >
        <MessageSquareReply className="size-3.5" aria-hidden="true" />
        {feedback.status === "resolved" ? "Perbarui tanggapan" : "Tindak lanjuti"}
      </button>
      {open ? (
        <RespondDialog
          feedback={feedback}
          onClose={() => setOpen(false)}
          onSaved={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

function RespondDialog({
  feedback,
  onClose,
  onSaved,
}: {
  feedback: CitizenFeedback;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, formAction, pending] = useActionState(respondFeedbackAction, initialResult);
  const handled = useRef<AdminActionResult | null>(null);

  useEffect(() => {
    if (!state.ok || handled.current === state) return;
    handled.current = state;
    showToast({ tone: "success", title: "Tanggapan tersimpan", description: state.message });
    onSaved();
    router.refresh();
  }, [state, onSaved, showToast, router]);

  const defaultStatus = responseStatuses.includes(
    feedback.status as (typeof responseStatuses)[number],
  )
    ? (feedback.status as (typeof responseStatuses)[number])
    : "verified";
  const fieldErrors = state.fieldErrors ?? {};

  return (
    <Modal
      open
      onClose={() => {
        if (!pending) onClose();
      }}
      title="Tindak lanjut aduan"
      description={`${feedback.tracking_code} · ${feedback.title}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={pending}>
            Batal
          </Button>
          <Button type="submit" form="feedback-respond-form" size="sm" disabled={pending}>
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : null}
            Simpan tanggapan
          </Button>
        </>
      }
    >
      <form id="feedback-respond-form" action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={feedback.id} />

        {state.message && !state.ok ? (
          <div className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger/5 px-3 py-2.5">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-danger" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-danger">{state.message}</p>
          </div>
        ) : null}

        <div className="rounded-md border border-border bg-surface-2/60 px-3.5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Laporan warga</p>
          <p className="mt-1 text-xs leading-relaxed text-text">{feedback.description}</p>
          <p className="mt-2 text-[10px] text-muted">
            Pelapor: {feedback.citizen_name}
            {feedback.citizen_email ? ` · ${feedback.citizen_email}` : ""}
          </p>
        </div>

        <Field label="Status penanganan" htmlFor="feedback-status" required error={fieldErrors.status}>
          <select
            id="feedback-status"
            name="status"
            required
            defaultValue={defaultStatus}
            className={selectClass}
          >
            {responseStatuses.map((status) => (
              <option key={status} value={status}>
                {FEEDBACK_STATUS[status].label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Tanggapan admin"
          htmlFor="feedback-response"
          required
          error={fieldErrors.admin_response}
          hint="Tanggapan ini akan terlihat oleh pelapor melalui kode pelacakan."
        >
          <textarea
            id="feedback-response"
            name="admin_response"
            required
            defaultValue={feedback.admin_response ?? ""}
            className={textareaClass}
            rows={5}
            placeholder="Jelaskan verifikasi, tindakan, atau alasan penolakan."
          />
        </Field>

        <p className="rounded-md border border-border bg-surface px-3 py-2 text-[10px] leading-relaxed text-muted">
          Menandai selesai akan mengisi waktu penyelesaian. Pastikan tindakan sudah dilakukan sebelum memilih status
          selesai.
        </p>
      </form>
    </Modal>
  );
}
