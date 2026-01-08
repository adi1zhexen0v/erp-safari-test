import type { GPHPayment } from "../types";

export interface AggregatedTotals {
  gross: string;
  deductions: string;
  net: string;
  employerCost: string;
}

export function aggregatePayrollTotals(
  payrollGross: string,
  payrollDeductions: string,
  payrollNet: string,
  payrollEmployerCost: string,
  gphPayments: GPHPayment[] = [],
): AggregatedTotals {
  const payrollGrossNum = parseFloat(payrollGross) || 0;
  const payrollDeductionsNum = parseFloat(payrollDeductions) || 0;
  const payrollNetNum = parseFloat(payrollNet) || 0;
  const payrollEmployerCostNum = parseFloat(payrollEmployerCost) || 0;

  const gphGross = gphPayments.reduce((sum, payment) => sum + (parseFloat(payment.gross_amount) || 0), 0);
  const gphDeductions = gphPayments.reduce((sum, payment) => sum + (parseFloat(payment.total_withheld) || 0), 0);
  const gphNet = gphPayments.reduce((sum, payment) => sum + (parseFloat(payment.net_amount) || 0), 0);
  const gphEmployerCost = gphPayments.reduce((sum, payment) => sum + (parseFloat(payment.total_cost) || 0), 0);

  return {
    gross: (payrollGrossNum + gphGross).toFixed(2),
    deductions: (payrollDeductionsNum + gphDeductions).toFixed(2),
    net: (payrollNetNum + gphNet).toFixed(2),
    employerCost: (payrollEmployerCostNum + gphEmployerCost).toFixed(2),
  };
}

export interface GPHTotals {
  opv: number;
  vosms: number;
  ipn: number;
  so: number;
  net: number;
  totalWithheld: number;
}

export function aggregateGPHTotals(gphPayments: GPHPayment[] = []): GPHTotals {
  const gphOpv = gphPayments.reduce((sum, p) => sum + (parseFloat(p.opv) || 0), 0);
  const gphVosms = gphPayments.reduce((sum, p) => sum + (parseFloat(p.vosms) || 0), 0);
  const gphIpn = gphPayments.reduce((sum, p) => sum + (parseFloat(p.ipn) || 0), 0);
  const gphSo = gphPayments.reduce((sum, p) => sum + (parseFloat(p.so) || 0), 0);
  const gphNet = gphPayments.reduce((sum, p) => sum + (parseFloat(p.net_amount) || 0), 0);
  const gphTotalWithheld = gphPayments.reduce((sum, p) => sum + (parseFloat(p.total_withheld) || 0), 0);

  return {
    opv: gphOpv,
    vosms: gphVosms,
    ipn: gphIpn,
    so: gphSo,
    net: gphNet,
    totalWithheld: gphTotalWithheld,
  };
}

