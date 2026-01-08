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
import { useSubmitGoodsSupplyMutation, useGetGoodsSupplyQuery, useUpdateGoodsSupplyMutation } from "../api";
import type { GoodsSupplyPreviewData, GoodsSupplyFormValues } from "../types";
import { goodsSupplySchema, mapFormToApiPayload, mapFormToPreviewData, mapApiResponseToForm } from "../utils";
import { GoodsSupplyFormSkeleton, GoodsSupplyPreviewModal } from "./";

interface Props {
  editId?: number;
  onSuccess?: (isEdit: boolean) => void;
  commercialOrganizations?: CommercialOrganization[];
}

export default function GoodsSupplyForm({ editId, onSuccess, commercialOrganizations = [] }: Props) {
  const { t, i18n } = useTranslation("LegalTemplatesPage");
  const [submitGoodsSupply, { isLoading: isSaving }] = useSubmitGoodsSupplyMutation();
  const [updateGoodsSupply, { isLoading: isUpdating }] = useUpdateGoodsSupplyMutation();
  const [showPreview, setShowPreview] = useState(false);
  const [formDataForPreview, setFormDataForPreview] = useState<GoodsSupplyPreviewData | null>(null);
  const [currentFormValues, setCurrentFormValues] = useState<GoodsSupplyFormValues | null>(null);
  const isEditMode = !!editId;
  const locale = i18n.language === "kk" ? "kk" : "ru";

  const { data: existingData, isLoading: isLoadingData } = useGetGoodsSupplyQuery(editId!, {
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
  } = useForm<GoodsSupplyFormValues>({
    resolver: zodResolver(goodsSupplySchema),
    defaultValues: {
      contract_city_id: undefined,
      contract_date: new Date(),
      commercial_org_id: 0,
      counterparty_bank_name: "",
      counterparty_iban: "",
      counterparty_bik: "",
      delivery_address: "",
      delivery_days: undefined,
      payment_days: undefined,
      court_location: "",
      product_name: "",
      product_model: "",
      product_manufacturer: "",
      product_power: undefined,
      product_voltage: undefined,
      product_material: undefined,
      product_package: undefined,
      product_size: undefined,
      product_weight: undefined,
      product_quantity: undefined,
      product_unit_price: undefined,
      product_delivery_place: "",
      product_warranty_term: undefined,
    },
  });

  const bankName = watch("counterparty_bank_name");
  const bankBik = watch("counterparty_bik");
  const commercialOrgId = watch("commercial_org_id");
  const productQuantity = watch("product_quantity");
  const productUnitPrice = watch("product_unit_price");

  const { selectedBank, handleBankChange } = useBankSelection<GoodsSupplyFormValues>({
    bankName,
    bankBik,
    setValue,
    bankNameField: "counterparty_bank_name",
    bankBikField: "counterparty_bik",
  });

  const { selectedOrganization, getOrganizationName, handleOrganizationChange } =
    useOrganizationSelection<GoodsSupplyFormValues>({
      commercialOrgId,
      commercialOrganizations,
      existingOrg: existingData?.commercial_org,
      setValue,
      orgIdField: "commercial_org_id",
      i18n,
    });

  useEffect(() => {
    if (productQuantity !== undefined && productUnitPrice) {
      const quantity = productQuantity;
      const unitPrice = Number(productUnitPrice) || 0;
      const total = (quantity * unitPrice).toFixed(2);
      setValue("product_total_price", total, { shouldValidate: false });
    }
  }, [productQuantity, productUnitPrice, setValue]);

  useEffect(() => {
    if (existingData) {
      const formValues = mapApiResponseToForm(existingData);
      reset(formValues);
    }
  }, [existingData, reset]);

  async function onSubmit(values: GoodsSupplyFormValues) {
    setCurrentFormValues(values);
    const previewData = mapFormToPreviewData(values, locale, cities);
    setFormDataForPreview(previewData);
    setShowPreview(true);
  }

  async function handlePreviewSubmit() {
    if (!currentFormValues) return null;

    const apiPayload = mapFormToApiPayload(currentFormValues);

    if (isEditMode && editId) {
      await updateGoodsSupply({ id: editId, data: apiPayload }).unwrap();
      return { id: editId, data: apiPayload };
    } else {
      await submitGoodsSupply(apiPayload).unwrap();
      return null;
    }
  }

  function handlePreviewClose() {
    setShowPreview(false);
    setFormDataForPreview(null);
  }

  if (isSaving || isUpdating || (isEditMode && isLoadingData)) return <GoodsSupplyFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("forms.supplyContract.title")}</h2>

        <div className="flex flex-col gap-4 p-1">
          <DatePicker
            label={t("forms.supplyContract.contract_date.label")}
            placeholder={t("forms.supplyContract.contract_date.placeholder")}
            locale={locale}
            value={watch("contract_date")}
            onChange={(date) => setValue("contract_date", date, { shouldValidate: true })}
            error={errors.contract_date?.message && t(errors.contract_date.message)}
          />

          <CitySelect
            label={t("forms.supplyContract.contract_city.label")}
            placeholder={t("forms.supplyContract.contract_city.placeholder")}
            value={watch("contract_city_id")}
            onChange={(cityId) => setValue("contract_city_id", cityId, { shouldValidate: true })}
            error={errors.contract_city_id?.message && t(errors.contract_city_id.message)}
          />

          <SearchableSelect<CommercialOrganization>
            label={t("forms.supplyContract.supplier_name.label")}
            placeholder={t("forms.supplyContract.supplier_name.placeholder")}
            searchPlaceholder={t("forms.supplyContract.supplier_name.placeholder")}
            options={commercialOrganizations}
            value={selectedOrganization}
            onChange={handleOrganizationChange}
            searchKeys={["name_ru", "name_kk", "bin"]}
            displayKey="name_ru"
            getOptionLabel={getOrganizationName}
            error={errors.commercial_org_id?.message && t(errors.commercial_org_id.message)}
          />

          <SearchableSelect<Bank>
            label={t("forms.supplyContract.bank.label")}
            placeholder={t("forms.supplyContract.bank.placeholder")}
            searchPlaceholder={t("forms.supplyContract.bank.searchPlaceholder")}
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
            label={t("forms.supplyContract.supplier_iban.label")}
            placeholder={t("forms.supplyContract.supplier_iban.placeholder")}
            {...register("counterparty_iban")}
            error={errors.counterparty_iban?.message && t(errors.counterparty_iban.message)}
          />

          <Input
            label={t("forms.supplyContract.delivery_address.label")}
            placeholder={t("forms.supplyContract.delivery_address.placeholder")}
            {...register("delivery_address")}
            error={errors.delivery_address?.message && t(errors.delivery_address.message)}
          />

          <Input
            label={t("forms.supplyContract.delivery_days.label")}
            placeholder={t("forms.supplyContract.delivery_days.placeholder")}
            onlyNumber
            {...register("delivery_days", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.delivery_days?.message && t(errors.delivery_days.message)}
          />

          <Input
            label={t("forms.supplyContract.payment_days.label")}
            placeholder={t("forms.supplyContract.payment_days.placeholder")}
            onlyNumber
            {...register("payment_days", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.payment_days?.message && t(errors.payment_days.message)}
          />

          <Input
            label={t("forms.supplyContract.court_location.label")}
            placeholder={t("forms.supplyContract.court_location.placeholder")}
            {...register("court_location")}
            error={errors.court_location?.message && t(errors.court_location.message)}
          />

          <Input
            label={t("forms.supplyContract.product_name.label")}
            placeholder={t("forms.supplyContract.product_name.placeholder")}
            {...register("product_name")}
            error={errors.product_name?.message && t(errors.product_name.message)}
          />

          <Input
            label={t("forms.supplyContract.product_model.label")}
            placeholder={t("forms.supplyContract.product_model.placeholder")}
            {...register("product_model")}
            error={errors.product_model?.message && t(errors.product_model.message)}
          />

          <Input
            label={t("forms.supplyContract.product_manufacturer.label")}
            placeholder={t("forms.supplyContract.product_manufacturer.placeholder")}
            {...register("product_manufacturer")}
            error={errors.product_manufacturer?.message && t(errors.product_manufacturer.message)}
          />

          <Input
            label={t("forms.supplyContract.product_power.label")}
            placeholder={t("forms.supplyContract.product_power.placeholder")}
            {...register("product_power")}
            error={errors.product_power?.message && t(errors.product_power.message)}
          />

          <Input
            label={t("forms.supplyContract.product_voltage.label")}
            placeholder={t("forms.supplyContract.product_voltage.placeholder")}
            {...register("product_voltage")}
            error={errors.product_voltage?.message && t(errors.product_voltage.message)}
          />

          <Input
            label={t("forms.supplyContract.product_material.label")}
            placeholder={t("forms.supplyContract.product_material.placeholder")}
            {...register("product_material")}
            error={errors.product_material?.message && t(errors.product_material.message)}
          />

          <Input
            label={t("forms.supplyContract.product_package.label")}
            placeholder={t("forms.supplyContract.product_package.placeholder")}
            {...register("product_package")}
            error={errors.product_package?.message && t(errors.product_package.message)}
          />

          <Input
            label={t("forms.supplyContract.product_size.label")}
            placeholder={t("forms.supplyContract.product_size.placeholder")}
            {...register("product_size")}
            error={errors.product_size?.message && t(errors.product_size.message)}
          />

          <Input
            label={t("forms.supplyContract.product_weight.label")}
            placeholder={t("forms.supplyContract.product_weight.placeholder")}
            {...register("product_weight")}
            error={errors.product_weight?.message && t(errors.product_weight.message)}
          />

          <Input
            label={t("forms.supplyContract.product_quantity.label")}
            placeholder={t("forms.supplyContract.product_quantity.placeholder")}
            onlyNumber
            {...register("product_quantity", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.product_quantity?.message && t(errors.product_quantity.message)}
          />

          <Input
            label={t("forms.supplyContract.product_unit_price.label")}
            placeholder={t("forms.supplyContract.product_unit_price.placeholder")}
            onlyNumber
            {...register("product_unit_price")}
            error={errors.product_unit_price?.message && t(errors.product_unit_price.message)}
          />

          <Input
            label={t("forms.supplyContract.product_delivery_place.label")}
            placeholder={t("forms.supplyContract.product_delivery_place.placeholder")}
            {...register("product_delivery_place")}
            error={errors.product_delivery_place?.message && t(errors.product_delivery_place.message)}
          />

          <Input
            label={t("forms.supplyContract.product_warranty_term.label")}
            placeholder={t("forms.supplyContract.product_warranty_term.placeholder")}
            onlyNumber
            {...register("product_warranty_term", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            error={errors.product_warranty_term?.message && t(errors.product_warranty_term.message)}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pb-1">
        <Button variant="primary" size="lg" type="submit" disabled={isSaving || isUpdating}>
          {isSaving || isUpdating ? t("forms.supplyContract.saving") : t("forms.supplyContract.preview")}
          {!isSaving && !isUpdating && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
      {showPreview && formDataForPreview && (
        <GoodsSupplyPreviewModal
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

