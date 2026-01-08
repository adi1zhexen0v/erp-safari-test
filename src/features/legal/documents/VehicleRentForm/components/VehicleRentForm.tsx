import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { Button, Input, SearchableSelect, CitySelect, DatePicker } from "@/shared/ui";
import { useBankSelection } from "@/shared/hooks";
import { BANKS, type Bank } from "@/shared/consts/banks";
import { useGetCitiesQuery } from "@/shared/api/common";
import type { CommercialOrganization } from "../../../types/commercialOrganizations";
import { useOrganizationSelection } from "../../../hooks";
import { useSubmitVehicleRentMutation, useGetVehicleRentQuery, useUpdateVehicleRentMutation } from "../api";
import type { VehicleRentPreviewData, VehicleRentFormValues } from "../types";
import { vehicleRentSchema, mapFormToApiPayload, mapFormToPreviewData, mapApiResponseToForm } from "../utils";
import { VehicleRentFormSkeleton, VehicleRentPreviewModal } from "./";

interface Props {
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  commercialOrganizations?: CommercialOrganization[];
}

export default function VehicleRentForm({ editId, onSuccess, commercialOrganizations = [] }: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const [submitVehicleRent, { isLoading: isSaving }] = useSubmitVehicleRentMutation();
  const [updateVehicleRent, { isLoading: isUpdating }] = useUpdateVehicleRentMutation();
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<VehicleRentPreviewData | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<VehicleRentFormValues | null>(null);
  const isEditMode = !!editId;
  const locale = i18n.language === "kk" ? "kk" : "ru";

  const { data: existingData, isLoading: isLoadingData } = useGetVehicleRentQuery(editId!, {
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
  } = useForm<VehicleRentFormValues>({
    resolver: zodResolver(vehicleRentSchema),
    defaultValues: {
      contract_city_id: undefined,
      contract_date: new Date(),
      commercial_org_id: 0,
      counterparty_bank_name: "",
      counterparty_iban: "",
      counterparty_bik: "",
      car_brand: "",
      car_year: undefined,
      car_vin: "",
      car_plate: "",
      car_color: "",
      rental_term_months: undefined,
      rental_amount: undefined,
    },
  });

  const bankName = watch("counterparty_bank_name");
  const bankBik = watch("counterparty_bik");
  const commercialOrgId = watch("commercial_org_id");

  const { selectedBank, handleBankChange } = useBankSelection<VehicleRentFormValues>({
    bankName,
    bankBik,
    setValue,
    bankNameField: "counterparty_bank_name",
    bankBikField: "counterparty_bik",
  });

  const { selectedOrganization, getOrganizationName, handleOrganizationChange } =
    useOrganizationSelection<VehicleRentFormValues>({
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

  async function onSubmit(values: VehicleRentFormValues) {
    setCurrentFormValues(values);
    const previewData = mapFormToPreviewData(values, locale, cities);
    setFormDataForPreview(previewData);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!currentFormValues) return null;

    const apiPayload = mapFormToApiPayload(currentFormValues);

    if (isEditMode && editId) {
      await updateVehicleRent({ id: editId, data: apiPayload }).unwrap();
      return { id: editId, data: apiPayload };
    } else {
      await submitVehicleRent(apiPayload).unwrap();
      return null;
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  if (isSaving || isUpdating || (isEditMode && isLoadingData)) return <VehicleRentFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("forms.vehicleRent.title")}</h2>

        <div className="flex flex-col gap-4 p-1">
          <DatePicker
            label={t("forms.vehicleRent.contract_date.label")}
            placeholder={t("forms.vehicleRent.contract_date.placeholder")}
            locale={locale}
            value={watch("contract_date")}
            onChange={(date) => setValue("contract_date", date, { shouldValidate: true })}
            error={errors.contract_date?.message && t(errors.contract_date.message)}
          />

          <CitySelect
            label={t("forms.vehicleRent.contract_city.label")}
            placeholder={t("forms.vehicleRent.contract_city.placeholder")}
            value={watch("contract_city_id")}
            onChange={(cityId) => setValue("contract_city_id", cityId, { shouldValidate: true })}
            error={errors.contract_city_id?.message && t(errors.contract_city_id.message)}
          />

          <SearchableSelect<CommercialOrganization>
            label={t("forms.vehicleRent.lessor_name.label")}
            placeholder={t("forms.vehicleRent.lessor_name.placeholder")}
            searchPlaceholder={t("forms.vehicleRent.lessor_name.placeholder")}
            options={commercialOrganizations}
            value={selectedOrganization}
            onChange={handleOrganizationChange}
            searchKeys={["name_ru", "name_kk", "bin"]}
            displayKey="name_ru"
            getOptionLabel={getOrganizationName}
            error={errors.commercial_org_id?.message && t(errors.commercial_org_id.message)}
          />

          <SearchableSelect<Bank>
            label={t("forms.vehicleRent.bank.label")}
            placeholder={t("forms.vehicleRent.bank.placeholder")}
            searchPlaceholder={t("forms.vehicleRent.bank.searchPlaceholder")}
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
            label={t("forms.vehicleRent.lessor_iban.label")}
            placeholder={t("forms.vehicleRent.lessor_iban.placeholder")}
            {...register("counterparty_iban")}
            error={errors.counterparty_iban?.message && t(errors.counterparty_iban.message)}
          />

          <Input
            label={t("forms.vehicleRent.car_brand.label")}
            placeholder={t("forms.vehicleRent.car_brand.placeholder")}
            {...register("car_brand")}
            error={errors.car_brand?.message && t(errors.car_brand.message)}
          />

          <Input
            label={t("forms.vehicleRent.car_year.label")}
            placeholder={t("forms.vehicleRent.car_year.placeholder")}
            onlyNumber
            {...register("car_year", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.car_year?.message && t(errors.car_year.message)}
          />

          <Input
            label={t("forms.vehicleRent.car_vin.label")}
            placeholder={t("forms.vehicleRent.car_vin.placeholder")}
            {...register("car_vin")}
            error={errors.car_vin?.message && t(errors.car_vin.message)}
          />

          <Input
            label={t("forms.vehicleRent.car_plate.label")}
            placeholder={t("forms.vehicleRent.car_plate.placeholder")}
            {...register("car_plate")}
            error={errors.car_plate?.message && t(errors.car_plate.message)}
          />

          <Input
            label={t("forms.vehicleRent.car_color.label")}
            placeholder={t("forms.vehicleRent.car_color.placeholder")}
            {...register("car_color")}
            error={errors.car_color?.message && t(errors.car_color.message)}
          />

          <Input
            label={t("forms.vehicleRent.rental_term_text.label")}
            placeholder={t("forms.vehicleRent.rental_term_text.placeholder")}
            onlyNumber
            {...register("rental_term_months", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.rental_term_months?.message && t(errors.rental_term_months.message)}
          />

          <Input
            label={t("forms.vehicleRent.rental_amount.label")}
            placeholder={t("forms.vehicleRent.rental_amount.placeholder")}
            onlyNumber
            {...register("rental_amount")}
            error={errors.rental_amount?.message && t(errors.rental_amount.message)}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pb-1">
        <Button variant="primary" size="lg" type="submit" disabled={isSaving || isUpdating}>
          {isSaving || isUpdating ? t("forms.vehicleRent.saving") : t("forms.vehicleRent.preview")}
          {!isSaving && !isUpdating && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
      {showPreview && formDataForPreview && (
        <VehicleRentPreviewModal
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

