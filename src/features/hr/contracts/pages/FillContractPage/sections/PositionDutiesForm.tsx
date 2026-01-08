import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Add, Trash } from "iconsax-react";
import cn from "classnames";
import type { ContractFormValues } from "@/features/hr/contracts/types";
import { Button, Input } from "@/shared/ui";

export default function PositionDutiesForm() {
  const { t } = useTranslation("FillContractPage");
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ContractFormValues>();

  const jobDutiesRu = watch("job_duties_ru") || [];
  const jobDutiesKk = watch("job_duties_kk") || [];

  function addDuty() {
    setValue("job_duties_ru", [...jobDutiesRu, ""], { shouldValidate: true });
    setValue("job_duties_kk", [...jobDutiesKk, ""], { shouldValidate: true });
  };

  const removeDuty = (index: number) => {
    const newDutiesRu = jobDutiesRu.filter((_, i) => i !== index);
    const newDutiesKk = jobDutiesKk.filter((_, i) => i !== index);
    setValue("job_duties_ru", newDutiesRu, { shouldValidate: true });
    setValue("job_duties_kk", newDutiesKk, { shouldValidate: true });
  };

  function updateDutyRu(index: number, value: string) {
    const newDuties = [...jobDutiesRu];
    newDuties[index] = value;
    setValue("job_duties_ru", newDuties, { shouldValidate: true });
  };

  function updateDutyKk(index: number, value: string) {
    const newDuties = [...jobDutiesKk];
    newDuties[index] = value;
    setValue("job_duties_kk", newDuties, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-display-2xs content-base-primary">{t("sections.position_duties")}</h2>

      <div className="grid grid-cols-2 gap-y-4 gap-x-3">
        <div className="flex flex-col gap-4">
          <Input
            label={t("form.job_position_ru")}
            placeholder={t("placeholders.job_position_ru")}
            value={watch("job_position_ru")}
            onChange={(e) => setValue("job_position_ru", e.target.value, { shouldValidate: true })}
            error={errors.job_position_ru?.message ? t(errors.job_position_ru.message as string) : undefined}
          />

          <div className="flex flex-col gap-2">
            <label className="text-label-sm content-base-primary">{t("form.job_duties_ru")}</label>
            {jobDutiesRu.map((duty, index) => (
              <div key={index} className="relative">
                <Input
                  isTextarea
                  placeholder={t("placeholders.job_duty_ru")}
                  value={duty}
                  onChange={(e) => updateDutyRu(index, e.target.value)}
                  className={cn("h-20", jobDutiesRu.length > 1 && "pr-10")}
                  error={
                    errors.job_duties_ru?.[index]?.message
                      ? t(errors.job_duties_ru[index]?.message as string)
                      : undefined
                  }
                />
                {jobDutiesRu.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDuty(index)}
                    className="absolute right-5 top-5 content-action-negative cursor-pointer hover:opacity-80 transition-opacity">
                    <Trash size={16} color="currentColor" />
                  </button>
                )}
              </div>
            ))}
            {errors.job_duties_ru && typeof errors.job_duties_ru.message === "string" && (
              <p className="text-body-regular-xs content-action-negative">{t(errors.job_duties_ru.message)}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label={t("form.job_position_kk")}
            placeholder={t("placeholders.job_position_kk")}
            value={watch("job_position_kk")}
            onChange={(e) => setValue("job_position_kk", e.target.value, { shouldValidate: true })}
            error={errors.job_position_kk?.message ? t(errors.job_position_kk.message as string) : undefined}
          />

          <div className="flex flex-col gap-2">
            <label className="text-label-sm content-base-primary">{t("form.job_duties_kk")}</label>
            {jobDutiesKk.map((duty, index) => (
              <div key={index} className="relative">
                <Input
                  isTextarea
                  placeholder={t("placeholders.job_duty_kk")}
                  value={duty}
                  onChange={(e) => updateDutyKk(index, e.target.value)}
                  className={cn("h-20", jobDutiesKk.length > 1 && "pr-12")}
                  error={
                    errors.job_duties_kk?.[index]?.message
                      ? t(errors.job_duties_kk[index]?.message as string)
                      : undefined
                  }
                />
                {jobDutiesKk.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDuty(index)}
                    className="absolute right-5 top-5 content-action-negative cursor-pointer hover:opacity-80 transition-opacity">
                    <Trash size={16} color="currentColor" />
                  </button>
                )}
              </div>
            ))}
            {errors.job_duties_kk && typeof errors.job_duties_kk.message === "string" && (
              <p className="text-body-regular-xs content-action-negative">{t(errors.job_duties_kk.message)}</p>
            )}
          </div>
        </div>

        <div className="col-span-2">
          <Button type="button" variant="secondary" size="md" onClick={addDuty} className="w-full">
            <Add size={16} color="currentColor" />
            {t("buttons.add_duty")}
          </Button>
        </div>
      </div>
    </div>
  );
}
