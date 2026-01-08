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
import {
  useSubmitServiceAgreementMSBMutation,
  useGetServiceAgreementMSBQuery,
  useUpdateServiceAgreementMSBMutation,
} from "../api";
import type { ServiceAgreementMSBPreviewData, ServiceAgreementMSBFormValues } from "../types";
import { serviceAgreementMSBSchema, mapFormToApiPayload, mapFormToPreviewData, mapApiResponseToForm } from "../utils";
import { ServiceAgreementMSBFormSkeleton, ServiceAgreementMSBPreviewModal } from "./";

interface Props {
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  commercialOrganizations?: CommercialOrganization[];
}

export default function ServiceAgreementMSBForm({ editId, onSuccess, commercialOrganizations = [] }: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const [submitServiceAgreementMSB, { isLoading: isSaving }] = useSubmitServiceAgreementMSBMutation();
  const [updateServiceAgreementMSB, { isLoading: isUpdating }] = useUpdateServiceAgreementMSBMutation();
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<ServiceAgreementMSBPreviewData | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<ServiceAgreementMSBFormValues | null>(null);
  const isEditMode = !!editId;
  const locale = i18n.language === "kk" ? "kk" : "ru";

  const { data: existingData, isLoading: isLoadingData } = useGetServiceAgreementMSBQuery(editId!, {
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
  } = useForm<ServiceAgreementMSBFormValues>({
    resolver: zodResolver(serviceAgreementMSBSchema),
    defaultValues: {
      contract_city_id: undefined,
      contract_date: new Date(),
      commercial_org_id: 0,
      counterparty_bank_name: "",
      counterparty_iban: "",
      counterparty_bik: "",
      services_description: "",
      service_start_date: undefined,
      service_end_date: undefined,
      correction_days: undefined,
      payment_days: undefined,
      contract_amount: undefined,
      penalty_percent: undefined,
      daily_penalty_percent: undefined,
      dispute_resolution_body: "",
    },
  });

  const bankName = watch("counterparty_bank_name");
  const bankBik = watch("counterparty_bik");
  const commercialOrgId = watch("commercial_org_id");

  const { selectedBank, handleBankChange } = useBankSelection<ServiceAgreementMSBFormValues>({
    bankName,
    bankBik,
    setValue,
    bankNameField: "counterparty_bank_name",
    bankBikField: "counterparty_bik",
  });

  const { selectedOrganization, getOrganizationName, handleOrganizationChange } =
    useOrganizationSelection<ServiceAgreementMSBFormValues>({
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

  async function onSubmit(values: ServiceAgreementMSBFormValues) {
    setCurrentFormValues(values);
    const previewData = mapFormToPreviewData(values, locale, cities);
    setFormDataForPreview(previewData);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!currentFormValues) return null;

    const apiPayload = mapFormToApiPayload(currentFormValues);

    if (isEditMode && editId) {
      await updateServiceAgreementMSB({ id: editId, data: apiPayload }).unwrap();
      return { id: editId, data: apiPayload };
    } else {
      await submitServiceAgreementMSB(apiPayload).unwrap();
      return null;
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  if (isSaving || isUpdating || (isEditMode && isLoadingData)) return <ServiceAgreementMSBFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("forms.serviceAgreementMSB.title")}</h2>

        <div className="flex flex-col gap-4 p-1">
          <DatePicker
            label={t("forms.serviceAgreementMSB.contract_date.label")}
            placeholder={t("forms.serviceAgreementMSB.contract_date.placeholder")}
            locale={locale}
            value={watch("contract_date")}
            onChange={(date) => setValue("contract_date", date, { shouldValidate: true })}
            error={errors.contract_date?.message && t(errors.contract_date.message)}
          />

          <CitySelect
            label={t("forms.serviceAgreementMSB.contract_city.label")}
            placeholder={t("forms.serviceAgreementMSB.contract_city.placeholder")}
            value={watch("contract_city_id")}
            onChange={(cityId) => setValue("contract_city_id", cityId, { shouldValidate: true })}
            error={errors.contract_city_id?.message && t(errors.contract_city_id.message)}
          />

          <SearchableSelect<CommercialOrganization>
            label={t("forms.serviceAgreementMSB.executor_name.label")}
            placeholder={t("forms.serviceAgreementMSB.executor_name.placeholder")}
            searchPlaceholder={t("forms.serviceAgreementMSB.executor_name.placeholder")}
            options={commercialOrganizations}
            value={selectedOrganization}
            onChange={handleOrganizationChange}
            searchKeys={["name_ru", "name_kk", "bin"]}
            displayKey="name_ru"
            getOptionLabel={getOrganizationName}
            error={errors.commercial_org_id?.message && t(errors.commercial_org_id.message)}
          />

          <SearchableSelect<Bank>
            label={t("forms.serviceAgreementMSB.bank.label")}
            placeholder={t("forms.serviceAgreementMSB.bank.placeholder")}
            searchPlaceholder={t("forms.serviceAgreementMSB.bank.searchPlaceholder")}
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
            label={t("forms.serviceAgreementMSB.executor_iban.label")}
            placeholder={t("forms.serviceAgreementMSB.executor_iban.placeholder")}
            {...register("counterparty_iban")}
            error={errors.counterparty_iban?.message && t(errors.counterparty_iban.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.contract_amount.label")}
            placeholder={t("forms.serviceAgreementMSB.contract_amount.placeholder")}
            {...register("contract_amount")}
            error={errors.contract_amount?.message && t(errors.contract_amount.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.services_description.label")}
            placeholder={t("forms.serviceAgreementMSB.services_description.placeholder")}
            isTextarea
            {...register("services_description")}
            error={errors.services_description?.message && t(errors.services_description.message)}
          />

          <DatePicker
            locale={locale}
            mode="single"
            label={t("forms.serviceAgreementMSB.service_start_date.label")}
            placeholder={t("forms.serviceAgreementMSB.service_start_date.placeholder")}
            value={watch("service_start_date")}
            onChange={(date) => setValue("service_start_date", date, { shouldValidate: true })}
            error={errors.service_start_date?.message && t(errors.service_start_date.message)}
          />

          <DatePicker
            locale={locale}
            mode="single"
            label={t("forms.serviceAgreementMSB.service_end_date.label")}
            placeholder={t("forms.serviceAgreementMSB.service_end_date.placeholder")}
            value={watch("service_end_date")}
            onChange={(date) => setValue("service_end_date", date, { shouldValidate: true })}
            error={errors.service_end_date?.message && t(errors.service_end_date.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.correction_days.label")}
            placeholder={t("forms.serviceAgreementMSB.correction_days.placeholder")}
            onlyNumber
            {...register("correction_days", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.correction_days?.message && t(errors.correction_days.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.payment_days.label")}
            placeholder={t("forms.serviceAgreementMSB.payment_days.placeholder")}
            onlyNumber
            {...register("payment_days", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.payment_days?.message && t(errors.payment_days.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.penalty_percent.label")}
            placeholder={t("forms.serviceAgreementMSB.penalty_percent.placeholder")}
            {...register("penalty_percent")}
            error={errors.penalty_percent?.message && t(errors.penalty_percent.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.daily_penalty_percent.label")}
            placeholder={t("forms.serviceAgreementMSB.daily_penalty_percent.placeholder")}
            {...register("daily_penalty_percent")}
            error={errors.daily_penalty_percent?.message && t(errors.daily_penalty_percent.message)}
          />

          <Input
            label={t("forms.serviceAgreementMSB.dispute_resolution_body.label")}
            placeholder={t("forms.serviceAgreementMSB.dispute_resolution_body.placeholder")}
            {...register("dispute_resolution_body")}
            error={errors.dispute_resolution_body?.message && t(errors.dispute_resolution_body.message)}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pb-1">
        <Button variant="primary" size="lg" type="submit" disabled={isSaving || isUpdating}>
          {isSaving || isUpdating ? t("forms.serviceAgreementMSB.saving") : t("forms.serviceAgreementMSB.preview")}
          {!isSaving && !isUpdating && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
      {showPreview && formDataForPreview && (
        <ServiceAgreementMSBPreviewModal
          hasBackground={false}
          formData={formDataForPreview}
          onClose={handlePreviewClose}
          onSubmit={handlePreviewSubmit}
          editId={editId}
          onSuccess={(isEdit: boolean) => {
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

