import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Add, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { FileUploader } from "@/shared/components";
import { useAppSelector } from "@/shared/hooks";
import { Button, Toast } from "@/shared/ui";
import {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperienceQuery,
  useGetWorkProofStatusQuery,
  useUploadWorkProofMutation,
} from "./api";
import ExperienceForm from "./ExperienceForm";
import ExperienceListSkeleton from "./ExperienceListSkeleton";
import type { ExperienceFormValues } from "./validation";

interface Props {
  token: string;
  onSubmit: () => void;
}

export default function ExperienceList({ token, onSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");

  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);

  const { data: experienceData, isLoading: isExperienceLoading } = useGetExperienceQuery(token);

  const { data: proofStatus } = useGetWorkProofStatusQuery(token);

  const [createExperience, createState] = useCreateExperienceMutation();
  const [deleteExperience, deleteState] = useDeleteExperienceMutation();
  const [uploadWorkProof, uploadState] = useUploadWorkProofMutation();

  const [openId, setOpenId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [workProofFile, setWorkProofFile] = useState<File | null>(null);

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const list = experienceData ?? [];

  function toggleIndex(idx: number) {
    setOpenId((prev) => (prev === idx ? null : idx));
  }

  async function handleAdd(values: ExperienceFormValues) {
    setToast(null);

    try {
      await createExperience({
        token,
        body: {
          ...values,
          end_date: values.end_date ?? null,
        },
      }).unwrap();

      setToast({ color: "positive", text: "experience.toast.success" });
      setIsAdding(false);
    } catch (err) {
      setToast({ color: "negative", text: "experience.toast.error" });
      console.error("Ошибка при создании опыта работы", err);
    }
  }

  async function handleDelete(id: number) {
    setToast(null);

    try {
      await deleteExperience({ token, id }).unwrap();
      setToast({ color: "positive", text: "experience.toast.delete_success" });
    } catch {
      setToast({ color: "negative", text: "experience.toast.delete_error" });
    }
  }

  async function handleUpload() {
    if (!workProofFile) return;

    setToast(null);

    try {
      await uploadWorkProof({
        token,
        file: workProofFile,
      }).unwrap();

      setToast({
        color: "positive",
        text: "experience.proof.toast.success",
      });

      setWorkProofFile(null);
    } catch (e) {
      setToast({
        color: "negative",
        text: "experience.proof.toast.error",
      });
      console.error("Ошибка при загрузке справки с работы", e);
    }
  }

  if (isExperienceLoading) {
    return <ExperienceListSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-display-2xs content-base-primary">{t("experience.title")}</h2>

        <Button
          variant="tertiary"
          size="lg"
          disabled={isAdding}
          onClick={() => {
            setIsAdding(true);
            setOpenId(null);
          }}
          className="flex items-center gap-2">
          {t("experience.add")}
          <Add size={20} color="currentColor" />
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {list.length > 0 &&
          list.map((item, index) => {
            const title = index === 0 ? t("experience.primary_title") : t("experience.additional_title");

            const isOpen = openId === index;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-4 border-b surface-base-stroke gap-2">
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    className="flex justify-between items-center flex-1 cursor-pointer">
                    <p className="text-body-bold-lg">{item.organization_name}</p>

                    <span className="radius-2xs w-6 h-6 flex items-center justify-center content-base-secondary input-box-shadow">
                      {isOpen ? (
                        <ArrowUp2 size={16} color="currentColor" />
                      ) : (
                        <ArrowDown2 size={16} color="currentColor" />
                      )}
                    </span>
                  </button>

                  <Button
                    variant="destructive"
                    isIconButton
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteState.isLoading}
                    className="w-6! aspect-square! rounded-[4px]! p-0!">
                    <span className="text-white">
                      <Trash size={16} color="currentColor" />
                    </span>
                  </Button>
                </div>

                {isOpen && <ExperienceForm title={title} initialData={item} editable={false} />}
              </div>
            );
          })}

        {list.length === 0 && <p className="text-body-md content-base-secondary">{t("experience.empty")}</p>}
      </div>

      {isAdding && (
        <div className="flex flex-col gap-6 pt-4">
          <ExperienceForm
            title={list.length === 0 ? t("experience.primary_title") : t("experience.additional_title")}
            editable={true}
            onSubmit={handleAdd}
            onCancel={() => setIsAdding(false)}
            isLoading={createState.isLoading}
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <p className="text-body-bold-lg content-base-primary">{t("experience.proof.title")}</p>

        <FileUploader
          label={t("experience.proof.label")}
          value={workProofFile}
          existingFileUrl={proofStatus?.work_proof_file_url ?? null}
          onChange={setWorkProofFile}
          onRemoveExisting={() => setWorkProofFile(null)}
        />

        <div className="flex justify-end gap-3">
          {toast && (
            <Toast
              key={`${toast.color}-${toast.text}`}
              color={toast.color}
              text={t(toast.text)}
              isFullWidth
              onClose={() => setToast(null)}
            />
          )}

          <Button
            variant="secondary"
            size="lg"
            disabled={!proofStatus?.work_proof_file_url || !isCompleted || uploadState.isLoading}
            onClick={onSubmit}>
            {t("experience.proof.submit")}
          </Button>

          <Button
            variant="primary"
            size="lg"
            disabled={!workProofFile || uploadState.isLoading}
            onClick={handleUpload}
            className="flex items-center gap-2">
            {uploadState.isLoading ? t("experience.proof.saving") : t("experience.proof.save")}
            {!uploadState.isLoading && (
              <span className="text-white">
                <ArrowRightIcon />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
