export interface PaginationMeta {
  current_page: number;
  last_page?: number;
  per_page?: number;
  total: number;
}

export interface ApiErrorPayload {
  status?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

export type SearchParams = Record<string, string | string[] | undefined>;
