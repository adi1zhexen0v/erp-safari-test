import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentText1, Import, Edit2, Clock, DocumentText, CloseCircle, TickCircle } from "iconsax-react";
import cn from "classnames";
import { ModalForm, Button, Prompt, Badge, FileViewer, type BadgeColor } from "@/shared/ui";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";
import { formatDateForDisplay } from "@/shared/utils";
import { getJobApplicationActions } from "@/features/hr/contracts/utils";
import type { JobApplicationStage, JobApplication } from "@/features/hr/contracts/types";

interface Props {
  candidateName: string;
  jobApplication: JobApplication | null;
  jobApplicationSignedPdfUrl: string | null;
  onClose: () => void;
  onReview?: (action: "approve" | "reject" | "revision") => void;
  onUpload?: () => void;
  onPreview?: () => void | Promise<void>;
  isReviewing?: boolean;
  isUploading?: boolean;
  isPreviewing?: boolean;
}

export default function JobApplicationDetailsModal({
  candidateName,
  jobApplication,
  jobApplicationSignedPdfUrl,
  onClose,
  onReview,
  onUpload,
  onPreview,
  isReviewing = false,
  isUploading = false,
  isPreviewing = false,
}: Props) {
  const { t } = useTranslation("ContractsPage");

  const [prompt, setPrompt] = useState<{ title: string; text: string; variant?: "success" | "error" } | null>(null);

  if (!jobApplication && !jobApplicationSignedPdfUrl) {
    return null;
  }

  const stage = jobApplication?.stage as JobApplicationStage | undefined;
  const actionsConfig = stage
    ? getJobApplicationActions(stage)
    : { showUploadButton: false, showDownloadButton: false, showReviewButtons: false };

  const getStatusConfig = (): { text: string; color: BadgeColor; icon: React.ReactNode } | null => {
    if (!stage) {
      if (jobApplicationSignedPdfUrl) {
        return {
          text: t("jobApplication.status.signed"),
          color: "positive",
          icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
        };
      }
      return null;
    }

    if (stage === "contract_signed") {
      return {
        text: t("jobApplication.status.contractSigned"),
        color: "info",
        icon: <DocumentText size={14} color="currentColor" />,
      };
    } else if (stage === "decision") {
      return {
        text: t("jobApplication.status.rejected"),
        color: "negative",
        icon: <CloseCircle size={14} color="currentColor" variant="Bold" />,
      };
    } else if (stage === "job_app_pending") {
      return {
        text: t("jobApplication.status.pending"),
        color: "notice",
        icon: <Clock size={14} color="currentColor" variant="Bold" />,
      };
    } else if (stage === "job_app_review") {
      return {
        text: t("jobApplication.status.waitingForDecision"),
        color: "notice",
        icon: <Clock size={14} color="currentColor" variant="Bold" />,
      };
    } else {
      return {
        text: t("jobApplication.status.signed"),
        color: "positive",
        icon: <TickCircle size={14} color="currentColor" variant="Bold" />,
      };
    }
  };

  const statusConfig = getStatusConfig();
  const pdfUrl = jobApplicationSignedPdfUrl || jobApplication?.signed_pdf_url || null;
  const shouldShowPdf = pdfUrl && stage !== "job_app_pending";

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
            <h4 className="text-display-2xs content-base-primary">{t("jobApplication.title")}</h4>
          </div>

          <div className="flex-1 overflow-auto min-h-0 p-1">
            <div className="flex flex-col py-4">
              <div className="flex flex-col">
                {[
                  {
                    key: "candidateName",
                    label: t("jobApplication.candidateName"),
                    value: candidateName || "",
                    isBadge: false as const,
                  },
                  {
                    key: "createdAt",
                    label: t("jobApplication.createdAt"),
                    value: jobApplication?.created_at ? formatDateForDisplay(jobApplication.created_at, false) : "",
                    isBadge: false as const,
                  },
                  {
                    key: "status",
                    label: t("jobApplication.statusLabel"),
                    value: statusConfig?.text || "",
                    isBadge: true as const,
                    badgeConfig: statusConfig,
                  },
                  {
                    key: "uploadedAt",
                    label: t("jobApplication.uploadedAt"),
                    value: jobApplication?.job_application_uploaded_at
                      ? formatDateForDisplay(jobApplication.job_application_uploaded_at, false)
                      : "",
                    isBadge: false as const,
                  },
                  {
                    key: "reviewedAt",
                    label: t("jobApplication.reviewedAt"),
                    value: jobApplication?.job_application_reviewed_at
                      ? formatDateForDisplay(jobApplication.job_application_reviewed_at, false)
                      : "",
                    isBadge: false as const,
                  },
                  {
                    key: "reviewedBy",
                    label: t("jobApplication.reviewedBy"),
                    value: jobApplication?.reviewed_by_name || "",
                    isBadge: false as const,
                  },
                  {
                    key: "reviewNote",
                    label: t("jobApplication.reviewNote"),
                    value: jobApplication?.job_application_review_note || "",
                    isBadge: false as const,
                  },
                  ...(shouldShowPdf
                    ? [
                        {
                          key: "pdfFile",
                          label: t("jobApplication.signedPdfFile"),
                          value: "",
                          isBadge: false as const,
                          isPdfFile: true as const,
                        },
                      ]
                    : []),
                ]
                  .filter((field) => field.value || field.isPdfFile)
                  .map((field, index, array) => {
                    if (field.isPdfFile && shouldShowPdf) {
                      return (
                        <div
                          key={field.key}
                          className={cn(
                            "py-3 flex flex-col gap-3",
                            index < array.length - 1 && "border-b surface-base-stroke",
                          )}>
                          <span className="text-body-regular-md content-base-secondary">{field.label}</span>
                          <FileViewer existingFileUrl={pdfUrl!} />
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

          <div className="flex flex-col gap-2 pb-0.5 pl-0.5 shrink-0">
            {actionsConfig.showUploadButton && onUpload && (
              <Button variant="primary" size="md" className="w-full" disabled={isUploading} onClick={() => onUpload()}>
                <DocumentText1 size={16} color="currentColor" />
                {isUploading ? t("jobApplication.actions.uploading") : t("jobApplication.actions.uploadScan")}
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
                {isPreviewing
                  ? t("jobApplication.actions.downloading")
                  : t("jobApplication.actions.downloadApplication")}
              </Button>
            )}

            {actionsConfig.showReviewButtons && onReview && (
              <>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={isReviewing}
                  onClick={() => onReview("approve")}>
                  <CheckIcon />
                  {isReviewing ? t("jobApplication.actions.reviewing") : t("jobApplication.actions.approve")}
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled={isReviewing}
                  onClick={() => onReview("revision")}>
                  <Edit2 size={16} color="currentColor" />
                  {t("jobApplication.actions.revision")}
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  disabled={isReviewing}
                  onClick={() => onReview("reject")}>
                  <CloseIcon />
                  {t("jobApplication.actions.reject")}
                </Button>
              </>
            )}
          </div>
        </div>
      </ModalForm>
    </>
  );
}

