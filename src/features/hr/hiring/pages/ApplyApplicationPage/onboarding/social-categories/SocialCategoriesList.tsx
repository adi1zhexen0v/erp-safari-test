import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Add, ArrowDown2, ArrowUp2, Trash } from "iconsax-react";
import { useAppSelector } from "@/shared/hooks";
import { Button, FileViewer, Toast } from "@/shared/ui";
import { SOCIAL_CATEGORY_OPTIONS } from "@/features/hr/hiring";
import { useCreateSocialCategoryMutation, useDeleteSocialCategoryMutation, useGetSocialCategoriesQuery } from "./api";
import SocialCategoryForm from "./SocialCategoryForm";
import SocialCategoriesListSkeleton from "./SocialCategoriesListSkeleton";

interface Props {
  token: string;
  onSubmit: () => void;
}

export default function SocialCategoriesList({ token, onSubmit }: Props) {
  const { t } = useTranslation("ApplyApplicationPage");
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);

  const { data, isLoading } = useGetSocialCategoriesQuery(token);
  const [_, createState] = useCreateSocialCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteSocialCategoryMutation();

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

  async function handleAdd() {
    setIsAdding(false);
    setOpenIndex(list.length);
  }

  async function handleDelete(id: number) {
    try {
      await deleteCategory({ token, id }).unwrap();
      setToast({ color: "positive", text: "social.toast.delete_success" });
    } catch {
      setToast({ color: "negative", text: "social.toast.delete_error" });
    }
  }

  function getCategoryLabel(categoryType: string): string {
    const option = SOCIAL_CATEGORY_OPTIONS.find((opt) => opt.value === categoryType);
    return option ? t(`social.categories.${option.labelKey}`) : categoryType;
  }

  if (isLoading) {
    return <SocialCategoriesListSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-display-2xs content-base-primary">{t("social.title")}</h2>

        <Button
          variant="tertiary"
          size="lg"
          disabled={isAdding}
          onClick={() => {
            setIsAdding(true);
            setOpenIndex(null);
          }}
          className="self-start flex items-center gap-2">
          {t("social.add_more")}
          <Add size={20} color="currentColor" />
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {list.length > 0 &&
          list.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b pb-4 surface-base-stroke">
                  <button
                    type="button"
                    className="flex justify-between items-center flex-1 cursor-pointer"
                    onClick={() => toggleIndex(index)}>
                    <p className="text-body-bold-lg">{getCategoryLabel(item.category_type)}</p>

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
                  <div className="flex flex-col gap-4">
                    {item.issue_date && (
                      <div className="py-3 flex justify-between items-center border-b surface-base-stroke">
                        <span className="text-body-regular-md content-base-secondary">
                          {t("social.issue_date.label")}
                        </span>
                        <p className="text-body-bold-md content-base-primary">{item.issue_date}</p>
                      </div>
                    )}

                    {item.expiry_date && (
                      <div className="py-3 flex justify-between items-center border-b surface-base-stroke">
                        <span className="text-body-regular-md content-base-secondary">
                          {t("social.expiry_date.label")}
                        </span>
                        <p className="text-body-bold-md content-base-primary">{item.expiry_date}</p>
                      </div>
                    )}

                    {item.notes && (
                      <div className="py-3 flex flex-col gap-3 border-b surface-base-stroke">
                        <span className="text-body-regular-md content-base-secondary">{t("social.notes.label")}</span>
                        <p className="text-body-bold-md content-base-primary">{item.notes}</p>
                      </div>
                    )}

                    <div className="py-3 flex flex-col gap-3 ">
                      <span className="text-body-regular-md content-base-secondary">{t("social.document.label")}</span>
                      <FileViewer existingFileUrl={item.document_file_url} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {list.length === 0 && !isAdding && <p className="text-body-md content-base-secondary">{t("social.empty")}</p>}
      </div>

      {isAdding && (
        <div className="flex flex-col gap-6 pt-4">
          <SocialCategoryForm
            token={token}
            onCancel={() => setIsAdding(false)}
            onSuccess={handleAdd}
            onToast={(toast) => setToast(toast)}
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
          {t("social.submit_review")}
        </Button>
      </div>
    </div>
  );
}
