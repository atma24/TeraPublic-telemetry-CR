export interface FeedbackActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  trackingCode?: string;
  feedbackId?: number;
}

export interface AdminActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  entityId?: number;
}

export interface AssistantActionResult {
  ok: boolean;
  message?: string;
  answer?: string;
  citations?: string[];
  matchedRegion?: string | null;
  source?: string;
}
