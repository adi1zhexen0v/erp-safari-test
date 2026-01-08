import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, Trash } from "iconsax-react";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { Button, DatePicker, Input, SearchableSelect, CitySelect } from "@/shared/ui";
import { useBankSelection } from "@/shared/hooks";
import { BANKS, type Bank } from "@/shared/consts/banks";
import { useGetCitiesQuery } from "@/shared/api/common";
import { useSubmitServiceContractMutation, useGetServiceContractQuery, useUpdateServiceContractMutation } from "../api";
import type { ServiceContractFormValues, ServiceContractPreviewData } from "../types";
import { serviceContractSchema, mapFormToApiPayload, mapFormToPreviewData, mapApiResponseToForm } from "../utils";
import ServiceContractFormSkeleton from "./ServiceContractFormSkeleton";
import ServiceContractPreviewModal from "./ServiceContractPreviewModal";

interface Props {
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
}

export default function ServiceContractForm({ editId, onSuccess }: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const locale = i18n.language === "kk" ? "kk" : "ru";
  const [submitServiceContract, { isLoading: isSaving }] = useSubmitServiceContractMutation();
  const [updateServiceContract, { isLoading: isUpdating }] = useUpdateServiceContractMutation();
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<ServiceContractPreviewData | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<ServiceContractFormValues | null>(null);
  const isEditMode = !!editId;

  const { data: existingData, isLoading: isLoadingData } = useGetServiceContractQuery(editId!, {
    skip: !editId,
  });

  const { data: cities = [] } = useGetCitiesQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ServiceContractFormValues>({
    resolver: zodResolver(serviceContractSchema),
    defaultValues: {
      contract_city_id: undefined,
      contract_date: new Date(),
      contract_end_date: null,
      executor_full_name: "",
      executor_phone: "",
      executor_iin: "",
      executor_bank_name: "",
      executor_iban: "",
      executor_bik: "",
      service_name: "",
      service_location: "",
      services: [{ service_name: "", start_date: null, end_date: null, price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const bankName = watch("executor_bank_name");
  const bankBik = watch("executor_bik");

  const { selectedBank, handleBankChange } = useBankSelection<ServiceContractFormValues>({
    bankName,
    bankBik,
    setValue,
    bankNameField: "executor_bank_name",
    bankBikField: "executor_bik",
  });

  useEffect(() => {
    if (existingData) {
      const formValues = mapApiResponseToForm(existingData);
      reset(formValues);
    }
  }, [existingData, reset]);

  const services = watch("services");
  useEffect(() => {
    const maxEndDate = services.reduce<Date | null>((max, service) => {
      if (service.end_date) {
        if (!max || service.end_date > max) {
          return service.end_date;
        }
      }
      return max;
    }, null);

    setValue("contract_end_date", maxEndDate, { shouldValidate: false });
  }, [services, setValue]);

  async function onSubmit(values: ServiceContractFormValues) {
    setCurrentFormValues(values);
    const previewData = mapFormToPreviewData(values, locale, cities);
    setFormDataForPreview(previewData);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!currentFormValues) return null;

    const apiPayload = mapFormToApiPayload(currentFormValues);

    if (isEditMode && editId) {
      await updateServiceContract({ id: editId, data: apiPayload }).unwrap();
      return { id: editId, data: apiPayload };
    } else {
      await submitServiceContract(apiPayload).unwrap();
      return null;
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  if (isSaving || isUpdating || (isEditMode && isLoadingData)) return <ServiceContractFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("forms.serviceContract.title")}</h2>

        <div className="flex flex-col gap-4 p-1">
          <DatePicker
            locale={locale}
            mode="single"
            label={t("forms.serviceContract.contract_date.label")}
            placeholder={t("forms.serviceContract.contract_date.placeholder")}
            value={watch("contract_date")}
            onChange={(date) => setValue("contract_date", date, { shouldValidate: true })}
            error={errors.contract_date?.message ? t(errors.contract_date.message) : undefined}
          />

          <CitySelect
            label={t("forms.serviceContract.contract_city.label")}
            placeholder={t("forms.serviceContract.contract_city.placeholder")}
            value={watch("contract_city_id")}
            onChange={(cityId) => setValue("contract_city_id", cityId, { shouldValidate: true })}
            error={errors.contract_city_id?.message ? t(errors.contract_city_id.message) : undefined}
          />

          <Input
            label={t("forms.serviceContract.executor_full_name.label")}
            placeholder={t("forms.serviceContract.executor_full_name.placeholder")}
            {...register("executor_full_name")}
            error={errors.executor_full_name?.message && t(errors.executor_full_name.message)}
          />

          <Input
            label={t("forms.serviceContract.executor_phone.label")}
            placeholder={t("forms.serviceContract.executor_phone.placeholder")}
            {...register("executor_phone")}
            error={errors.executor_phone?.message && t(errors.executor_phone.message)}
          />

          <Input
            label={t("forms.serviceContract.executor_iin.label")}
            placeholder={t("forms.serviceContract.executor_iin.placeholder")}
            onlyNumber
            maxLength={12}
            {...register("executor_iin")}
            error={errors.executor_iin?.message && t(errors.executor_iin.message)}
          />

          <SearchableSelect<Bank>
            label={t("forms.serviceContract.bank.label")}
            placeholder={t("forms.serviceContract.bank.placeholder")}
            searchPlaceholder={t("forms.serviceContract.bank.searchPlaceholder")}
            options={BANKS}
            value={selectedBank}
            onChange={handleBankChange}
            searchKeys={["name", "bik"]}
            displayKey="name"
            error={
              (errors.executor_bank_name?.message || errors.executor_bik?.message) &&
              t(errors.executor_bank_name?.message || errors.executor_bik?.message || "")
            }
          />

          <Input
            label={t("forms.serviceContract.executor_iban.label")}
            placeholder={t("forms.serviceContract.executor_iban.placeholder")}
            {...register("executor_iban")}
            error={errors.executor_iban?.message && t(errors.executor_iban.message)}
          />

          <Input
            label={t("forms.serviceContract.service_name.label")}
            placeholder={t("forms.serviceContract.service_name.placeholder")}
            {...register("service_name")}
            error={errors.service_name?.message && t(errors.service_name.message)}
          />

          <Input
            label={t("forms.serviceContract.service_location.label")}
            placeholder={t("forms.serviceContract.service_location.placeholder")}
            {...register("service_location")}
            error={errors.service_location?.message && t(errors.service_location.message)}
          />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-body-bold-sm content-base-primary">
                {t("forms.serviceContract.services.label")}
              </label>
              {fields.length < 3 && (
                <Button
                  type="button"
                  variant="tertiary"
                  size="lg"
                  className="gap-1!"
                  onClick={() => append({ service_name: "", start_date: null, end_date: null, price: "" })}>
                  <Add size={16} color="currentColor" />
                  {t("forms.serviceContract.services.add")}
                </Button>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2 p-4 border surface-base-stroke radius-md">
                <div className="w-full relative">
                  <p className="w-full text-body-bold-md content-base-primary pb-4 pt-2 text-center">
                    {t("forms.serviceContract.services.item", { number: index + 1 })}
                  </p>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="md"
                      onClick={() => remove(index)}
                      className="absolute! right-0 top-0 h-7! rounded-[4px]!">
                      {t("forms.serviceContract.services.remove")}
                      <Trash size={16} color="currentColor" />
                    </Button>
                  )}
                </div>

                <Input
                  label={t("forms.serviceContract.services.name.label")}
                  placeholder={t("forms.serviceContract.services.name.placeholder")}
                  {...register(`services.${index}.service_name`)}
                  error={
                    errors.services?.[index]?.service_name?.message && t(errors.services[index]!.service_name!.message)
                  }
                />

                <DatePicker
                  direction="top"
                  locale={locale}
                  mode="single"
                  label={t("forms.serviceContract.services.start_date.label")}
                  placeholder={t("forms.serviceContract.services.start_date.placeholder")}
                  value={watch(`services.${index}.start_date`)}
                  onChange={(date) => {
                    setValue(`services.${index}.start_date`, date, { shouldValidate: true });
                  }}
                  error={
                    errors.services?.[index]?.start_date?.message && t(errors.services[index]!.start_date!.message)
                  }
                />

                <DatePicker
                  direction="top"
                  locale={locale}
                  mode="single"
                  label={t("forms.serviceContract.services.end_date.label")}
                  placeholder={t("forms.serviceContract.services.end_date.placeholder")}
                  value={watch(`services.${index}.end_date`)}
                  onChange={(date) => {
                    setValue(`services.${index}.end_date`, date, { shouldValidate: true });
                  }}
                  error={errors.services?.[index]?.end_date?.message && t(errors.services[index]!.end_date!.message)}
                />

                <Input
                  label={t("forms.serviceContract.services.price.label")}
                  placeholder={t("forms.serviceContract.services.price.placeholder")}
                  onlyNumber
                  {...register(`services.${index}.price`)}
                  error={errors.services?.[index]?.price?.message && t(errors.services[index]!.price!.message)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pb-1">
        <Button variant="primary" size="lg" type="submit" disabled={isSaving || isUpdating}>
          {isSaving || isUpdating ? t("forms.serviceContract.saving") : t("forms.serviceContract.preview")}
          {!isSaving && !isUpdating && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
      {showPreview && formDataForPreview && (
        <ServiceContractPreviewModal
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
        />
      )}
    </form>
  );
}

