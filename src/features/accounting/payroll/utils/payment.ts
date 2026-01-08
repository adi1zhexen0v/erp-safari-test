export interface PaymentDestination {
  employees: number;
  enpf: number;
  medical: number;
  tax: number;
  social: number;
}

export function calculatePaymentDestinations(payroll: {
  total_net_salary: string;
  total_opv: string;
  total_opvr: string;
  total_vosms: string;
  total_oosms: string;
  total_ipn: string;
  total_sn: string;
  total_so: string;
}): PaymentDestination {
  const opv = parseFloat(payroll.total_opv) || 0;
  const opvr = parseFloat(payroll.total_opvr) || 0;
  const vosms = parseFloat(payroll.total_vosms) || 0;
  const oosms = parseFloat(payroll.total_oosms) || 0;
  const ipn = parseFloat(payroll.total_ipn) || 0;
  const sn = parseFloat(payroll.total_sn) || 0;
  const so = parseFloat(payroll.total_so) || 0;
  const net = parseFloat(payroll.total_net_salary) || 0;

  return {
    employees: net,
    enpf: opv + opvr,
    medical: vosms + oosms,
    tax: ipn + sn,
    social: so,
  };
}

