import { Clock, CloseCircle, Edit2, Send2, TickCircle } from "iconsax-react";

export const STATUS_MAP = {
  draft: {
    label: "status.draft",
    color: "info",
    icon: <Send2 size={14} color="currentColor" />,
  },
  submitted: {
    label: "status.submitted",
    color: "notice",
    icon: <Clock size={14} color="currentColor" />,
  },
  revision_requested: {
    label: "status.revision_requested",
    color: "notice",
    icon: <Edit2 size={14} color="currentColor" />,
  },
  approved: {
    label: "status.approved",
    color: "positive",
    icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
  },
  rejected: {
    label: "status.rejected",
    color: "negative",
    icon: <CloseCircle size={14} color="currentColor" />,
  },
} as const;

