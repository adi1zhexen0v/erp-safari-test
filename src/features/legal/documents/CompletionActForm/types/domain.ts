export type CompletionActStatus = "draft" | "pending_review" | "approved" | "rejected";

export type CompletionActAction =
  | "edit"
  | "upload_document"
  | "submit"
  | "approve"
  | "reject"
  | "view_document"
  | "delete";

export const COMPLETION_ACT_STATUS_MAP: Record<CompletionActStatus, { ru: string; kk: string }> = {
  draft: { ru: "Черновик", kk: "Жоба" },
  pending_review: { ru: "На рассмотрении", kk: "Қарастыруда" },
  approved: { ru: "Утвержден", kk: "Бекітілген" },
  rejected: { ru: "Отклонен", kk: "Қабылданбады" },
};

