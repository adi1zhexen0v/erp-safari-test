import { type ComponentType, lazy, type LazyExoticComponent } from "react";
import {
  HR_APPLY_PAGE_ROUTE,
  HR_CONTRACTS_PAGE_ROUTE,
  HR_EMPLOYEES_PAGE_ROUTE,
  HR_HIRING_PAGE_ROUTE,
  HR_LEAVES_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  HR_FILL_CONTRACT_PAGE_ROUTE,
  LEGAL_CONSULTATION_PAGE_ROUTE,
  LEGAL_TEMPLATES_PAGE_ROUTE,
  LEGAL_CASES_PAGE_ROUTE,
  LEGAL_APPLICATIONS_PAGE_ROUTE,
  ACCOUNTING_TIMESHEETS_PAGE_ROUTE,
  ACCOUNTING_TIMESHEET_DETAIL_PAGE_ROUTE,
  ACCOUNTING_PAYROLLS_PAGE_ROUTE,
  ACCOUNTING_PAYROLL_DETAIL_PAGE_ROUTE,
} from "@/shared/utils";

export interface AppRoute {
  path: string;
  element: LazyExoticComponent<ComponentType>;
  public?: boolean;
}

const LoginPage = lazy(() => import("@/features/auth").then((m) => ({ default: m.LoginPage })));
const EmployeesPage = lazy(() => import("@/features/hr/employees").then((m) => ({ default: m.EmployeesPage })));
const HiringPage = lazy(() => import("@/features/hr/hiring").then((m) => ({ default: m.HiringPage })));
const ApplyApplicationPage = lazy(() =>
  import("@/features/hr/hiring").then((m) => ({ default: m.ApplyApplicationPage })),
);
const ContractsListPage = lazy(() =>
  import("@/features/hr/contracts/").then((m) => ({ default: m.ContractsListPage })),
);
const FillContractPage = lazy(() => import("@/features/hr/contracts/").then((m) => ({ default: m.FillContractPage })));
const LeaveApplicationsPage = lazy(() =>
  import("@/features/hr/leave-applications").then((m) => ({ default: m.LeaveApplicationsPage })),
);
const LegalConsultationsPage = lazy(() =>
  import("@/features/legal").then((m) => ({ default: m.LegalConsultationsPage })),
);
const LegalTemplatesPage = lazy(() => import("@/features/legal").then((m) => ({ default: m.LegalTemplatesPage })));
const LegalCasesPage = lazy(() => import("@/features/legal").then((m) => ({ default: m.LegalCasesPage })));
const LegalApplicationsPage = lazy(() =>
  import("@/features/legal").then((m) => ({ default: m.LegalApplicationsPage })),
);
const TimesheetsPage = lazy(() =>
  import("@/features/accounting/timesheets").then((m) => ({ default: m.TimesheetsPage })),
);
const TimesheetDetailPage = lazy(() =>
  import("@/features/accounting/timesheets").then((m) => ({ default: m.TimesheetDetailPage })),
);
const PayrollsPage = lazy(() => import("@/features/accounting/payroll").then((m) => ({ default: m.PayrollsPage })));
const PayrollDetailPage = lazy(() =>
  import("@/features/accounting/payroll").then((m) => ({ default: m.PayrollDetailPage })),
);

export const publicRoutes: AppRoute[] = [
  {
    path: LOGIN_PAGE_ROUTE,
    element: LoginPage,
    public: true,
  },
  {
    path: HR_APPLY_PAGE_ROUTE,
    element: ApplyApplicationPage,
    public: true,
  },
];

export const privateRoutes: AppRoute[] = [
  {
    path: HR_EMPLOYEES_PAGE_ROUTE,
    element: EmployeesPage,
  },
  {
    path: HR_HIRING_PAGE_ROUTE,
    element: HiringPage,
  },
  {
    path: HR_CONTRACTS_PAGE_ROUTE,
    element: ContractsListPage,
  },
  {
    path: HR_LEAVES_PAGE_ROUTE,
    element: LeaveApplicationsPage,
  },
  {
    path: HR_FILL_CONTRACT_PAGE_ROUTE,
    element: FillContractPage,
  },
  {
    path: LEGAL_CONSULTATION_PAGE_ROUTE,
    element: LegalConsultationsPage,
  },
  {
    path: LEGAL_TEMPLATES_PAGE_ROUTE,
    element: LegalTemplatesPage,
  },
  {
    path: LEGAL_CASES_PAGE_ROUTE,
    element: LegalCasesPage,
  },
  {
    path: LEGAL_APPLICATIONS_PAGE_ROUTE,
    element: LegalApplicationsPage,
  },
  {
    path: ACCOUNTING_TIMESHEETS_PAGE_ROUTE,
    element: TimesheetsPage,
  },
  {
    path: ACCOUNTING_TIMESHEET_DETAIL_PAGE_ROUTE,
    element: TimesheetDetailPage,
  },
  {
    path: ACCOUNTING_PAYROLLS_PAGE_ROUTE,
    element: PayrollsPage,
  },
  {
    path: ACCOUNTING_PAYROLL_DETAIL_PAGE_ROUTE,
    element: PayrollDetailPage,
  },
];
