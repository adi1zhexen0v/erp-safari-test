import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Checkbox, Table, type CheckboxState } from "@/shared/ui";
import { formatDateForDisplay, type Locale } from "@/shared/utils";
import {
  type GetApplicationsResponse,
  type SortConfig,
  STATUS_MAP,
  type UseHiringActionsReturn,
  type UseHiringModalsReturn,
  type UseHiringMutationsReturn,
} from "@/features/hr/hiring";
import ApplicationActionsDropdown from "./ApplicationActionsDropdown";
import ShowApplicationModalWindow from "./ShowApplicationModalWindow";

interface Props {
  applications: GetApplicationsResponse[];
  rowStates: Record<string, CheckboxState>;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  onToggleRow: (id: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortConfig["key"]) => void;
  locale: Locale;
  onDownloadProfile: (id: number) => void;
  isDownloading: boolean;
  actions: UseHiringActionsReturn;
  modals: UseHiringModalsReturn;
  mutations: UseHiringMutationsReturn;
}

export default function HiringTableView({
  applications,
  rowStates,
  headerState,
  onToggleHeader,
  onToggleRow,
  sortConfig,
  onSort,
  onDownloadProfile,
  isDownloading,
  actions,
  modals,
  mutations,
}: Props) {
  const { t } = useTranslation("HiringPage");
  const [showApplicationModal, setShowApplicationModal] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const selectedApplication = applications.find((app) => app.id === showApplicationModal);

  return (
    <>
      {showApplicationModal !== null && selectedApplication && (
        <ShowApplicationModalWindow
          id={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(null);
            setOpenDropdownId(null);
          }}
          jobPosition={selectedApplication.job_position || ""}
          status={selectedApplication.status}
          has_contract={selectedApplication.has_contract}
          onApprove={(id) => {
            setOpenDropdownId(null);
            actions.handleAction("approve", id, () => {
              setShowApplicationModal(null);
              setOpenDropdownId(null);
            });
          }}
          isReviewing={mutations.reviewingApplicationId === showApplicationModal}
          isRejecting={mutations.rejectingApplicationId === showApplicationModal}
          isCreatingContract={false}
          onRevision={(id) => {
            setOpenDropdownId(null);
            setShowApplicationModal(null);
            modals.setRevisionModal({ id, notes: "" });
          }}
          onReject={(id) => {
            setOpenDropdownId(null);
            setShowApplicationModal(null);
            modals.setRejectModal({ id, reason: "" });
          }}
          onCreateContract={(id) => actions.handleAction("create_contract", id)}
          onDownloadProfile={onDownloadProfile}
          isDownloading={isDownloading}
        />
      )}

      <div className="overflow-x-auto page-scroll pb-2 min-w-0">
        <Table.Table>
        <Table.Header>
          <tr>
            <Table.HeadCell className="w-6">
              <Checkbox state={headerState} onChange={onToggleHeader} isHeader />
            </Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "candidate_name" ? sortConfig.direction : undefined}
              onSort={() => onSort("candidate_name")}>
              {t("table.candidate")}
            </Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "invitation_email" ? sortConfig.direction : undefined}
              onSort={() => onSort("invitation_email")}>
              {t("table.email")}
            </Table.HeadCell>

            <Table.HeadCell>{t("table.phone")}</Table.HeadCell>

            <Table.HeadCell>{t("table.position")}</Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "invitation_date" ? sortConfig.direction : undefined}
              onSort={() => onSort("invitation_date")}>
              {t("table.invitationDate")}
            </Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "status" ? sortConfig.direction : undefined}
              onSort={() => onSort("status")}>
              {t("table.status")}
            </Table.HeadCell>

            <Table.HeadCell>{t("table.actions")}</Table.HeadCell>
          </tr>
        </Table.Header>

        <Table.Body>
          {applications.map((app, index) => {
            const state = rowStates[String(app.id)] || "unchecked";

            return (
              <Table.Row key={app.id} selected={state === "checked"}>
                <Table.Cell>
                  <Checkbox state={state} onChange={() => onToggleRow(app.id)} />
                </Table.Cell>

                <Table.Cell isBold>{app.candidate_name}</Table.Cell>

                <Table.Cell>{app.invitation_email}</Table.Cell>

                <Table.Cell>{app.phone || "—"}</Table.Cell>

                <Table.Cell>{app.job_position || "—"}</Table.Cell>

                <Table.Cell>{formatDateForDisplay(app.invitation_date, false) || "—"}</Table.Cell>

                <Table.Cell>
                  <Badge
                    variant="soft"
                    color={STATUS_MAP[app.status].color}
                    text={t(STATUS_MAP[app.status].label)}
                    icon={STATUS_MAP[app.status].icon}
                  />
                </Table.Cell>

                <Table.Cell>
                  <ApplicationActionsDropdown
                    application={app}
                    isLoading={mutations.isLoading.isLoadingAny}
                    onAction={actions.handleAction}
                    onViewDetails={(id) => {
                      setOpenDropdownId(null);
                      setShowApplicationModal(id);
                    }}
                    onDownloadProfile={onDownloadProfile}
                    isDownloading={isDownloading}
                    isOpen={openDropdownId === app.id}
                    onToggle={(isOpen) => {
                      setOpenDropdownId(isOpen ? app.id : null);
                    }}
                    direction={index >= applications.length - 2 ? "top" : "bottom"}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Table>
      </div>
    </>
  );
}

