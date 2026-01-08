import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Briefcase, Calendar, Call, Sms } from "iconsax-react";
import { Badge, Button, Input } from "@/shared/ui";
import ModalWrapper from "@/shared/ui/ModalWrapper";
import { formatDateForDisplay } from "@/shared/utils";
import {
  type GetApplicationsResponse,
  STATUS_MAP,
  type UseHiringActionsReturn,
  type UseHiringModalsReturn,
  type UseHiringMutationsReturn,
} from "@/features/hr/hiring";
import ApplicationActionsButtons from "./ApplicationActionsButtons";
import ShowApplicationModalWindow from "./ShowApplicationModalWindow";

interface Props {
  applications: GetApplicationsResponse[];
  onDownloadProfile: (id: number) => void;
  isDownloading: boolean;
  actions: UseHiringActionsReturn;
  modals: UseHiringModalsReturn;
  mutations: UseHiringMutationsReturn;
}

export default function HiringCardsView({
  applications,
  onDownloadProfile,
  isDownloading,
  actions,
  modals,
  mutations,
}: Props) {
  const { t } = useTranslation("HiringPage");
  const [showApplicationModal, setShowApplicationModal] = useState<number | null>(null);

  const selectedApplication = applications.find((app) => app.id === showApplicationModal);

  return (
    <>
      {showApplicationModal !== null && selectedApplication && (
        <ShowApplicationModalWindow
          id={showApplicationModal}
          onClose={() => setShowApplicationModal(null)}
          jobPosition={selectedApplication.job_position || ""}
          status={selectedApplication.status}
          has_contract={selectedApplication.has_contract}
          onApprove={(id) => actions.handleAction("approve", id, () => setShowApplicationModal(null))}
          onRevision={(id) => {
            setShowApplicationModal(null);
            modals.setRevisionModal({ id, notes: "" });
          }}
          onReject={(id) => {
            setShowApplicationModal(null);
            modals.setRejectModal({ id, reason: "" });
          }}
          onCreateContract={(id) => actions.handleAction("create_contract", id)}
          onDownloadProfile={onDownloadProfile}
          isDownloading={isDownloading}
          isReviewing={mutations.reviewingApplicationId === showApplicationModal}
          isRejecting={mutations.rejectingApplicationId === showApplicationModal}
          isCreatingContract={false}
        />
      )}

      {modals.revisionModal && (
        <ModalWrapper onClose={() => modals.setRevisionModal(null)}>
          <div className="flex flex-col gap-4">
            <h3 className="text-heading-lg content-base-primary">{t("modals.revisionTitle")}</h3>

            <div className="flex flex-col gap-2">
              <Input
                isTextarea
                placeholder={t("modals.revisionPlaceholder")}
                value={modals.revisionModal.notes}
                onChange={(e) => modals.setRevisionModal({ ...modals.revisionModal!, notes: e.target.value })}
              />

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={mutations.reviewingApplicationId === modals.revisionModal.id}
                onClick={() => {
                  if (modals.revisionModal) {
                    mutations.handleSendRevision(modals.revisionModal.id, modals.revisionModal.notes);
                    modals.setRevisionModal(null);
                  }
                }}>
                {mutations.reviewingApplicationId === modals.revisionModal.id ? t("modals.sending") : t("modals.send")}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {modals.rejectModal && (
        <ModalWrapper onClose={() => modals.setRejectModal(null)}>
          <div className="flex flex-col gap-4">
            <h3 className="text-heading-lg content-base-primary">{t("modals.rejectTitle")}</h3>

            <div className="flex flex-col gap-2">
              <Input
                isTextarea
                placeholder={t("modals.rejectPlaceholder")}
                value={modals.rejectModal.reason}
                onChange={(e) => modals.setRejectModal({ ...modals.rejectModal!, reason: e.target.value })}
              />

              <Button
                variant="destructive"
                className="w-full"
                disabled={mutations.rejectingApplicationId === modals.rejectModal.id}
                onClick={() => {
                  if (modals.rejectModal) {
                    mutations.handleSendReject(modals.rejectModal.id, modals.rejectModal.reason);
                    modals.setRejectModal(null);
                  }
                }}>
                {mutations.rejectingApplicationId === modals.rejectModal.id
                  ? t("modals.rejecting")
                  : t("actions.reject")}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {applications.map((app) => {
          return (
            <div
              key={app.id}
              className="flex flex-col gap-4 radius-lg border surface-base-stroke surface-base-fill p-5 transition-shadow duration-300 cursor-pointer hover:shadow-md"
              onClick={() => setShowApplicationModal(app.id)}>
              <div className="flex flex-col gap-2">
                <Badge
                  variant="soft"
                  color={STATUS_MAP[app.status].color}
                  text={t(STATUS_MAP[app.status].label)}
                  icon={STATUS_MAP[app.status].icon}
                />
                <p className="text-body-bold-lg content-base-primary">{app.candidate_name}</p>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col border-b surface-base-stroke py-3 gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Sms size={18} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">{app.invitation_email}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Call size={18} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">{app.phone}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Briefcase size={18} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">{app.job_position || "-"}</p>
                  </div>
                </div>

                <div className="flex flex-col pt-3 gap-1.5">
                  <p className="content-base-secondary text-body-bold-xs">{t("cards.dateInvited")}</p>

                  <div className="flex items-center gap-1.5">
                    <span className="content-action-brand">
                      <Calendar size={18} color="currentColor" />
                    </span>
                    <p className="text-body-regular-sm content-base-primary">
                      {formatDateForDisplay(app.invitation_date, false) || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <ApplicationActionsButtons
                application={app}
                isLoading={mutations.isLoading}
                reviewingApplicationId={mutations.reviewingApplicationId}
                rejectingApplicationId={mutations.rejectingApplicationId}
                onAction={actions.handleAction}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

