import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentText1 } from "iconsax-react";
import { ModalForm, Button, DatePicker, Input, Select, Badge, Toast } from "@/shared/ui";
import { formatPrice } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import type { ServiceContractServiceItem } from "../../ServiceContractForm/types";
import { createCompletionActSchemaWithContext, type CompletionActSchemaType } from "../utils/validation";
import { mapFormToApiPayload } from "../utils/mappers";
import type { CompletionActListItem, CompletionActStatus } from "../types";

// Статусы АВР, которые считаются как "потраченные"
const USED_STATUSES: CompletionActStatus[] = ["pending_review", "approved"];

interface Props {
  parentContractId: number;
  serviceItems: ServiceContractServiceItem[];
  existingActs?: CompletionActListItem[];
  onClose: () => void;
  onSubmit: (payload: ReturnType<typeof mapFormToApiPayload>) => Promise<void>;
  isLoading?: boolean;
  hasBackground?: boolean;
}

export default function CompletionActCreateModal({
  parentContractId,
  serviceItems,
  existingActs = [],
  onClose,
  onSubmit,
  isLoading,
  hasBackground = true,
}: Props) {
  const { t, i18n } = useTranslation("LegalApplicationsPage");
  const locale = (i18n.language as Locale) || "ru";

  const [toast, setToast] = useState<{ text: string; color: "positive" | "negative" | "notice" | "grey" } | null>(null);

  // Временная схема для инициализации формы
  const initialSchema = useMemo(() => createCompletionActSchemaWithContext(null, existingActs), [existingActs]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(initialSchema),
    defaultValues: {
      parent_contract: parentContractId,
      service_item: null as number | null,
      period_start_date: null as Date | null,
      period_end_date: null as Date | null,
      amount: "",
      description: "",
    },
  });

  const watchedServiceItem = watch("service_item");
  const watchedAmount = watch("amount");
  const isServiceSelected = watchedServiceItem !== null;
  const previousServiceItemRef = useRef<number | null>(null);

  // Находим выбранный сервис
  const selectedService = useMemo(
    () => serviceItems.find((s) => s.id === watchedServiceItem) || null,
    [serviceItems, watchedServiceItem],
  );

  // Создаем актуальную схему валидации с учетом выбранного сервиса
  const validationSchema = useMemo(
    () => createCompletionActSchemaWithContext(selectedService, existingActs),
    [selectedService, existingActs],
  );

  useEffect(() => {
    // Устанавливаем значения только при изменении выбранного сервиса
    if (watchedServiceItem !== previousServiceItemRef.current) {
      previousServiceItemRef.current = watchedServiceItem;

      if (watchedServiceItem) {
        const service = serviceItems.find((s) => s.id === watchedServiceItem);
        if (service) {
          // Локальный расчёт остатка с учётом статусов
          const usedAmount = existingActs
            .filter((act) => act.service_item.id === watchedServiceItem && USED_STATUSES.includes(act.status))
            .reduce((sum, act) => sum + parseFloat(act.amount || "0"), 0);

          const servicePrice = parseFloat(service.price);
          const remaining = servicePrice - usedAmount;
          const amountToSet = Number.isInteger(remaining) ? String(Math.floor(remaining)) : remaining.toFixed(2);

          setValue("amount", amountToSet);
          setValue("period_start_date", service.start_date ? new Date(service.start_date) : null);
          setValue("period_end_date", service.end_date ? new Date(service.end_date) : null);
        }
      } else {
        setValue("amount", "");
        setValue("period_start_date", null);
        setValue("period_end_date", null);
      }
    }
  }, [watchedServiceItem, serviceItems, existingActs, setValue]);

  // Перевалидируем форму при изменении сервиса или суммы
  useEffect(() => {
    if (isServiceSelected) {
      // Используем актуальную схему для валидации
      trigger(["period_start_date", "period_end_date", "amount"]);
    }
  }, [selectedService, watchedAmount, trigger, isServiceSelected]);

  // Рассчитываем использованную сумму на основе existingActs с учётом статусов
  const usedAmountLocal = useMemo(() => {
    if (!selectedService) return 0;
    return existingActs
      .filter((act) => act.service_item.id === selectedService.id && USED_STATUSES.includes(act.status))
      .reduce((sum, act) => sum + parseFloat(act.amount || "0"), 0);
  }, [selectedService, existingActs]);

  // Для отображения "Уже рассчитано"
  const usedAmount = useMemo(() => {
    return usedAmountLocal > 0 ? usedAmountLocal : null;
  }, [usedAmountLocal]);

  const requestedAmount = useMemo(() => {
    if (!watchedAmount) return 0;
    return parseFloat(watchedAmount) || 0;
  }, [watchedAmount]);

  // Остаток всегда рассчитываем локально
  const calculatedRemaining = useMemo(() => {
    if (!selectedService) return null;
    const servicePrice = parseFloat(selectedService.price);
    return servicePrice - usedAmountLocal;
  }, [selectedService, usedAmountLocal]);

  // Проверяем, полностью ли израсходована сумма
  const isFullyUsed = calculatedRemaining !== null && calculatedRemaining <= 0;

  const serviceOptions = useMemo(() => {
    return serviceItems.map((service) => {
      // Локальный расчёт остатка с учётом статусов
      const usedForService = existingActs
        .filter((act) => act.service_item.id === service.id && USED_STATUSES.includes(act.status))
        .reduce((sum, act) => sum + parseFloat(act.amount || "0"), 0);
      const remaining = parseFloat(service.price) - usedForService;
      const hasRemaining = remaining > 0;

      return {
        value: service.id,
        label: `${service.service_name} (${formatPrice(service.price)} ₸)`,
        disabled: !hasRemaining,
      };
    });
  }, [serviceItems, existingActs]);

  async function onFormSubmit(data: typeof control._defaultValues) {
    setToast(null);

    // Валидация с актуальной схемой
    const isValid = await validationSchema.safeParseAsync(data);
    if (!isValid.success) {
      // Показываем первую ошибку через Toast
      const firstError = Object.values(isValid.error.flatten().fieldErrors)[0]?.[0];
      if (firstError) {
        setToast({
          color: "negative",
          text: firstError,
        });
      }
      return;
    }

    // Дополнительная проверка перед отправкой
    if (selectedService && calculatedRemaining !== null && requestedAmount > calculatedRemaining) {
      setToast({
        color: "negative",
        text: `Превышен остаток. Доступно: ${formatPrice(calculatedRemaining)} ₸`,
      });
      return;
    }

    try {
      const payload = mapFormToApiPayload(data as CompletionActSchemaType);
      await onSubmit(payload);
    } catch (error) {
      setToast({
        color: "negative",
        text: "Ошибка при создании АВР",
      });
    }
  }

  return (
    <ModalForm
      icon={DocumentText1}
      onClose={onClose}
      resize={false}
      allowCloseInOverlay={false}
      hasBackground={hasBackground}>
      <div className="flex flex-col gap-6 h-full min-h-0">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
          <h4 className="text-display-2xs content-base-primary">{t("completionAct.createTitle")}</h4>
          <p className="text-body-regular-sm content-base-secondary">{t("completionAct.createDescription")}</p>
        </div>

        {toast && (
          <Toast
            color={toast.color}
            text={toast.text}
            onClose={() => setToast(null)}
            autoClose={true}
            isFullWidth={true}
          />
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4 flex-1 overflow-auto min-h-0 p-1">
          {/* Dropdown с услугами */}
          <Controller
            name="service_item"
            control={control}
            render={({ field }) => (
              <Select
                label={t("completionAct.fields.serviceItem")}
                placeholder={t("completionAct.fields.serviceItemPlaceholder")}
                options={serviceOptions}
                value={field.value ?? undefined}
                onChange={(val) => field.onChange(val)}
                error={errors.service_item?.message}
              />
            )}
          />

          {/* Индикатор остатка */}
          {isServiceSelected && selectedService && calculatedRemaining !== null && (
            <div className="p-5 radius-lg surface-component-fill">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-label-sm content-base-secondary">Общая сумма сервиса:</span>
                  <span className="text-body-bold-md content-base-primary">{formatPrice(selectedService.price)} ₸</span>
                </div>
                {usedAmount !== null && usedAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm content-base-secondary">Уже рассчитано:</span>
                    <span className="text-body-regular-md content-base-primary">{formatPrice(usedAmount)} ₸</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t surface-base-stroke">
                  <span className="text-label-sm content-base-secondary">Осталось рассчитать:</span>
                  <Badge
                    variant="soft"
                    color={calculatedRemaining >= requestedAmount ? "positive" : "negative"}
                    text={`${formatPrice(calculatedRemaining)} ₸`}
                  />
                </div>
                {requestedAmount > 0 && calculatedRemaining < requestedAmount && (
                  <p className="text-label-md content-action-negative mt-1">
                    Превышен остаток на {formatPrice(requestedAmount - calculatedRemaining)} ₸
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Период — disabled пока не выбрана услуга, заполняется из service_item */}
          <Controller
            name="period_start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t("completionAct.fields.periodStartDate")}
                placeholder={t("completionAct.fields.selectDate")}
                value={field.value}
                onChange={(date) => field.onChange(date as Date | null)}
                mode="single"
                locale={locale}
                error={errors.period_start_date?.message}
                disabled={!isServiceSelected || isFullyUsed}
              />
            )}
          />

          <Controller
            name="period_end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label={t("completionAct.fields.periodEndDate")}
                placeholder={t("completionAct.fields.selectDate")}
                value={field.value}
                onChange={(date) => field.onChange(date as Date | null)}
                mode="single"
                locale={locale}
                error={errors.period_end_date?.message}
                disabled={!isServiceSelected || isFullyUsed}
              />
            )}
          />

          {/* Сумма — заполняется из остатка */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                label={t("completionAct.fields.amount")}
                placeholder={t("completionAct.fields.amountPlaceholder")}
                value={field.value}
                onChange={field.onChange}
                error={errors.amount?.message}
                onlyNumber
                disabled={!isServiceSelected || isFullyUsed}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                label={t("completionAct.fields.description")}
                placeholder={t("completionAct.fields.descriptionPlaceholder")}
                value={field.value}
                onChange={field.onChange}
                error={errors.description?.message}
                isTextarea
                disabled={!isServiceSelected || isFullyUsed}
              />
            )}
          />

          {isFullyUsed && (
            <Toast
              color="grey"
              text={t("completionAct.messages.fullyUsed")}
              closable={false}
              autoClose={false}
              isFullWidth
            />
          )}

          <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
            <Button variant="secondary" size="lg" onClick={onClose} disabled={isLoading}>
              {t("modals.cancel")}
            </Button>
            <Button type="submit" variant="primary" size="lg" disabled={isLoading || !isServiceSelected || isFullyUsed}>
              {isLoading ? t("modals.creating") : t("modals.create")}
            </Button>
          </div>
        </form>
      </div>
    </ModalForm>
  );
}
