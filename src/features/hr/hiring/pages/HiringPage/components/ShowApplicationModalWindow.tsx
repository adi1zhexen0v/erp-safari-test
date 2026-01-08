import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import {
  Alarm,
  Bank,
  Briefcase,
  Call,
  Location,
  Note,
  People,
  Profile,
  Teacher,
  Import,
  Edit2,
  DocumentText,
} from "iconsax-react";
import { formatDateForDisplay, type Locale } from "@/shared/utils";
import { Button, FileViewer, ModalForm, StepsSwitcher } from "@/shared/ui";
import { CheckIcon, CloseIcon } from "@/shared/assets/icons";
import { useScrollDetection } from "@/shared/hooks";
import { TabsWithScroll } from "@/shared/components";
import {
  useHiringGetApplicationDetailQuery,
  type ApplicationDetailResponse,
  type ApplicationStatus,
} from "@/features/hr/hiring";
import ShowApplicationModalSkeleton from "./ShowApplicationModalSkeleton";
import ApplicationSectionRenderer from "./ApplicationSectionRenderer";

interface Props {
  id: number;
  jobPosition: string;
  onClose: () => void;
  status: ApplicationStatus;
  has_contract: boolean;
  onApprove: (id: number) => void;
  onRevision: (id: number) => void;
  onReject: (id: number) => void;
  onCreateContract: (id: number) => void;
  onDownloadProfile?: (id: number) => void;
  isDownloading?: boolean;
  isReviewing?: boolean;
  isRejecting?: boolean;
  isCreatingContract?: boolean;
}

const SECTIONS = [
  { id: "personal_data", icon: Profile },
  { id: "contacts", icon: Call },
  { id: "addresses", icon: Location },
  { id: "emergency_contacts", icon: Alarm },
  { id: "id_documents", icon: Note },
  { id: "banking", icon: Bank },
  { id: "education", icon: Teacher },
  { id: "experience", icon: Briefcase },
  { id: "social_categories", icon: People },
] as const;

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

function isImageFile(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lowerUrl.includes(ext));
}

function getPhotoUrl(data: ApplicationDetailResponse | undefined): string | null {
  if (!data?.documents) return null;
  const photoDoc = data.documents.find((doc) => doc.id === "photo_file");
  if (!photoDoc?.view_url) return null;
  return isImageFile(photoDoc.view_url) ? photoDoc.view_url : null;
}

export default function ShowApplicationModalWindow({
  id,
  jobPosition,
  onClose,
  status,
  has_contract,
  onApprove,
  onRevision,
  onReject,
  onCreateContract,
  onDownloadProfile,
  isDownloading,
  isReviewing = false,
  isRejecting = false,
  isCreatingContract = false,
}: Props) {
  const { t, i18n } = useTranslation("HiringPage");
  const { t: tApply } = useTranslation("ApplyApplicationPage");
  const locale = (i18n.language as Locale) || "ru";
  const { data, error, isLoading } = useHiringGetApplicationDetailQuery(id);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("personal_data");

  const personalRef = useRef<HTMLDivElement>(null!);
  const contactsRef = useRef<HTMLDivElement>(null!);
  const emergencyRef = useRef<HTMLDivElement>(null!);
  const addressesRef = useRef<HTMLDivElement>(null!);
  const documentsRef = useRef<HTMLDivElement>(null!);
  const bankingRef = useRef<HTMLDivElement>(null!);
  const educationRef = useRef<HTMLDivElement>(null!);
  const workRef = useRef<HTMLDivElement>(null!);
  const socialCategoriesRef = useRef<HTMLDivElement>(null!);

  const tabs = [
    { id: "personal", label: t("modals.personalData"), ref: personalRef },
    { id: "contacts", label: t("modals.contacts"), ref: contactsRef },
    { id: "emergency", label: t("modals.emergencyContacts"), ref: emergencyRef },
    { id: "addresses", label: t("modals.addresses"), ref: addressesRef },
    { id: "documents", label: t("modals.documents"), ref: documentsRef },
    { id: "banking", label: t("modals.banking"), ref: bankingRef },
    { id: "education", label: t("modals.education"), ref: educationRef },
    { id: "work", label: t("modals.workExperience"), ref: workRef },
    ...(data?.social_categories && data.social_categories.length > 0
      ? [{ id: "social_categories", label: t("modals.socialCategories"), ref: socialCategoriesRef }]
      : []),
  ];

  const { scrollRef, hasScroll } = useScrollDetection();
  const photoUrl = getPhotoUrl(data);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [photoUrl]);

  if (isLoading) {
    return (
      <ShowApplicationModalSkeleton
        onClose={onClose}
        scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
        hasScroll={hasScroll}
      />
    );
  }

  if (error || !data) {
    return (
      <ModalForm icon={Profile} onClose={onClose} resize>
        <div className="p-4">{t("modals.errorLoading")}</div>
      </ModalForm>
    );
  }

  if (isFullScreen) {
    return (
      <ModalForm icon={Profile} onClose={onClose} resize onFullScreenChange={setIsFullScreen}>
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke pt-2 pl-5">
            <h4 className="text-display-2xs content-base-primary">{t("modals.personalSheet")}</h4>
          </div>

          <div className="flex items-center gap-4 py-5 border-b surface-base-stroke">
            <div className="w-14 aspect-square rounded-full flex items-center justify-center background-brand-subtle overflow-hidden">
              {photoUrl && !imageError ? (
                <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full cursor-pointer">
                  <img
                    src={photoUrl}
                    alt={`${data.personal_info.surname} ${data.personal_info.name}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </a>
              ) : (
                <span className="text-black text-xl font-bold">
                  {data.personal_info.name.charAt(0)}
                  {data.personal_info.surname.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-label-lg content-base-primary">
                {data.personal_info.surname} {data.personal_info.name} {data.personal_info.father_name ?? ""}
              </p>
              <span className="text-body-regular-xs content-base-secondary">{jobPosition}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <StepsSwitcher
              steps={SECTIONS.filter((section) => {
                if (section.id === "social_categories") {
                  return data?.social_categories && data.social_categories.length > 0;
                }
                return true;
              }).map((section) => {
                const labelMap: Record<string, string> = {
                  personal_data: t("modals.personalData"),
                  contacts: t("modals.contacts"),
                  addresses: t("modals.addresses"),
                  emergency_contacts: t("modals.emergencyContacts"),
                  id_documents: t("modals.documents"),
                  banking: t("modals.banking"),
                  education: t("modals.education"),
                  experience: t("modals.workExperience"),
                  social_categories: t("modals.socialCategories"),
                };
                return {
                  id: section.id,
                  label: labelMap[section.id] || section.id,
                  icon: section.icon,
                };
              })}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              className="h-full min-h-0"
              contentClassName="flex flex-col min-h-0">
              <>
                <ApplicationSectionRenderer section={activeStep} data={data} />

                <div className="flex justify-end gap-3 pt-6 mt-auto border-t surface-base-stroke">
                  {onDownloadProfile && status !== "draft" && (
                    <Button
                      variant="secondary"
                      size="lg"
                      disabled={isDownloading}
                      onClick={() => onDownloadProfile(id)}>
                      <Import size={16} color="currentColor" />
                      {t("cards.downloadProfile")}
                    </Button>
                  )}

                  {status === "submitted" && (
                    <>
                      <Button variant="danger" size="lg" disabled={isRejecting} onClick={() => onReject(id)}>
                        <CloseIcon />
                        {isRejecting ? t("actions.rejecting") : t("actions.reject")}
                      </Button>
                      <Button variant="secondary" size="lg" disabled={isReviewing} onClick={() => onRevision(id)}>
                        <Edit2 size={16} color="currentColor" />
                        {isReviewing ? t("modals.sending") : t("actions.requestRevision")}
                      </Button>
                      <Button variant="primary" size="lg" disabled={isReviewing} onClick={() => onApprove(id)}>
                        <CheckIcon />
                        {isReviewing ? t("actions.approving") : t("actions.approve")}
                      </Button>
                    </>
                  )}

                  {status === "approved" && !has_contract && (
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={isCreatingContract}
                      onClick={() => onCreateContract(id)}>
                      <DocumentText size={16} color="currentColor" />
                      {isCreatingContract ? t("actions.creating") : t("actions.createContract")}
                    </Button>
                  )}
                </div>
              </>
            </StepsSwitcher>
          </div>
        </div>
      </ModalForm>
    );
  }

  return (
    <ModalForm icon={Profile} onClose={onClose} resize onFullScreenChange={setIsFullScreen}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 pb-5 border-b surface-base-stroke pt-2">
          <h4 className="text-display-2xs content-base-primary">{t("modals.personalSheet")}</h4>
        </div>

        <div className="flex items-center gap-4 py-5 border-b surface-base-stroke">
          <div className="w-14 aspect-square rounded-full flex items-center justify-center background-brand-subtle overflow-hidden">
            {photoUrl && !imageError ? (
              <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full cursor-pointer">
                <img
                  src={photoUrl}
                  alt={`${data.personal_info.surname} ${data.personal_info.name}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </a>
            ) : (
              <span className="content-base-primary text-xl font-bold">
                {data.personal_info.name.charAt(0)}
                {data.personal_info.surname.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-label-lg content-base-primary">
              {data.personal_info.surname} {data.personal_info.name} {data.personal_info.father_name ?? ""}
            </p>

            <span className="text-body-regular-xs content-base-secondary">{jobPosition}</span>
          </div>
        </div>

        <div className="py-5">
          <TabsWithScroll items={tabs} />
        </div>

        <div ref={scrollRef} className={cn("flex-1 py-4 page-scroll pl-0.5", hasScroll && "pr-5")}>
          <div className="flex flex-col gap-7">
            <div ref={personalRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.personalData")}</h6>
              </div>
              <div className="flex flex-col">
                {[
                  { key: "iin", value: data.personal_info.iin },
                  { key: "dateOfBirth", value: formatDateForDisplay(data.personal_info.date_of_birth, false) },
                  {
                    key: "gender",
                    value:
                      data.personal_info.gender === "male"
                        ? t("modals.genderValues.male")
                        : t("modals.genderValues.female"),
                  },
                  {
                    key: "familyStatus",
                    value:
                      data.personal_info.family_status === "single"
                        ? t("modals.familyStatusValues.single")
                        : data.personal_info.family_status === "married"
                          ? t("modals.familyStatusValues.married")
                          : data.personal_info.family_status === "divorced"
                            ? t("modals.familyStatusValues.divorced")
                            : t("modals.familyStatusValues.widowed"),
                  },
                  {
                    key: "cityOfBirth",
                    value:
                      locale === "kk"
                        ? data.personal_info.city_of_birth.name_kk
                        : data.personal_info.city_of_birth.name_ru,
                  },
                  { key: "nationality", value: data.personal_info.nationality },
                  { key: "citizenship", value: data.personal_info.citizenship },
                ].map((field, index, array) => (
                  <div
                    key={field.key}
                    className={cn(
                      "py-3 flex justify-between items-start gap-3",
                      index < array.length - 1 && "border-b surface-base-stroke",
                    )}>
                    <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                    <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div ref={contactsRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.contacts")}</h6>
              </div>

              <div className="flex flex-col">
                {[
                  { key: "email", value: data.contact_info.email },
                  { key: "phone", value: data.contact_info.phone },
                  { key: "additionalPhone", value: data.contact_info.phone_additional },
                ]
                  .filter((field) => field.value)
                  .map((field, index, array) => (
                    <div
                      key={field.key}
                      className={cn(
                        "py-3 flex justify-between items-start gap-3",
                        index < array.length - 1 && "border-b surface-base-stroke",
                      )}>
                      <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                      <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div ref={emergencyRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.emergencyContacts")}</h6>
              </div>

              {data.emergency_contacts.length > 0 ? (
                data.emergency_contacts.map((contact, contactIndex) => (
                  <div key={contactIndex} className="flex flex-col">
                    <div className="py-3 flex justify-between items-start gap-3 border-b surface-base-stroke">
                      <span className="text-body-bold-md content-base-secondary">
                        {t(contactIndex === 0 ? "modals.contact1" : "modals.contact2")}
                      </span>
                    </div>

                    {[
                      { key: "fullName", value: contact.name },
                      { key: "relation", value: t(`modals.relationValues.${contact.relation}`) },
                      { key: "phone", value: contact.phone },
                    ]
                      .filter((field) => field.value)
                      .map((field, index, array) => (
                        <div
                          key={field.key}
                          className={cn(
                            "py-3 flex justify-between items-start gap-3",
                            index < array.length - 1 && "border-b surface-base-stroke",
                          )}>
                          <span className="text-body-regular-md content-base-secondary">
                            {t(`modals.${field.key}`)}
                          </span>
                          <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <p className="text-body-regular-md content-base-secondary py-3">{t("modals.noEmergencyContacts")}</p>
              )}
            </div>

            <div ref={addressesRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.addresses")}</h6>
              </div>

              <div className="flex flex-col">
                {[
                  { key: "registrationAddress", value: data.addresses.registration },
                  { key: "actualAddress", value: data.addresses.factual },
                ]
                  .filter((field) => field.value)
                  .map((field, index, array) => (
                    <div
                      key={field.key}
                      className={cn(
                        "py-3 flex justify-between items-start gap-3",
                        index < array.length - 1 && "border-b surface-base-stroke",
                      )}>
                      <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                      <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div ref={documentsRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.documents")}</h6>
              </div>

              <div className="flex flex-col">
                <div className="py-3 flex justify-between items-start gap-3 border-b surface-base-stroke">
                  <span className="text-body-bold-md content-base-secondary">{t("modals.nationalId")}</span>
                </div>

                {[
                  { key: "idNumber", value: data.id_documents.national_id_number },
                  { key: "issuedBy", value: data.id_documents.national_id_issued_by },
                  { key: "issueDate", value: formatDateForDisplay(data.id_documents.national_id_issue_date, false) },
                  { key: "expiryDate", value: formatDateForDisplay(data.id_documents.national_id_expiry_date, false) },
                ].map((field, index, array) => (
                  <div
                    key={field.key}
                    className={cn(
                      "py-3 flex justify-between items-start gap-3",
                      index < array.length - 1 && "border-b surface-base-stroke",
                    )}>
                    <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                    <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                  </div>
                ))}

                {data.national_id_file && (
                  <div className="py-3 flex flex-col gap-3">
                    <span className="text-body-regular-md content-base-secondary">
                      {tApply("id.identity.file.label")}
                    </span>
                    <FileViewer existingFileUrl={data.national_id_file} />
                  </div>
                )}
              </div>

              {data.military_certificate_file && (
                <div className="flex flex-col">
                  <div className="py-3 flex justify-between items-start gap-3 border-b surface-base-stroke">
                    <span className="text-body-bold-md content-base-secondary">{t("modals.militaryCertificate")}</span>
                  </div>

                  <div className="py-3 flex flex-col gap-3">
                    <span className="text-body-regular-md content-base-secondary">
                      {tApply("id.military.file.label")}
                    </span>
                    <FileViewer existingFileUrl={data.military_certificate_file} />
                  </div>
                </div>
              )}
            </div>

            <div ref={bankingRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.banking")}</h6>
              </div>

              <div className="flex flex-col">
                {[
                  { key: "bankName", value: data.banking.bank_name },
                  { key: "iban", value: data.banking.iban_account },
                  { key: "bik", value: data.banking.bik_number },
                ].map((field, index, array) => (
                  <div
                    key={field.key}
                    className={cn(
                      "py-3 flex justify-between items-start gap-3",
                      index < array.length - 1 && "border-b surface-base-stroke",
                    )}>
                    <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                    <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                  </div>
                ))}

                {data.bank_certificate_file && (
                  <div className="py-3 flex flex-col gap-3">
                    <span className="text-body-regular-md content-base-secondary">
                      {tApply("banking.certificate.label")}
                    </span>
                    <FileViewer existingFileUrl={data.bank_certificate_file} />
                  </div>
                )}
              </div>
            </div>

            <div ref={educationRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.education")}</h6>
              </div>

              {data.education.length > 0 ? (
                data.education.map((edu) => (
                  <div key={edu.id} className="flex flex-col">
                    <div className="pb-3 border-b surface-base-stroke">
                      <h6 className="text-body-bold-lg content-base-primary">
                        {t(`modals.degreeValues.${edu.degree}`)}
                      </h6>
                    </div>

                    {[
                      { key: "university", value: edu.university_name },
                      { key: "specialty", value: edu.specialty },
                      { key: "graduationYear", value: edu.graduation_year },
                    ].map((field, index, array) => (
                      <div
                        key={field.key}
                        className={cn(
                          "py-3 flex justify-between items-start gap-3",
                          index < array.length - 1 && "border-b surface-base-stroke",
                        )}>
                        <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                        <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                      </div>
                    ))}

                    {data.documents.find((doc) => doc.id === `diploma_${edu.id}`)?.view_url && (
                      <div className="py-3 flex flex-col gap-3">
                        <span className="text-body-regular-md content-base-secondary">
                          {tApply("education.diploma_file.label")}
                        </span>
                        <FileViewer
                          existingFileUrl={data.documents.find((doc) => doc.id === `diploma_${edu.id}`)?.view_url}
                        />
                      </div>
                    )}

                    {data.documents.find((doc) => doc.id === `transcript_${edu.id}`)?.view_url && (
                      <div className="py-3 flex flex-col gap-3">
                        <span className="text-body-regular-md content-base-secondary">
                          {tApply("education.diploma_transcript.label")}
                        </span>
                        <FileViewer
                          existingFileUrl={data.documents.find((doc) => doc.id === `transcript_${edu.id}`)?.view_url}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-body-regular-md content-base-secondary py-3">{t("modals.noEducation")}</p>
              )}
            </div>

            <div ref={workRef} className="flex flex-col gap-5">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">{t("modals.workExperience")}</h6>
              </div>

              {data.work_proof_file && (
                <div className="flex flex-col">
                  <div className="py-3 flex flex-col gap-3">
                    <span className="text-body-regular-md content-base-secondary">
                      {tApply("experience.proof.title")}
                    </span>
                    <FileViewer existingFileUrl={data.work_proof_file} />
                  </div>
                </div>
              )}

              {data.work_experience.length > 0 ? (
                data.work_experience.map((work) => (
                  <div key={work.id} className="flex flex-col mt-3">
                    <div className="pb-3 border-b surface-base-stroke">
                      <h6 className="text-body-bold-lg content-base-primary">{work.organization_name}</h6>
                    </div>

                    {[
                      { key: "position", value: work.work_position },
                      { key: "startDate", value: formatDateForDisplay(work.beginning_date, false) },
                      { key: "endDate", value: formatDateForDisplay(work.end_date, false) },
                    ]
                      .filter((field) => field.value)
                      .map((field, index, array) => (
                        <div
                          key={field.key}
                          className={cn(
                            "py-3 flex justify-between items-start gap-3",
                            index < array.length - 1 && "border-b surface-base-stroke",
                          )}>
                          <span className="text-body-regular-md content-base-secondary">
                            {t(`modals.${field.key}`)}
                          </span>
                          <p className="text-body-bold-md content-base-primary text-right">{field.value}</p>
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <p className="text-body-regular-md content-base-secondary py-3">{t("modals.noWorkExperience")}</p>
              )}
            </div>

            {data.social_categories && data.social_categories.length > 0 && (
              <div ref={socialCategoriesRef} className="flex flex-col gap-5">
                <div className="pb-3 border-b surface-base-stroke">
                  <h6 className="text-body-bold-lg content-base-primary">{t("modals.socialCategories")}</h6>
                </div>
                {data.social_categories.map((category) => {
                  return (
                    <div key={category.id} className="flex flex-col">
                      <div className="pb-3 border-b surface-base-stroke">
                        <h6 className="text-body-bold-lg content-base-primary">
                          {category.category_type_display || category.category_type}
                        </h6>
                      </div>
                      {category.issue_date && (
                        <div className="py-3 flex justify-between items-start gap-3 border-b surface-base-stroke">
                          <span className="text-body-regular-md content-base-secondary">
                            {tApply("social.issue_date.label")}
                          </span>
                          <p className="text-body-bold-md content-base-primary text-right">
                            {formatDateForDisplay(category.issue_date, false)}
                          </p>
                        </div>
                      )}
                      {category.expiry_date && (
                        <div className="py-3 flex justify-between items-start gap-3 border-b surface-base-stroke">
                          <span className="text-body-regular-md content-base-secondary">
                            {tApply("social.expiry_date.label")}
                          </span>
                          <p className="text-body-bold-md content-base-primary text-right">
                            {formatDateForDisplay(category.expiry_date, false)}
                          </p>
                        </div>
                      )}
                      {category.notes && (
                        <div className="py-3 flex justify-between items-start gap-3 border-b surface-base-stroke">
                          <span className="text-body-regular-md content-base-secondary">
                            {tApply("social.notes.label")}
                          </span>
                          <p className="text-body-bold-md content-base-primary text-right">{category.notes}</p>
                        </div>
                      )}
                      <div className="py-3 flex flex-col gap-3">
                        <span className="text-body-regular-md content-base-secondary">
                          {tApply("social.document.label")}
                        </span>
                        <FileViewer
                          existingFileUrl={data.documents.find((doc) => doc.id === `social_${category.id}`)?.view_url}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-6 border-t surface-base-stroke">
              {status === "submitted" && (
                <Button variant="primary" size="md" disabled={isReviewing} onClick={() => onApprove(id)}>
                  <CheckIcon />
                  {isReviewing ? t("actions.approving") : t("actions.approve")}
                </Button>
              )}

              {status === "approved" && !has_contract && (
                <Button variant="primary" size="md" disabled={isCreatingContract} onClick={() => onCreateContract(id)}>
                  <DocumentText size={16} color="currentColor" />
                  {isCreatingContract ? t("actions.creating") : t("actions.createContract")}
                </Button>
              )}

              {status === "submitted" && (
                <Button variant="secondary" size="md" disabled={isReviewing} onClick={() => onRevision(id)}>
                  <Edit2 size={16} color="currentColor" />
                  {isReviewing ? t("modals.sending") : t("actions.requestRevision")}
                </Button>
              )}

              {onDownloadProfile && status !== "draft" && (
                <Button variant="secondary" size="md" disabled={isDownloading} onClick={() => onDownloadProfile(id)}>
                  <Import size={16} color="currentColor" />
                  {t("cards.downloadProfile")}
                </Button>
              )}

              {status === "submitted" && (
                <Button variant="danger" size="md" disabled={isRejecting} onClick={() => onReject(id)}>
                  <CloseIcon />
                  {isRejecting ? t("actions.rejecting") : t("actions.reject")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalForm>
  );
}

