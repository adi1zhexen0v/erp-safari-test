import type { PayrollStatus } from "../types";

export function canEditPayroll(status: PayrollStatus): boolean {
  return status === "draft" || status === "calculated";
}

export function canApprovePayroll(status: PayrollStatus): boolean {
  return status === "calculated";
}

export function canMarkPayrollPaid(status: PayrollStatus): boolean {
  return status === "approved";
}

export function getPayrollAvailableActions(status: PayrollStatus): string[] {
  switch (status) {
    case "draft":
      return ["open", "delete", "recalculate"];
    case "calculated":
      return ["open", "approve", "delete", "recalculate"];
    case "approved":
      return ["open", "markPaid"];
    case "paid":
      return ["open"];
    default:
      return ["open"];
  }
}

