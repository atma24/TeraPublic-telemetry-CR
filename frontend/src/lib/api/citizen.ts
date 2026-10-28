import "server-only";

import { apiRequest } from "./client";
import type { AssistantResponse } from "@/types/ml";
import type {
  CitizenFeedback,
  FeedbackCreateResponse,
  PublicFacility,
} from "@/types/public";

export interface FeedbackPayload {
  facility_id?: number | null;
  citizen_name?: string;
  citizen_email?: string;
  title: string;
  description: string;
  category: CitizenFeedback["category"];
  photo_url?: string;
  latitude?: number;
  longitude?: number;
}

export function createFeedback(token: string, payload: FeedbackPayload) {
  return apiRequest<FeedbackCreateResponse>("/feedback", {
    method: "POST",
    token,
    body: payload,
    cache: "no-store",
  });
}

export function askAssistant(token: string, message: string) {
  return apiRequest<AssistantResponse>("/assistant/chat", {
    method: "POST",
    token,
    body: { message },
    cache: "no-store",
  });
}

export function getFacilitiesForPicker(token: string) {
  return apiRequest<{ status: string; data: PublicFacility[] }>("/facilities?per_page=100", {
    token,
    cache: "no-store",
  });
}
