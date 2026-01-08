import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { Button, Input, DatePicker, SearchableSelect, CitySelect } from "@/shared/ui";
import { useBankSelection } from "@/shared/hooks";
import { BANKS, type Bank } from "@/shared/consts/banks";
import { useGetCitiesQuery } from "@/shared/api/common";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import { useOrganizationSelection } from "../../../hooks";
import { useSubmitPremiseRentMutation, useGetPremiseRentQuery, useUpdatePremiseRentMutation } from "../api";
import type { PremiseRentPreviewData, PremiseRentFormValues } from "../types";
import { premiseRentSchema, mapFormToApiPayload, mapFormToPreviewData, mapApiResponseToForm } from "../utils";
import { PremiseRentFormSkeleton, PremiseRentPreviewModal } from "./";

interface Props {
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  commercialOrganizations?: CommercialOrganization[];
}

export default function PremiseRentForm({ editId, onSuccess, commercialOrganizations = [] }: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const [submitPremiseRent, { isLoading: isSaving }] = useSubmitPremiseRentMutation();
  const [updatePremiseRent, { isLoading: isUpdating }] = useUpdatePremiseRentMutation();
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<PremiseRentPreviewData | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<PremiseRentFormValues | null>(null);
  const isEditMode = !!editId;
  const locale = i18n.language === "kk" ? "kk" : "ru";

  const { data: existingData, isLoading: isLoadingData } = useGetPremiseRentQuery(editId!, {
    skip: !editId,
  });

  const { data: cities = [] } = useGetCitiesQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PremiseRentFormValues>({
    resolver: zodResolver(premiseRentSchema),
    defaultValues: {
      contract_city_id: undefined,
      contract_date: new Date(),
      commercial_org_id: 0,
      counterparty_bank_name: "",
      counterparty_iban: "",
      counterparty_bik: "",
      premise_area: undefined,
      premise_address: undefined,
      premise_usage_purpose: undefined,
      rental_start_date: null,
      rental_end_date: null,
      rental_amount: undefined,
      first_month_payment_deadline: null,
    },
  });

  const bankName = watch("counterparty_bank_name");
  const bankBik = watch("counterparty_bik");
  const commercialOrgId = watch("commercial_org_id");

  const { selectedBank, handleBankChange } = useBankSelection<PremiseRentFormValues>({
    bankName,
    bankBik,
    setValue,
    bankNameField: "counterparty_bank_name",
    bankBikField: "counterparty_bik",
  });

  const { selectedOrganization, getOrganizationName, handleOrganizationChange } =
    useOrganizationSelection<PremiseRentFormValues>({
      commercialOrgId,
      commercialOrganizations,
      existingOrg: existingData?.commercial_org,
      setValue,
      orgIdField: "commercial_org_id",
      i18n,
    });

  useEffect(() => {
    if (existingData) {
      const formValues = mapApiResponseToForm(existingData);
      reset(formValues);
    }
  }, [existingData, reset]);

  async function onSubmit(values: PremiseRentFormValues) {
    setCurrentFormValues(values);
    const previewData = mapFormToPreviewData(values, locale, cities);
    setFormDataForPreview(previewData);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!currentFormValues) return null;

    const apiPayload = mapFormToApiPayload(currentFormValues);

    if (isEditMode && editId) {
      await updatePremiseRent({ id: editId, data: apiPayload }).unwrap();
      return { id: editId, data: apiPayload };
    } else {
      await submitPremiseRent(apiPayload).unwrap();
      return null;
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  if (isSaving || isUpdating || (isEditMode && isLoadingData)) return <PremiseRentFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("forms.commercialPremiseRent.title")}</h2>

        <div className="flex flex-col gap-4 p-1">
          <DatePicker
            locale={locale}
            mode="single"
            label={t("forms.commercialPremiseRent.contract_date.label")}
            placeholder={t("forms.commercialPremiseRent.contract_date.placeholder")}
            value={watch("contract_date")}
            onChange={(date) => setValue("contract_date", date, { shouldValidate: true })}
            error={errors.contract_date?.message ? t(errors.contract_date.message) : undefined}
          />

          <CitySelect
            label={t("forms.commercialPremiseRent.contract_city.label")}
            placeholder={t("forms.commercialPremiseRent.contract_city.placeholder")}
            value={watch("contract_city_id")}
            onChange={(cityId) => setValue("contract_city_id", cityId, { shouldValidate: true })}
            error={errors.contract_city_id?.message && t(errors.contract_city_id.message)}
          />

          <SearchableSelect<CommercialOrganization>
            label={t("forms.commercialPremiseRent.lessor_name.label")}
            placeholder={t("forms.commercialPremiseRent.lessor_name.placeholder")}
            searchPlaceholder={t("forms.commercialPremiseRent.lessor_name.placeholder")}
            options={commercialOrganizations}
            value={selectedOrganization}
            onChange={handleOrganizationChange}
            searchKeys={["name_ru", "name_kk", "bin"]}
            displayKey="name_ru"
            getOptionLabel={getOrganizationName}
            error={errors.commercial_org_id?.message && t(errors.commercial_org_id.message)}
          />

          <SearchableSelect<Bank>
            label={t("forms.commercialPremiseRent.bank.label")}
            placeholder={t("forms.commercialPremiseRent.bank.placeholder")}
            searchPlaceholder={t("forms.commercialPremiseRent.bank.searchPlaceholder")}
            options={BANKS}
            value={selectedBank}
            onChange={handleBankChange}
            searchKeys={["name", "bik"]}
            displayKey="name"
            error={
              (errors.counterparty_bank_name?.message || errors.counterparty_bik?.message) &&
              t(errors.counterparty_bank_name?.message || errors.counterparty_bik?.message || "")
            }
          />

          <Input
            label={t("forms.commercialPremiseRent.lessor_iban.label")}
            placeholder={t("forms.commercialPremiseRent.lessor_iban.placeholder")}
            {...register("counterparty_iban")}
            error={errors.counterparty_iban?.message && t(errors.counterparty_iban.message)}
          />

          <Input
            label={t("forms.commercialPremiseRent.premise_area.label")}
            placeholder={t("forms.commercialPremiseRent.premise_area.placeholder")}
            onlyNumber
            {...register("premise_area")}
            error={errors.premise_area?.message && t(errors.premise_area.message)}
          />

          <Input
            label={t("forms.commercialPremiseRent.premise_address.label")}
            placeholder={t("forms.commercialPremiseRent.premise_address.placeholder")}
            {...register("premise_address")}
            error={errors.premise_address?.message && t(errors.premise_address.message)}
          />

          <Input
            label={t("forms.commercialPremiseRent.premise_usage_purpose.label")}
            placeholder={t("forms.commercialPremiseRent.premise_usage_purpose.placeholder")}
            {...register("premise_usage_purpose")}
            error={errors.premise_usage_purpose?.message && t(errors.premise_usage_purpose.message)}
          />

          <DatePicker
            locale={locale}
            mode="single"
            label={t("forms.commercialPremiseRent.rental_start_date.label")}
            placeholder={t("forms.commercialPremiseRent.rental_start_date.placeholder")}
            value={watch("rental_start_date")}
            onChange={(date) => setValue("rental_start_date", date, { shouldValidate: true })}
            error={errors.rental_start_date?.message ? t(errors.rental_start_date.message) : undefined}
          />

          <DatePicker
            locale={locale}
            mode="single"
            direction="top"
            label={t("forms.commercialPremiseRent.rental_end_date.label")}
            placeholder={t("forms.commercialPremiseRent.rental_end_date.placeholder")}
            value={watch("rental_end_date")}
            onChange={(date) => setValue("rental_end_date", date, { shouldValidate: true })}
            error={errors.rental_end_date?.message ? t(errors.rental_end_date.message) : undefined}
          />

          <Input
            label={t("forms.commercialPremiseRent.rental_amount.label")}
            placeholder={t("forms.commercialPremiseRent.rental_amount.placeholder")}
            onlyNumber
            {...register("rental_amount")}
            error={errors.rental_amount?.message && t(errors.rental_amount.message)}
          />

          <DatePicker
            locale={locale}
            mode="single"
            direction="top"
            label={t("forms.commercialPremiseRent.first_month_payment_deadline.label")}
            placeholder={t("forms.commercialPremiseRent.first_month_payment_deadline.placeholder")}
            value={watch("first_month_payment_deadline")}
            onChange={(date) => setValue("first_month_payment_deadline", date, { shouldValidate: true })}
            error={
              errors.first_month_payment_deadline?.message ? t(errors.first_month_payment_deadline.message) : undefined
            }
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pb-1">
        <Button variant="primary" size="lg" type="submit" disabled={isSaving || isUpdating}>
          {isSaving || isUpdating ? t("forms.commercialPremiseRent.saving") : t("forms.commercialPremiseRent.preview")}
          {!isSaving && !isUpdating && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
      {showPreview && formDataForPreview && (
        <PremiseRentPreviewModal
          hasBackground={false}
          formData={formDataForPreview}
          onClose={handlePreviewClose}
          onSubmit={handlePreviewSubmit}
          editId={editId}
          onSuccess={(isEdit) => {
            handlePreviewClose();
            if (onSuccess) {
              onSuccess(isEdit);
            }
          }}
          commercialOrganizations={commercialOrganizations}
          commercialOrg={existingData?.commercial_org}
        />
      )}
    </form>
  );
}
