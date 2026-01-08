import { Clock, TickCircle, Math } from "iconsax-react";
import { Badge } from "@/shared/ui";
import type { PayrollStatus } from "../../../types";

interface Props {
  status: PayrollStatus;
  t: (key: string) => string;
}

export default function StatusBadge({ status, t }: Props) {
  const config: Record<PayrollStatus, { color: "info" | "notice" | "positive" | "gray"; icon: React.ReactNode }> = {
    draft: { color: "info", icon: <Clock size={16} color="currentColor" /> },
    calculated: { color: "notice", icon: <Math size={16} color="currentColor" /> },
    approved: { color: "positive", icon: <TickCircle size={16} color="currentColor" /> },
    paid: { color: "positive", icon: <TickCircle size={16} color="currentColor" variant="Bold" /> },
  };

  const { color, icon } = config[status] || config.draft;

  return <Badge variant="soft" color={color} text={t(`status.${status}`)} icon={icon} />;
}

