import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ContractFormValues } from "@/features/hr/contracts/types";
import { CitySelect, DatePicker, Input } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";

export default function BasicInfoForm() {
  const { i18n, t } = useTranslation("FillContractPage");
  const locale = (i18n.language as Locale) || "ru";
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ContractFormValues>();

  const signDate = watch("sign_date");
  const startDate = watch("start_date");
  const workCityId = watch("work_city_id");

  function handleDateChange(v: Date | { start: Date | null; end: Date | null } | null) {
    const date = v && "start" in v ? v.start : (v as Date | null);
    const formatted = date ? formatDateToISO(date) : "";
    setValue("sign_date", formatted, { shouldValidate: true });
    setValue("start_date", formatted, { shouldValidate: true });
  }

  const dateValue = signDate ? new Date(signDate) : startDate ? new Date(startDate) : null;

  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-display-2xs content-base-primary">{t("sections.basic_info")}</h2>

      <div className="grid grid-cols-2 gap-y-4 gap-x-3">
        <DatePicker
          locale={locale}
          mode="single"
          label={t("form.sign_date")}
          placeholder={t("placeholders.sign_date")}
          value={dateValue}
          onChange={handleDateChange}
          error={errors.sign_date?.message ? t(errors.sign_date.message as string) : undefined}
        />

        <CitySelect
          label={t("form.work_city")}
          placeholder={t("placeholders.work_city")}
          value={workCityId ?? undefined}
          onChange={(cityId) => {
            setValue("work_city_id", cityId ?? null, { shouldValidate: true });
          }}
          error={errors.work_city_id?.message ? t(errors.work_city_id.message as string) : undefined}
        />

        <Input
          label={t("form.employee_address_ru")}
          placeholder={t("placeholders.employee_address_ru")}
          value={watch("employee_address_ru")}
          onChange={(e) => setValue("employee_address_ru", e.target.value, { shouldValidate: true })}
          error={errors.employee_address_ru?.message ? t(errors.employee_address_ru.message as string) : undefined}
        />

        <Input
          label={t("form.employee_address_kk")}
          placeholder={t("placeholders.employee_address_kk")}
          value={watch("employee_address_kk")}
          onChange={(e) => setValue("employee_address_kk", e.target.value, { shouldValidate: true })}
          error={errors.employee_address_kk?.message ? t(errors.employee_address_kk.message as string) : undefined}
        />
      </div>
    </div>
  );
}
