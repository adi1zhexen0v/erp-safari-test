import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Select, Button } from "@/shared/ui";
import type { ContractDetailResponse } from "@/features/hr/contracts/types";
import type { WorkerListItem } from "@/features/hr/employees";

interface Props {
  employee: WorkerListItem;
  contractData: ContractDetailResponse;
  onBack: () => void;
  onClose: () => void;
}

export default function ChangeWorkFormatForm({ contractData, onBack }: Props) {
  const { t } = useTranslation("FillContractPage");
  const [isOnline, setIsOnline] = useState<boolean | undefined>(contractData.is_online);

  useEffect(() => {
    if (contractData) {
      setIsOnline(contractData.is_online);
    }
  }, [contractData]);

  function handleIsOnlineChange(value: boolean | null) {
    setIsOnline(value ?? undefined);
  }

  const isOnlineOptions = [
    { label: t("form.is_online_offline"), value: false },
    { label: t("form.is_online_online"), value: true },
  ];

  const currentStatusText =
    contractData.is_online === undefined
      ? t("contractChanges.changeWorkFormat.currentStatus.undefined")
      : contractData.is_online
        ? t("contractChanges.changeWorkFormat.currentStatus.online")
        : t("contractChanges.changeWorkFormat.currentStatus.offline");

  return (
    <div className="flex flex-col justify-between p-1 h-full">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
          <h4 className="text-display-2xs content-base-primary">{t("contractChanges.changeWorkFormat.title")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("contractChanges.changeWorkFormat.subtitle")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-4 radius-md surface-base-fill border surface-base-stroke">
            <p className="text-body-regular-sm content-base-secondary">{currentStatusText}</p>
            <p className="text-body-regular-sm content-base-secondary mt-2">
              {t("contractChanges.changeWorkFormat.instruction")}
            </p>
          </div>

          <Select
            label={t("form.is_online")}
            placeholder={t("placeholders.is_online")}
            options={isOnlineOptions}
            value={isOnline}
            onChange={handleIsOnlineChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-[2fr_3fr] gap-3">
        <Button variant="secondary" className="py-3" onClick={onBack} type="button">
          {t("buttons.back")}
        </Button>
        <Button variant="primary" className="py-3" type="button">
          {t("buttons.saveChanges")}
        </Button>
      </div>
    </div>
  );
}

