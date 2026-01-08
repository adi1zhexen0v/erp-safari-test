import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, DocumentText1, ArrowDown2, ArrowUp2 } from "iconsax-react";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { Prompt } from "@/shared/ui";
import { TrustMeStatus, StatusIndicator } from "@/shared/components";
import {
  AMENDMENT_STATUS_MAPPING,
  AMENDMENT_DEFAULT,
  JOB_APPLICATION_STATUS_MAPPING,
  JOB_APPLICATION_DEFAULT,
  ORDER_STATUS_MAPPING,
  ORDER_DEFAULT,
  RESIGNATION_STATUS_MAPPING,
} from "@/shared/components/StatusIndicator/mappings";
import { formatDateForDisplay } from "@/shared/utils";
import type { Locale } from "@/shared/utils/types";
import { AmendmentDetailsModal } from "@/features/hr/amendments";
import { ResignationLetterDetailsModal } from "@/features/hr/resignation-letters";
import type { ResignationLetterResponse } from "@/features/hr/resignation-letters";
import type { AmendmentResponse, ListContractsResponse } from "@/features/hr/contracts/types";
import { getAmendmentText } from "@/features/hr/contracts/utils";
import { useContractsActions, useApplicationItems } from "@/features/hr/contracts/hooks";
import type { ApplicationItem } from "@/features/hr/contracts/hooks";
import ContractActionsButtons from "./ContractActionsButtons";
import JobApplicationDetailsModal from "./JobApplicationDetailsModal";
import OrderDetailsModal from "./OrderDetailsModal";
import UploadJobApplicationModal from "./UploadJobApplicationModal";
import UploadOrderModal from "./UploadOrderModal";

interface GroupedContract {
  contract: ListContractsResponse;
  resignationLetters: ResignationLetterResponse[];
  amendments: AmendmentResponse[];
}

interface Props {
  contracts: GroupedContract[];
  locale: Locale;
  refetchContracts?: () => void;
}

type SelectedModal =
  | { type: "job_application"; candidateId: number | null; contractId: number }
  | { type: "order"; candidateId: number | null; contractId: number }
  | { type: "resignation_letter"; resignationId: number }
  | { type: "amendment"; amendmentId: number }
  | null;

function insertNumberAfterFirstWord(text: string, number: number): string {
  const words = text.split(" ");
  if (words.length > 1) {
    return `${words[0]} №${number} ${words.slice(1).join(" ")}`;
  }
  return `${text} №${number}`;
}

export default function ContractsCardsView({ contracts, locale, refetchContracts }: Props) {
  const { t } = useTranslation("ContractsPage");
  const {
    isLoading,
    prompt,
    setPrompt,
    handleAction,
    downloadingContractId,
    previewingContractId,
    submittingContractId,
    previewingJobApplicationCandidateId,
    reviewingJobApplicationCandidateId,
    previewingOrderCandidateId,
    completingHiringCandidateId,
    uploadJobApplicationModal,
    setUploadJobApplicationModal,
    uploadOrderModal,
    setUploadOrderModal,
    handleReviewJobApplication,
    handleUploadOrder,
    handlePreviewOrder,
  } = useContractsActions();

  const [selectedModal, setSelectedModal] = useState<SelectedModal>(null);
  const [expandedApplications, setExpandedApplications] = useState<Set<number>>(new Set());

  const applicationItemsMap = useApplicationItems({ contracts });

  const contractsById = useMemo(() => {
    const map = new Map<number, ListContractsResponse>();
    contracts.forEach(({ contract }) => {
      map.set(contract.id, contract);
    });
    return map;
  }, [contracts]);

  const toggleApplicationsExpansion = useCallback((contractId: number) => {
    setExpandedApplications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contractId)) {
        newSet.delete(contractId);
      } else {
        newSet.add(contractId);
      }
      return newSet;
    });
  }, []);

  const selectedJobApplicationContract =
    selectedModal?.type === "job_application" ? contractsById.get(selectedModal.contractId) || null : null;

  const selectedOrderContract =
    selectedModal?.type === "order" ? contractsById.get(selectedModal.contractId) || null : null;

  return (
    <>
      {prompt && (
        <Prompt
          variant={prompt.variant || "success"}
          title={prompt.title}
          text={prompt.text}
          onClose={() => setPrompt(null)}
          namespace="ContractsPage"
        />
      )}
      {previewingContractId !== null && (
        <Prompt
          loaderMode={true}
          loaderText={t("messages.downloadingDraft") || "Скачивание черновика"}
          title=""
          text=""
          onClose={() => {}}
          namespace="ContractsPage"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
        {contracts.map(({ contract, resignationLetters, amendments }) => {
          const applicationItems = applicationItemsMap.get(contract.id) || [];

          const sortedApplicationItems = [...applicationItems].sort((a, b) => {
            const getTypePriority = (type: ApplicationItem["type"]): number => {
              if (type === "order") return 2;
              if (type === "job_application") return 3;
              return 1;
            };

            const priorityA = getTypePriority(a.type);
            const priorityB = getTypePriority(b.type);

            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            const dateA = a.date || "";
            const dateB = b.date || "";
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });

          const isExpanded = expandedApplications.has(contract.id);
          const shouldLimit = sortedApplicationItems.length > 3 && !isExpanded;
          const displayedApplications = shouldLimit ? sortedApplicationItems.slice(0, 3) : sortedApplicationItems;
          const hiddenCount = sortedApplicationItems.length - 3;

          return (
            <div
              key={contract.id}
              className="flex flex-col gap-4 radius-lg border surface-base-stroke surface-base-fill p-5">
              <div className="flex flex-col gap-2">
                <TrustMeStatus trustmeStatus={contract.trustme_status} locale={locale} />
                <p className="text-body-bold-lg content-base-primary">
                  {t("cards.contract")} №{contract.contract_number}
                </p>
              </div>

              <div className="p-2 radius-sm border surface-base-stroke flex items-center justify-between cursor-pointer">
                <div className="flex justify-start items-center gap-2">
                  <div className="w-8 aspect-square rounded-full flex items-center justify-center background-brand-subtle">
                    <span className="text-black text-[14px] font-medium leading-3">
                      {contract.candidate_name.charAt(0)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-label-sm content-base-primary">{contract.candidate_name}</p>
                    {locale === "kk"
                      ? contract.job_position_kk && (
                          <span className="text-body-regular-xs content-base-secondary">
                            {contract.job_position_kk}
                          </span>
                        )
                      : contract.job_position_ru && (
                          <span className="text-body-regular-xs content-base-secondary">
                            {contract.job_position_ru}
                          </span>
                        )}
                  </div>
                </div>

                <span className="content-base-secondary">
                  <ArrowRightIcon />
                </span>
              </div>

              <div className="flex flex-col gap-3 py-3 border-t border-b surface-base-stroke">
                <div className="flex flex-col gap-1.5">
                  <p className="text-body-bold-xs content-base-secondary">{t("cards.managerSigned")}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Calendar size={16} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">
                      {contract.trustme_document?.manager_signed_at
                        ? formatDateForDisplay(contract.trustme_document.manager_signed_at)
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-body-bold-xs content-base-secondary">{t("cards.employeeSigned")}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Calendar size={16} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">
                      {contract.trustme_document?.employee_signed_at
                        ? formatDateForDisplay(contract.trustme_document.employee_signed_at)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <p className="text-body-bold-xs content-base-secondary">{t("cards.createdAt")}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Calendar size={16} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">
                      {contract.created_at ? formatDateForDisplay(contract.created_at) : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {applicationItems.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t surface-base-stroke pt-3">
                  <span className="text-body-bold-xs content-base-secondary">{t("cards.letters")}</span>
                  <div className="flex flex-col gap-2">
                    {displayedApplications.map((item) => {
                      if (item.type === "job_application") {
                        return (
                          <div
                            key={`job_application-${item.contractId}`}
                            className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModal({
                                type: "job_application",
                                candidateId: item.candidateId,
                                contractId: item.contractId,
                              });
                            }}>
                            <span className="content-action-brand">
                              <DocumentText1 size={16} color="currentColor" />
                            </span>
                            <span className="flex-1 text-body-regular-sm content-base-primary">
                              {t("cards.jobApplicationPrefix")}
                            </span>
                            <StatusIndicator
                              value={contract.candidate_stage}
                              mapping={JOB_APPLICATION_STATUS_MAPPING}
                              defaultMapping={JOB_APPLICATION_DEFAULT}
                            />
                          </div>
                        );
                      }

                      if (item.type === "order") {
                        return (
                          <div
                            key={`order-${item.contractId}`}
                            className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModal({
                                type: "order",
                                candidateId: item.candidateId,
                                contractId: item.contractId,
                              });
                            }}>
                            <span className="content-action-brand">
                              <DocumentText1 size={16} color="currentColor" />
                            </span>
                            <span className="flex-1 text-body-regular-sm content-base-primary">
                              {t("order.fullPrefix")}
                            </span>
                            <StatusIndicator
                              value={contract.candidate_stage}
                              mapping={ORDER_STATUS_MAPPING}
                              defaultMapping={ORDER_DEFAULT}
                            />
                          </div>
                        );
                      }

                      if (item.type === "resignation_letter") {
                        const resignation = resignationLetters.find((r) => r.id === item.resignationId);
                        if (!resignation) return null;
                        return (
                          <div
                            key={`resignation-${item.resignationId}`}
                            className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModal({
                                type: "resignation_letter",
                                resignationId: item.resignationId,
                              });
                            }}>
                            <span className="content-action-brand">
                              <DocumentText1 size={16} color="currentColor" />
                            </span>
                            <span className="flex-1 text-body-regular-sm content-base-primary">
                              {insertNumberAfterFirstWord(t("cards.resignationLetterPrefix"), resignation.id)}
                            </span>
                            <StatusIndicator value={resignation.status} mapping={RESIGNATION_STATUS_MAPPING} />
                          </div>
                        );
                      }

                      if (item.type === "amendment") {
                        const amendment = amendments.find((a) => a.id === item.amendmentId);
                        if (!amendment) return null;
                        return (
                          <div
                            key={`amendment-${item.amendmentId}`}
                            className="flex items-center gap-1.5 cursor-pointer hover:background-base-subtle transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModal({
                                type: "amendment",
                                amendmentId: item.amendmentId,
                              });
                            }}>
                            <span className="content-action-brand">
                              <DocumentText1 size={16} color="currentColor" />
                            </span>
                            <span className="flex-1 text-body-regular-sm content-base-primary">
                              {insertNumberAfterFirstWord(
                                getAmendmentText(amendment.clause.section_number, t),
                                amendment.amendment_number,
                              )}
                            </span>
                            <StatusIndicator
                              value={amendment.status}
                              mapping={AMENDMENT_STATUS_MAPPING}
                              defaultMapping={AMENDMENT_DEFAULT}
                            />
                          </div>
                        );
                      }

                      return null;
                    })}

                    {sortedApplicationItems.length > 3 && (
                      <button
                        type="button"
                        className="flex items-center justify-center gap-1.5 text-body-regular-sm content-action-brand hover:content-action-brand-hover transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleApplicationsExpansion(contract.id);
                        }}>
                        {isExpanded ? (
                          <>
                            {t("cards.hideApplications")}
                            <ArrowUp2 size={16} color="currentColor" />
                          </>
                        ) : (
                          <>
                            {t("cards.showMoreApplications", { count: hiddenCount })}
                            <ArrowDown2 size={16} color="currentColor" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <ContractActionsButtons
                contract={contract}
                isLoading={isLoading}
                downloadingContractId={downloadingContractId}
                previewingContractId={previewingContractId}
                submittingContractId={submittingContractId}
                previewingJobApplicationCandidateId={previewingJobApplicationCandidateId}
                reviewingJobApplicationCandidateId={reviewingJobApplicationCandidateId}
                previewingOrderCandidateId={previewingOrderCandidateId}
                completingHiringCandidateId={completingHiringCandidateId}
                onAction={handleAction}
              />
            </div>
          );
        })}
      </div>

      {selectedModal?.type === "resignation_letter" && (
        <ResignationLetterDetailsModal
          resignationId={selectedModal.resignationId}
          onClose={() => setSelectedModal(null)}
        />
      )}

      {selectedModal?.type === "job_application" && selectedJobApplicationContract && (
        <JobApplicationDetailsModal
          candidateName={selectedJobApplicationContract.candidate_name}
          jobApplication={selectedJobApplicationContract.job_application}
          jobApplicationSignedPdfUrl={selectedJobApplicationContract.job_application_signed_pdf_url}
          onClose={() => setSelectedModal(null)}
          onReview={
            selectedModal.candidateId !== null
              ? async (action) => {
                  await handleReviewJobApplication(selectedModal.candidateId!, action);
                  refetchContracts?.();
                }
              : undefined
          }
          onUpload={
            selectedModal.candidateId !== null
              ? async () => {
                  await handleAction(
                    "upload_job_application",
                    selectedJobApplicationContract.id,
                    selectedJobApplicationContract,
                  );
                }
              : undefined
          }
          onPreview={
            selectedModal.candidateId !== null
              ? async () => {
                  await handleAction(
                    "preview_job_application",
                    selectedJobApplicationContract.id,
                    selectedJobApplicationContract,
                  );
                }
              : undefined
          }
          isReviewing={
            selectedModal.candidateId !== null
              ? reviewingJobApplicationCandidateId === selectedModal.candidateId
              : false
          }
          isUploading={
            selectedModal.candidateId !== null
              ? uploadJobApplicationModal?.candidateId === selectedModal.candidateId
              : false
          }
          isPreviewing={
            selectedModal.candidateId !== null
              ? previewingJobApplicationCandidateId === selectedModal.candidateId
              : false
          }
        />
      )}

      {uploadJobApplicationModal && (
        <UploadJobApplicationModal
          candidateId={uploadJobApplicationModal.candidateId}
          onClose={() => setUploadJobApplicationModal(null)}
          onSuccess={async () => {
            await refetchContracts?.();
          }}
          onPrompt={(promptData) => {
            setPrompt(promptData);
          }}
        />
      )}

      {uploadOrderModal && uploadOrderModal.candidateId && (
        <UploadOrderModal
          candidateId={uploadOrderModal.candidateId}
          onClose={() => setUploadOrderModal(null)}
          onSuccess={async () => {
            await refetchContracts?.();
          }}
          onPrompt={(promptData) => {
            setPrompt(promptData);
          }}
        />
      )}

      {selectedModal?.type === "order" && selectedOrderContract && (
        <OrderDetailsModal
          candidateName={selectedOrderContract.candidate_name}
          orderSignedPdfUrl={selectedOrderContract.order_signed_pdf_url}
          onClose={() => setSelectedModal(null)}
          onUpload={
            selectedModal.candidateId !== null
              ? () => {
                  handleUploadOrder(selectedModal.candidateId!);
                }
              : undefined
          }
          onPreview={
            selectedModal.candidateId !== null
              ? async () => {
                  await handlePreviewOrder(selectedModal.candidateId!);
                }
              : undefined
          }
          isUploading={
            selectedModal.candidateId !== null ? uploadOrderModal?.candidateId === selectedModal.candidateId : false
          }
          isPreviewing={
            selectedModal.candidateId !== null ? previewingOrderCandidateId === selectedModal.candidateId : false
          }
        />
      )}

      {selectedModal?.type === "amendment" && (
        <AmendmentDetailsModal amendmentId={selectedModal.amendmentId} onClose={() => setSelectedModal(null)} />
      )}
    </>
  );
}

