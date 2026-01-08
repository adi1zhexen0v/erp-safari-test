import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, DollarCircle, Monitor, Clock, DocumentText, Edit } from "iconsax-react";
import { ModalForm, Skeleton, Button } from "@/shared/ui";
import { useGetContractDetailQuery, useGetContractClausesQuery } from "@/features/hr/contracts/api";
import type { ContractClause } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";
import {
  ChangePositionForm,
  ChangeSalaryForm,
  ChangeWorkFormatForm,
  ChangeWorkScheduleForm,
  ContractClausesView,
  ClauseEditForm,
} from "./contract-changes";

type FormType = "position" | "salary" | "workFormat" | "workSchedule" | "clauses" | "clause" | null;

interface Props {
  employee: WorkerListItem;
  onClose: () => void;
}

function getFormForClause(sectionNumber: string): FormType {
  if (sectionNumber === "1.1") return "position";
  if (sectionNumber === "1.3") return "workFormat";
  if (sectionNumber === "4.1") return "workSchedule";
  if (sectionNumber === "4.12") return "salary";
  return "clause";
}

export default function ContractChangesModal({ employee, onClose }: Props) {
  const { t } = useTranslation("FillContractPage");
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [selectedClause, setSelectedClause] = useState<ContractClause | null>(null);
  const contractId = employee.active_contract?.id;

  const {
    data: contractData,
    isLoading: isLoadingContract,
    isError: isErrorContract,
  } = useGetContractDetailQuery(contractId!, {
    skip: !contractId,
  });

  const {
    data: contractClauses,
    isLoading: isLoadingClauses,
    isError: isErrorClauses,
  } = useGetContractClausesQuery(undefined, {
    skip: !contractId,
  });

  function handleButtonClick(formType: FormType) {
    if (formType === null) {
      setActiveForm("clauses");
      return;
    }
    setActiveForm(formType);
  }

  function handleBackToMenu() {
    setActiveForm(null);
    setSelectedClause(null);
  }

  function handleClauseClick(clause: ContractClause) {
    const formType = getFormForClause(clause.section_number);
    setSelectedClause(clause);
    setActiveForm(formType);
  }

  function handlePositionClick() {
    handleButtonClick("position");
  }

  function handleSalaryClick() {
    handleButtonClick("salary");
  }

  function handleWorkFormatClick() {
    handleButtonClick("workFormat");
  }

  function handleWorkScheduleClick() {
    handleButtonClick("workSchedule");
  }

  function handleOtherConditionsClick() {
    handleButtonClick(null);
  }

  const buttons = [
    {
      id: "position" as FormType,
      icon: Briefcase,
      text: t("contractChanges.changePosition.title"),
      onClick: handlePositionClick,
    },
    {
      id: "salary" as FormType,
      icon: DollarCircle,
      text: t("contractChanges.changeSalary.title"),
      onClick: handleSalaryClick,
    },
    {
      id: "workFormat" as FormType,
      icon: Monitor,
      text: t("contractChanges.changeWorkFormat.title"),
      onClick: handleWorkFormatClick,
    },
    {
      id: "workSchedule" as FormType,
      icon: Clock,
      text: t("contractChanges.changeWorkSchedule.title"),
      onClick: handleWorkScheduleClick,
    },
    {
      id: null as FormType,
      icon: DocumentText,
      text: t("contractChanges.changeOtherConditions.title"),
      onClick: handleOtherConditionsClick,
    },
  ];

  function renderContent() {
    if (!contractId) {
      return (
        <div className="flex flex-col justify-between p-1 h-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
              <h4 className="text-display-2xs content-base-primary">{t("contractChanges.modalTitle")}</h4>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-body-regular-md content-action-negative">{t("contractChanges.noActiveContract")}</p>
            </div>
          </div>
          <div className="grid grid-cols-[2fr_3fr] gap-3">
            <Button variant="secondary" className="py-3" onClick={onClose} type="button">
              {t("buttons.close")}
            </Button>
          </div>
        </div>
      );
    }

    if (isLoadingContract || isLoadingClauses) {
      return <ContractChangesSkeleton />;
    }

    if (isErrorContract || !contractData) {
      return (
        <div className="flex flex-col justify-between p-1 h-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
              <h4 className="text-display-2xs content-base-primary">{t("contractChanges.modalTitle")}</h4>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-body-regular-md content-action-negative">{t("contractChanges.loadError")}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose} type="button">
              {t("buttons.close")}
            </Button>
          </div>
        </div>
      );
    }

    if (isErrorClauses || !contractClauses) {
      return (
        <div className="flex flex-col justify-between p-1 h-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
              <h4 className="text-display-2xs content-base-primary">{t("contractChanges.modalTitle")}</h4>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-body-regular-md content-action-negative">{t("contractChanges.loadError")}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose} type="button">
              {t("buttons.close")}
            </Button>
          </div>
        </div>
      );
    }

    if (activeForm === "position") {
      return (
        <ChangePositionForm
          employee={employee}
          contractData={contractData}
          onBack={handleBackToMenu}
          onClose={onClose}
        />
      );
    }
    if (activeForm === "salary") {
      return (
        <ChangeSalaryForm employee={employee} contractData={contractData} onBack={handleBackToMenu} onClose={onClose} />
      );
    }
    if (activeForm === "workFormat") {
      return (
        <ChangeWorkFormatForm
          employee={employee}
          contractData={contractData}
          onBack={handleBackToMenu}
          onClose={onClose}
        />
      );
    }
    if (activeForm === "workSchedule") {
      return (
        <ChangeWorkScheduleForm
          employee={employee}
          contractData={contractData}
          onBack={handleBackToMenu}
          onClose={onClose}
        />
      );
    }

    if (activeForm === "clauses") {
      return (
        <ContractClausesView
          employee={employee}
          clauses={contractClauses}
          contractData={contractData}
          onClauseClick={handleClauseClick}
          onBack={handleBackToMenu}
        />
      );
    }

    if (activeForm === "clause" && selectedClause) {
      return (
        <ClauseEditForm
          employee={employee}
          clause={selectedClause}
          contractData={contractData}
          onBack={handleBackToMenu}
          onClose={onClose}
        />
      );
    }

    return (
      <div className="flex flex-col justify-between p-1 h-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("contractChanges.modalTitle")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("contractChanges.selectChangeType")}</p>
          </div>

          <div className="flex flex-col gap-3">
            {buttons.map((button) => {
              const IconComponent = button.icon;
              const isClock = IconComponent === Clock;
              return (
                <button
                  key={button.id || "other"}
                  type="button"
                  onClick={button.onClick}
                  className="w-full p-4 border surface-base-stroke radius-sm flex justify-start items-center gap-4 hover:surface-base-hover transition-colors cursor-pointer">
                  <span className="content-action-brand">
                    <IconComponent size={20} color="currentColor" {...(isClock ? { variant: "Bold" } : {})} />
                  </span>
                  <span className="text-body-bold-md content-base-primary">{button.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose} type="button">
            {t("buttons.close")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ModalForm icon={Edit} onClose={onClose} allowCloseInOverlay={false}>
      {renderContent()}
    </ModalForm>
  );
}

function ContractChangesSkeleton() {
  return (
    <div className="flex flex-col justify-between p-1 h-full">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <Skeleton height={28} width={240} />
          <Skeleton height={16} width={200} />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} height={52} width="100%" />
          ))}
        </div>
      </div>
      <Skeleton height={44} width="100%" />
    </div>
  );
}

