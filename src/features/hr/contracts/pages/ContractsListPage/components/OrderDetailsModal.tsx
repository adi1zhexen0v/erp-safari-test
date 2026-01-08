import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Import, Clock, TickCircle } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Prompt, Badge, FileViewer, type BadgeColor } from "@/shared/ui";
import { getOrderActions } from "@/features/hr/contracts/utils";
import type { JobApplicationStage } from "@/features/hr/contracts/types";

interface Props {
  candidateName: string;
  orderSignedPdfUrl: string | null;
  onClose: () => void;
  onUpload?: () => void;
  onPreview?: () => Promise<void>;
  isUploading?: boolean;
  isPreviewing?: boolean;
}

export default function OrderDetailsModal({
  candidateName,
  orderSignedPdfUrl,
  onClose,
  onUpload,
  onPreview,
  isUploading = false,
  isPreviewing = false,
}: Props) {
  const { t } = useTranslation("ContractsPage");

  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);

  const stage: JobApplicationStage = orderSignedPdfUrl ? "order_uploaded" : "order_pending";
  const actionsConfig = getOrderActions(stage);

  const getStatusConfig = (): { text: string; color: BadgeColor; icon: React.ReactNode } | null => {
    if (stage === "order_pending") {
      return {
        text: t("order.status.pending"),
        color: "notice",
        icon: <Clock size={14} color="currentColor" variant="Bold" />,
      };
    } else {
      return {
        text: t("order.status.uploaded"),
        color: "positive",
        icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
      };
    }
  };

  const statusConfig = getStatusConfig();
  const pdfUrl = orderSignedPdfUrl;

  return (
    <>
      {prompt && (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant={prompt.variant || "success"}
          onClose={() => setPrompt(null)}
          namespace="ContractsPage"
        />
      )}

      <ModalForm icon={DocumentText1} onClose={onClose} resize={false}>
        <div className="flex flex-col gap-6 h-full min-h-0">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke shrink-0">
            <h4 className="text-display-2xs content-base-primary">{t("order.title")}</h4>
          </div>

          <div className="flex-1 overflow-auto min-h-0 p-1">
            <div className="flex flex-col py-4">
              <div className="flex flex-col">
                {[
                  {
                    key: "candidateName",
                    label: t("order.candidateName"),
                    value: candidateName || "",
                    isBadge: false as const,
                  },
                  {
                    key: "status",
                    label: t("order.statusLabel"),
                    value: statusConfig?.text || "",
                    isBadge: true as const,
                    badgeConfig: statusConfig,
                  },
                  ...(pdfUrl
                    ? [
                        {
                          key: "pdfFile",
                          label: t("order.signedPdfFile"),
                          value: "",
                          isBadge: false as const,
                          isPdfFile: true as const,
                        },
                      ]
                    : []),
                ]
                  .filter((field) => field.value || field.isPdfFile)
                  .map((field, index, array) => {
                    if (field.isPdfFile && pdfUrl) {
                      return (
                        <div
                          key={field.key}
                          className={cn(
                            "py-3 flex flex-col gap-3",
                            index < array.length - 1 && "border-b surface-base-stroke",
                          )}>
                          <span className="text-body-regular-md content-base-secondary">{field.label}</span>
                          <FileViewer existingFileUrl={pdfUrl} />
                        </div>
                      );
                    }
                    return (
                      <div
                        key={field.key}
                        className={cn(
                          "py-3 flex items-center gap-3",
                          index < array.length - 1 && "border-b surface-base-stroke",
                        )}>
                        <span className="text-body-regular-md content-base-secondary flex-1 min-w-[132px]">
                          {field.label}
                        </span>
                        {field.isBadge && field.badgeConfig ? (
                          <Badge
                            variant="soft"
                            color={field.badgeConfig.color}
                            text={field.badgeConfig.text}
                            icon={field.badgeConfig.icon}
                          />
                        ) : (
                          <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {(actionsConfig.showUploadButton || actionsConfig.showDownloadButton) && (
            <div className="flex flex-col gap-2 pb-0.5 pl-0.5 shrink-0">
              {actionsConfig.showUploadButton && onUpload && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={isUploading}
                  onClick={() => onUpload()}>
                  <DocumentText1 size={16} color="currentColor" />
                  {isUploading ? t("order.actions.uploading") : t("order.actions.uploadScan")}
                </Button>
              )}

              {actionsConfig.showDownloadButton && onPreview && (
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled={isPreviewing}
                  onClick={() => onPreview()}>
                  <Import size={16} color="currentColor" />
                  {isPreviewing ? t("order.actions.downloading") : t("order.actions.download")}
                </Button>
              )}
            </div>
          )}
        </div>
      </ModalForm>
    </>
  );
}

