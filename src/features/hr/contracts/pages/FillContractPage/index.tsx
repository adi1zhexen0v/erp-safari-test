import { useEffect, useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { useAppDispatch, useAppSelector, useScrollDetection } from "@/shared/hooks";
import { Button, StepsSwitcher, Toast, Prompt, PromptForm } from "@/shared/ui";
import { HR_CONTRACTS_PAGE_ROUTE } from "@/shared/utils";
import { useHiringGetApplicationDetailQuery } from "@/features/hr/hiring/api";
import type { ContractFormValues, SectionId, CreateContractDto } from "@/features/hr/contracts/types";
import { useCreateContractMutation } from "@/features/hr/contracts/api";
import { extractErrorMessage, ContractSchema } from "@/features/hr/contracts/utils";
import { DEFAULT_CONTRACT_VALUES, SECTION_FIELDS, SECTIONS } from "@/features/hr/contracts/consts";
import { setContractData, setSectionCompleteness, setReadyForSigning } from "@/features/hr/contracts/slice";
import { useLeaveProtection } from "@/features/hr/contracts/hooks";
import { ContractPreviewModal, FillContractHeader, FillContractPageSkeleton, SectionRenderer } from "./components";

export default function FillContractPage() {
  const { applicationId: applicationIdParam } = useParams<{ applicationId: string }>();
  const { t } = useTranslation("FillContractPage");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const savedData = useAppSelector((state) => state.workContract.data) as ContractFormValues | undefined;
  const completeness = useAppSelector((state) => state.workContract.sectionCompleteness);
  const applicationId = applicationIdParam ? Number(applicationIdParam) : undefined;

  const {
    data: applicationDetail,
    isLoading: isLoadingApplication,
    isError: isErrorApplication,
  } = useHiringGetApplicationDetailQuery(applicationId!, {
    skip: !applicationId,
  });

  const defaultValues = useMemo<ContractFormValues>(() => {
    const base = savedData ?? DEFAULT_CONTRACT_VALUES;
    if (applicationDetail) {
      return {
        ...base,
        employee_address_ru: base.employee_address_ru || applicationDetail.addresses?.registration || "",
        job_position_ru: base.job_position_ru || applicationDetail.job_position || "",
      };
    }
    return base;
  }, [savedData, applicationDetail]);

  const methods = useForm<ContractFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(ContractSchema),
    defaultValues,
  });

  useEffect(() => {
    if (applicationDetail) {
      if (!methods.getValues("employee_address_ru")) {
        methods.setValue("employee_address_ru", applicationDetail.addresses?.registration || "");
      }
      if (!methods.getValues("job_position_ru")) {
        methods.setValue("job_position_ru", applicationDetail.job_position || "");
      }
    }
  }, [applicationDetail, methods]);

  const { modalOpen, confirmNavigation, cancelNavigation, requestConfirmation } = useLeaveProtection(methods);

  const { scrollRef, hasScroll } = useScrollDetection();

  const [active, setActive] = useState<SectionId>("basic_info");
  const [sectionsWithErrors, setSectionsWithErrors] = useState<SectionId[]>([]);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState<{ title: string; text: string } | null>(null);
  const [previewData, setPreviewData] = useState<CreateContractDto | null>(null);

  const showWorkingHoursToast = useMemo(() => {
    return (
      active === "work_schedule" &&
      methods.formState.isSubmitted &&
      methods.formState.errors.work_end_time?.message === "validation.working_hours_four_or_eight"
    );
  }, [active, methods.formState.isSubmitted, methods.formState.errors.work_end_time?.message]);

  const [createContract, { isLoading: isCreatingContract }] = useCreateContractMutation();

  const isFieldFilled = (fieldName: keyof ContractFormValues, values: ContractFormValues): boolean => {
    const value = values[fieldName];

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return false;
      return value.every((item) => {
        if (typeof item === "string") {
          return item.trim().length > 0;
        }
        return item !== null && item !== undefined;
      });
    }

    if (typeof value === "boolean") {
      return true;
    }

    if (typeof value === "number") {
      return !isNaN(value) && value !== undefined;
    }

    return value !== undefined && value !== null;
  };

  const shouldCheckOptionalField = (fieldName: keyof ContractFormValues, values: ContractFormValues): boolean => {
    if (fieldName === "break_start_time" || fieldName === "break_end_time") {
      return values.has_break === true;
    }

    if (fieldName === "trial_duration_months") {
      return values.trial_period === true;
    }

    return true;
  };

  useEffect(() => {
    const subscription = methods.watch((_, { name }) => {
      if (!name) return;

      const found = Object.entries(SECTION_FIELDS).find(([_, fields]) => {
        if (name.includes(".")) {
          const fieldName = name.split(".")[0];
          return fields.includes(fieldName);
        }
        return fields.includes(name as keyof ContractFormValues);
      });
      if (!found) return;

      const section = found[0] as SectionId;
      const sectionFields = SECTION_FIELDS[section];

      methods.trigger(name).then(() => {
        const errors = methods.formState.errors;
        const values = methods.getValues();

        const valid = sectionFields.every((f) => {
          if (typeof f === "string" && f.includes(".")) {
            return true;
          }
          const fieldName = f as keyof ContractFormValues;

          if (!shouldCheckOptionalField(fieldName, values)) {
            return true;
          }

          const hasError = errors[fieldName];
          if (hasError) {
            if (fieldName === "job_duties_ru" || fieldName === "job_duties_kk") {
              if (Array.isArray(hasError)) {
                if (hasError.some((e) => e)) return false;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }

          return isFieldFilled(fieldName, values);
        });

        dispatch(
          setSectionCompleteness({
            section,
            complete: valid,
          }),
        );
      });
    });

    return () => subscription.unsubscribe();
  }, [methods.watch, dispatch, methods]);

  function handleChangeSection(next: string) {
    setActive(next as SectionId);
  }

  async function handlePreview() {
    const isValid = await methods.trigger();

    if (!isValid) {
      const errors = methods.formState.errors;
      const bad: SectionId[] = [];

      for (const s of SECTIONS) {
        if (
          SECTION_FIELDS[s.id].some((f) => {
            const fieldName = f as keyof ContractFormValues;
            return errors[fieldName];
          })
        ) {
          bad.push(s.id);
        }
      }

      setSectionsWithErrors(bad);
      setShowGlobalError(true);
      return;
    }

    setShowGlobalError(false);
    setSectionsWithErrors([]);

    const formValues = methods.getValues();

    dispatch(setContractData(formValues));

    const contractData: CreateContractDto = {
      application_id: applicationId!,
      sign_date: formValues.sign_date,
      start_date: formValues.start_date,
      work_city_id: formValues.work_city_id!,
      job_position_ru: formValues.job_position_ru,
      job_position_kk: formValues.job_position_kk,
      job_duties_ru: formValues.job_duties_ru,
      job_duties_kk: formValues.job_duties_kk,
      trial_period: formValues.trial_period,
      trial_duration_months: formValues.trial_period ? formValues.trial_duration_months : undefined,
      work_start_time: formValues.work_start_time,
      work_end_time: formValues.work_end_time,
      break_start_time: formValues.has_break ? formValues.break_start_time : undefined,
      break_end_time: formValues.has_break ? formValues.break_end_time : undefined,
      working_days_list: formValues.working_days_list,
      salary_amount: formValues.salary_amount,
      employee_address_ru: formValues.employee_address_ru,
      employee_address_kk: formValues.employee_address_kk,
      is_online: formValues.is_online,
    };

    setPreviewData(contractData);
    setIsPreviewOpen(true);
  }

  async function handleCreateContract() {
    if (!previewData || !applicationId) return;

    try {
      await createContract(previewData).unwrap();
      setIsPreviewOpen(false);
      setPreviewData(null);

      methods.reset();
      dispatch(setSectionCompleteness({ section: "basic_info", complete: false }));
      dispatch(setSectionCompleteness({ section: "position_duties", complete: false }));
      dispatch(setSectionCompleteness({ section: "work_schedule", complete: false }));

      dispatch(setReadyForSigning(true));

      setShowSuccessPrompt(true);
    } catch (error: unknown) {
      setIsPreviewOpen(false);

      const errorText = extractErrorMessage(error, "messages.contractCreateError", t) || "Не удалось создать контракт";

      setErrorPrompt({
        title: t("messages.errorTitle") || "Ошибка",
        text: errorText,
      });
    }
  }

  if (isLoadingApplication) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <div className="h-full flex flex-col">
          <FillContractPageSkeleton />
        </div>
      </>
    );
  }

  if (isErrorApplication || !applicationId || !applicationDetail) {
    return (
      <>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <div className="h-full flex flex-col">
          <FillContractHeader />
          <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
            <Prompt
              variant="error"
              title={t("messages.errorTitle") || "Ошибка"}
              text={t("messages.loadApplicationError") || "Не удалось загрузить данные заявки"}
              buttonText={t("prompt.ok") || "ОК"}
              onClose={() => navigate(HR_CONTRACTS_PAGE_ROUTE)}
              namespace="FillContractPage"
            />
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{t("meta.title")}</title>
      <meta name="description" content={t("meta.description")} />
      <FormProvider {...methods}>
        <div className="h-full flex flex-col">
          <FillContractHeader />

          <section className="p-7 rounded-[28px] surface-base-fill h-full overflow-hidden">
            <div ref={scrollRef} className={cn("h-full overflow-auto page-scroll", hasScroll && "pr-5", "page-scroll")}>
              <StepsSwitcher
                steps={SECTIONS.map((section) => ({
                  id: section.id,
                  label: t(`sections.${section.id}`),
                  icon: section.icon,
                }))}
                activeStep={active}
                onStepChange={handleChangeSection}
                completedSteps={Object.entries(completeness ?? {})
                  .filter(([_, isComplete]) => isComplete === true)
                  .map(([id]) => id)}
                errorSteps={sectionsWithErrors}
                className="surface-base-fill"
                contentClassName="flex flex-col justify-between">
                <>
                  <SectionRenderer id={active} />

                  <div className="mt-10 flex justify-end items-center gap-3">
                    {showGlobalError && <Toast color="negative" text={t("errors.fill_all_sections")} />}
                    {showWorkingHoursToast && (
                      <Toast color="negative" text={t("validation.working_hours_four_or_eight")} />
                    )}

                    <Button
                      variant="secondary"
                      size="lg"
                      type="button"
                      onClick={() => {
                        requestConfirmation(() => {
                          navigate(HR_CONTRACTS_PAGE_ROUTE);
                        });
                      }}>
                      {t("buttons.cancel")}
                    </Button>

                    <Button variant="primary" size="lg" type="button" onClick={handlePreview}>
                      {t("buttons.create_contract")}
                    </Button>
                  </div>
                </>
              </StepsSwitcher>
            </div>
          </section>

          {isPreviewOpen && previewData && (
            <ContractPreviewModal
              data={previewData}
              onClose={() => {
                setIsPreviewOpen(false);
                setPreviewData(null);
              }}
              onConfirm={handleCreateContract}
              isLoading={isCreatingContract}
              employee_full_name={
                applicationDetail?.personal_info
                  ? `${applicationDetail.personal_info.surname || ""} ${applicationDetail.personal_info.name || ""} ${applicationDetail.personal_info.father_name || ""}`.trim()
                  : undefined
              }
              employee_iin={applicationDetail?.personal_info?.iin}
              employee_id_number={applicationDetail?.id_documents?.national_id_number}
              employee_id_issued_by={applicationDetail?.id_documents?.national_id_issued_by}
              employee_id_issue_date={applicationDetail?.id_documents?.national_id_issue_date}
              employee_phone={applicationDetail?.contact_info?.phone}
              employee_address_registration={applicationDetail?.addresses?.registration}
            />
          )}

          {showSuccessPrompt && (
            <Prompt
              variant="success"
              title={t("messages.contractCreatedTitle")}
              text={t("messages.contractCreatedText")}
              buttonText={t("buttons.return_to_list")}
              onClose={() => {
                setShowSuccessPrompt(false);
                dispatch(setReadyForSigning(false));
                navigate(HR_CONTRACTS_PAGE_ROUTE);
              }}
              namespace="FillContractPage"
            />
          )}

          {errorPrompt && (
            <Prompt
              variant="error"
              title={errorPrompt.title}
              text={errorPrompt.text}
              buttonText={t("prompt.ok") || "ОК"}
              onClose={() => setErrorPrompt(null)}
              namespace="FillContractPage"
            />
          )}

          {modalOpen && (
            <PromptForm
              variant="error"
              title={t("leave_modal.title")}
              text={t("leave_modal.description")}
              confirmText={t("leave_modal.leave")}
              cancelText={t("leave_modal.stay")}
              onConfirm={confirmNavigation}
              onClose={cancelNavigation}
              namespace="FillContractPage"
            />
          )}
        </div>
      </FormProvider>
    </>
  );
}

