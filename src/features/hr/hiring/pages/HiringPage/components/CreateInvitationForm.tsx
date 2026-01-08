import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send2 } from "iconsax-react";
import {
  type CreateCandidateFormValues,
  createCandidateSchema,
  useHiringCreateCandidateMutation,
} from "@/features/hr/hiring";
import { Button, Input, ModalForm } from "@/shared/ui";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateInvitationForm({ onClose, onSuccess }: Props) {
  const { t } = useTranslation("HiringPage");

  const [createCandidate, { isLoading }] = useHiringCreateCandidateMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCandidateFormValues>({
    resolver: zodResolver(createCandidateSchema),
  });

  async function onSubmit(data: CreateCandidateFormValues) {
    try {
      setServerError(null);
      await createCandidate(data).unwrap();
      reset();
      onSuccess();
    } catch (err) {
      setServerError(t("invite.error"));
      console.error("Ошибка при создании кандидата", err);
    }
  }

  return (
    <ModalForm icon={Send2} onClose={onClose}>
      <form className="flex flex-col justify-between p-1 h-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke">
            <h4 className="text-display-2xs content-base-primary">{t("invite.title")}</h4>
            <p className="text-body-regular-sm content-base-secondary">{t("invite.subtitle")}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Input
              label={t("invite.name")}
              placeholder={t("invite.namePlaceholder")}
              {...register("candidate_name")}
              error={errors.candidate_name?.message ? t(errors.candidate_name.message as string) : undefined}
            />

            <Input
              label={t("invite.email")}
              placeholder={t("invite.emailPlaceholder")}
              {...register("email")}
              error={errors.email?.message ? t(errors.email.message as string) : undefined}
            />

            <Input
              label={t("invite.phone")}
              placeholder={t("invite.phonePlaceholder")}
              {...register("phone")}
              error={errors.phone?.message ? t(errors.phone.message as string) : undefined}
            />

            <Input
              label={t("invite.position")}
              placeholder={t("invite.positionPlaceholder")}
              {...register("job_position")}
              error={errors.job_position?.message ? t(errors.job_position.message as string) : undefined}
            />

            {serverError && <p className="text-negative-500">{serverError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] gap-3">
          <Button variant="secondary" className="py-3" onClick={onClose}>
            {t("invite.cancel")}
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading} className="py-3">
            {isLoading ? t("invite.loading") : t("invite.send")}
          </Button>
        </div>
      </form>
    </ModalForm>
  );
}
