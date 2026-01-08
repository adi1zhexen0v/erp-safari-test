import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Add, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import { useAppSelector } from "@/shared/hooks";
import { Button, Toast } from "@/shared/ui";
import { useCreateEducationMutation, useDeleteEducationMutation, useGetEducationQuery } from "./api";
import EducationForm from "./EducationForm";
import EducationListSkeleton from "./EducationListSkeleton";
import type { EducationFormValues } from "./validation";

interface Props {
  token: string;
  onSubmit: () => void;
}

export default function EducationList({ token, onSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);

  const { data, isLoading } = useGetEducationQuery(token);
  const [createEducation, createState] = useCreateEducationMutation();
  const [deleteEducation, deleteState] = useDeleteEducationMutation();

  const list = data ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isAdding, setIsAdding] = useState(false);

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  function toggleIndex(index: number) {
    setOpenIndex((old) => (old === index ? null : index));
  }
  async function handleAdd(values: EducationFormValues) {
    if (!values.diploma_file) {
      setToast({ color: "negative", text: "validation.education.file_required" });
      return;
    }

    if (!values.diploma_transcript_file) {
      setToast({ color: "negative", text: "validation.education.transcript_required" });
      return;
    }

    try {
      await createEducation({
        token,
        body: {
          degree: values.degree,
          university_name: values.university_name,
          specialty: values.specialty,
          graduation_year: values.graduation_year,
          diploma_number: values.diploma_number,
          diploma_file: values.diploma_file,
          diploma_transcript_file: values.diploma_transcript_file,
        },
      }).unwrap();

      setToast({ color: "positive", text: "education.toast.success" });
      setIsAdding(false);
      setOpenIndex(list.length);
    } catch {
      setToast({ color: "negative", text: "education.toast.error" });
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteEducation({ token, id }).unwrap();
      setToast({ color: "positive", text: "education.toast.delete_success" });
    } catch {
      setToast({ color: "negative", text: "education.toast.delete_error" });
    }
  }

  if (isLoading) return <EducationListSkeleton />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-display-2xs content-base-primary">{t("education.title")}</h2>

        <Button
          variant="tertiary"
          size="lg"
          disabled={isAdding}
          onClick={() => {
            setIsAdding(true);
            setOpenIndex(null);
          }}
          className="self-start flex items-center gap-2">
          {t("education.add_more")}
          <Add size={20} color="currentColor" />
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {list.length > 0 &&
          list.map((item, index) => {
            const title = index === 0 ? t("education.title_main") : t("education.title_additional");

            const isOpen = openIndex === index;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b pb-4 surface-base-stroke">
                  <button
                    type="button"
                    className="flex justify-between items-center flex-1 cursor-pointer"
                    onClick={() => toggleIndex(index)}>
                    <p className="text-body-bold-lg">{title}</p>

                    <div className="flex items-center gap-2">
                      <span className="input-box-shadow radius-2xs w-6 h-6 flex items-center justify-center content-base-secondary">
                        {isOpen ? (
                          <ArrowUp2 size={16} color="currentColor" />
                        ) : (
                          <ArrowDown2 size={16} color="currentColor" />
                        )}
                      </span>
                      <Button
                        variant="destructive"
                        isIconButton
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteState.isLoading}
                        className="w-6! aspect-square! rounded-[4px]! p-0!">
                        <Trash size={16} color="currentColor" />
                      </Button>
                    </div>
                  </button>
                </div>

                {isOpen && (
                  <EducationForm
                    initialData={item}
                    isLoading={createState.isLoading}
                    onSubmit={handleAdd}
                    editable={false}
                  />
                )}
              </div>
            );
          })}

        {list.length === 0 && <p className="text-body-md content-base-secondary">{t("education.empty")}</p>}
      </div>

      {isAdding && (
        <div className="flex flex-col gap-6 pt-4">
          <EducationForm
            onSubmit={handleAdd}
            isLoading={createState.isLoading}
            isNew={true}
            editable={true}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {toast && (
        <Toast
          key={`${toast.color}-${toast.text}`}
          color={toast.color}
          text={t(toast.text)}
          isFullWidth
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-end pt-4">
        <Button variant="secondary" size="lg" disabled={!isCompleted || createState.isLoading} onClick={onSubmit}>
          {t("education.submit_review")}
        </Button>
      </div>
    </div>
  );
}
