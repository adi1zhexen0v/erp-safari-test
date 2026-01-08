import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { FileUploader } from "@/shared/components";
import { useAppSelector } from "@/shared/hooks";
import { Button, Input, Toast, SearchableSelect } from "@/shared/ui";
import { BANKS, type Bank } from "@/shared/consts/banks";
import { useGetBankingQuery, useSubmitBankingMutation } from "./api";
import BankingFormSkeleton from "./BankingFormSkeleton";
import { type BankingFormValues, bankingSchema } from "./validation";

interface Props {
  token: string;
  openSubmit: () => void;
}

export default function BankingForm({ token, openSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);

  const { data, isLoading, error } = useGetBankingQuery(token);
  const [submitBanking, { isLoading: isSaving }] = useSubmitBankingMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const [isCertRemoved, setIsCertRemoved] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BankingFormValues>({
    resolver: zodResolver(bankingSchema),
    defaultValues: {
      bank_name: "",
      iban_account: "",
      bik_number: "",
      bank_certificate_file: null,
    },
  });

  const bankFromData = useMemo(() => {
    if (!data) return null;
    const foundByBik = data.bik_number ? BANKS.find((bank) => bank.bik === data.bik_number) : null;
    if (foundByBik) return foundByBik;

    const foundByName = data.bank_name ? BANKS.find((bank) => bank.name === data.bank_name) : null;
    return foundByName || null;
  }, [data]);

  useEffect(() => {
    if (data) {
      setIsCertRemoved(false);
      if (bankFromData) {
        setSelectedBank(bankFromData);
        reset({
          bank_name: bankFromData.name,
          iban_account: data.iban_account ?? "",
          bik_number: bankFromData.bik,
          bank_certificate_file: null,
        });
      } else {
        setSelectedBank(null);
        reset({
          bank_name: data.bank_name ?? "",
          iban_account: data.iban_account ?? "",
          bik_number: data.bik_number ?? "",
          bank_certificate_file: null,
        });
      }
    }
  }, [data, reset, bankFromData]);

  function handleBankChange(bank: Bank | null) {
    setSelectedBank(bank);
    if (bank) {
      setValue("bank_name", bank.name, { shouldValidate: true });
      setValue("bik_number", bank.bik, { shouldValidate: true });
    } else {
      setValue("bank_name", "", { shouldValidate: true });
      setValue("bik_number", "", { shouldValidate: true });
    }
  }

  async function onSubmit(values: BankingFormValues) {
    try {
      const hasFromApi = !!data?.bank_certificate_file_url && !isCertRemoved;
      const hasNewFile = !!values.bank_certificate_file;

      if (!hasFromApi && !hasNewFile) {
        setToast({ color: "negative", text: "validation.banking.file_required" });
        return;
      }

      await submitBanking({
        token,
        body: {
          bank_name: values.bank_name,
          iban_account: values.iban_account,
          bik_number: values.bik_number,
          bank_certificate_file: hasFromApi ? null : values.bank_certificate_file,
        },
      }).unwrap();

      setToast({ color: "positive", text: "banking.toast.success" });
    } catch {
      setToast({ color: "negative", text: "banking.toast.error" });
    }
  }

  const file = watch("bank_certificate_file");
  const isNotFound = error && "status" in error && error.status === 404;

  if (isLoading && !data && !isNotFound) return <BankingFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[620px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("banking.title")}</h2>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect<Bank>
              label={t("banking.bank_name.label")}
              placeholder={t("banking.bank_name.placeholder")}
              searchPlaceholder={t("banking.bank_name.searchPlaceholder")}
              options={BANKS}
              value={selectedBank}
              onChange={handleBankChange}
              searchKeys={["name", "bik"]}
              displayKey="name"
              error={
                errors.bank_name?.message
                  ? t(errors.bank_name.message)
                  : errors.bik_number?.message
                    ? t(errors.bik_number.message)
                    : undefined
              }
            />
            <Input
              label={t("banking.iban.label")}
              placeholder={t("banking.iban.placeholder")}
              {...register("iban_account")}
              error={errors.iban_account?.message && t(errors.iban_account.message)}
            />
          </div>

          <FileUploader
            label={t("banking.certificate.label")}
            value={file}
            existingFileUrl={!isCertRemoved ? data?.bank_certificate_file_url : null}
            onChange={(f) => {
              setValue("bank_certificate_file", f, { shouldValidate: true });
              if (f) setIsCertRemoved(false);
            }}
            onRemoveExisting={() => {
              setIsCertRemoved(true);
              setValue("bank_certificate_file", null);
            }}
            maxSizeMB={5}
            error={errors.bank_certificate_file?.message ? t(errors.bank_certificate_file.message as string) : null}
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        {toast && (
          <Toast
            key={`${toast.color}-${toast.text}`}
            color={toast.color}
            text={t(toast.text)}
            onClose={() => setToast(null)}
          />
        )}

        <Button variant="secondary" size="lg" disabled={!isCompleted || isSaving} onClick={openSubmit}>
          {t("banking.submit_review")}
        </Button>

        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("banking.saving") : t("banking.save")}
          {!isSaving && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
