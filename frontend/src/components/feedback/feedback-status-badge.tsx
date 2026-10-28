import { Badge, type BadgeTone } from "@/components/ui/badge";
import { FEEDBACK_STATUS } from "@/lib/constants";
import type { CitizenFeedback } from "@/types/public";

const toneMap: Record<CitizenFeedback["status"], BadgeTone> = {
  submitted: "neutral",
  verified: "info",
  in_review: "warning",
  resolved: "success",
  rejected: "danger",
};

export function FeedbackStatusBadge({ status }: { status: CitizenFeedback["status"] }) {
  return <Badge tone={toneMap[status]}>{FEEDBACK_STATUS[status]?.label ?? status}</Badge>;
}
