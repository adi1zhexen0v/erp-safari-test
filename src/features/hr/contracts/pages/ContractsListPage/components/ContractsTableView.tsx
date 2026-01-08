import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, Prompt, Table, type CheckboxState } from "@/shared/ui";
import { TrustMeStatus } from "@/shared/components";
import { formatDateForDisplay, type Locale } from "@/shared/utils";
import type { ListContractsResponse } from "@/features/hr/contracts/types";
import { useContractsActions, type SortKey, type SortConfig } from "@/features/hr/contracts/hooks";
import ContractActionsDropdown from "./ContractActionsDropdown";

interface Props {
  contracts: ListContractsResponse[];
  rowStates: Record<string, CheckboxState>;
  headerState: CheckboxState;
  onToggleHeader: () => void;
  onToggleRow: (id: number) => void;
  sortConfig: SortConfig | null;
  onSort: (key: SortKey) => void;
  locale: Locale;
}

export default function ContractsTableView({
  contracts,
  rowStates,
  headerState,
  onToggleHeader,
  onToggleRow,
  sortConfig,
  onSort,
  locale,
}: Props) {
  const { t } = useTranslation("ContractsPage");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const {
    isLoading,
    prompt,
    setPrompt,
    handleAction,
    submittingContractId,
    downloadingContractId,
    previewingContractId,
  } = useContractsActions();

  return (
    <>
      {prompt && (
        <Prompt
          variant="success"
          title={prompt.title}
          text={prompt.text}
          onClose={() => setPrompt(null)}
          namespace="ContractsPage"
        />
      )}
      {previewingContractId !== null && (
        <Prompt
          loaderMode={true}
          loaderText={t("messages.downloadingDraft") || "Скачивание черновика"}
          title=""
          text=""
          onClose={() => {}}
          namespace="ContractsPage"
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
              sortDirection={sortConfig?.key === "contract_number" ? sortConfig.direction : undefined}
              onSort={() => onSort("contract_number")}>
              {t("table.contractNumber")}
            </Table.HeadCell>

            <Table.HeadCell>{t("table.position")}</Table.HeadCell>

            <Table.HeadCell>{t("table.managerSigned")}</Table.HeadCell>

            <Table.HeadCell>{t("table.employeeSigned")}</Table.HeadCell>

            <Table.HeadCell
              sortable
              sortDirection={sortConfig?.key === "created_at" ? sortConfig.direction : undefined}
              onSort={() => onSort("created_at")}>
              {t("table.startDate")}
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
          {contracts.map((contract, index) => {
            const state = rowStates[String(contract.id)] || "unchecked";

            return (
              <Table.Row key={contract.id} selected={state === "checked"}>
                <Table.Cell>
                  <Checkbox state={state} onChange={() => onToggleRow(contract.id)} />
                </Table.Cell>

                <Table.Cell isBold>{contract.candidate_name}</Table.Cell>

                <Table.Cell>{contract.contract_number}</Table.Cell>

                <Table.Cell>
                  {locale === "kk" ? contract.job_position_kk || "—" : contract.job_position_ru || "—"}
                </Table.Cell>

                <Table.Cell>
                  {contract.trustme_document?.manager_signed_at
                    ? formatDateForDisplay(contract.trustme_document.manager_signed_at)
                    : "—"}
                </Table.Cell>

                <Table.Cell>
                  {contract.trustme_document?.employee_signed_at
                    ? formatDateForDisplay(contract.trustme_document.employee_signed_at)
                    : "—"}
                </Table.Cell>

                <Table.Cell>{contract.created_at ? formatDateForDisplay(contract.created_at) : "—"}</Table.Cell>

                <Table.Cell>
                  <TrustMeStatus trustmeStatus={contract.trustme_status} locale={locale} />
                </Table.Cell>

                <Table.Cell>
                  <ContractActionsDropdown
                    contract={contract}
                    isLoading={isLoading.isLoadingAny}
                    submittingContractId={submittingContractId}
                    downloadingContractId={downloadingContractId}
                    previewingContractId={previewingContractId}
                    onAction={handleAction}
                    isOpen={openDropdownId === contract.id}
                    onToggle={(isOpen) => {
                      setOpenDropdownId(isOpen ? contract.id : null);
                    }}
                    direction={index === contracts.length - 1 ? "top" : "bottom"}
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

