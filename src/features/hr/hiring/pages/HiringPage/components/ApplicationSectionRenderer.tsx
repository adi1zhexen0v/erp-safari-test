import { useTranslation } from "react-i18next";
import cn from "classnames";
import { FileViewer } from "@/shared/ui";
import { formatDateForDisplay, type Locale } from "@/shared/utils";
import type { ApplicationDetailResponse } from "@/features/hr/hiring";

interface Props {
  section: string;
  data: ApplicationDetailResponse;
}

export default function ApplicationSectionRenderer({ section, data }: Props) {
  const { t, i18n } = useTranslation("HiringPage");
  const { t: tApply } = useTranslation("ApplyApplicationPage");
  const locale = (i18n.language as Locale) || "ru";

  switch (section) {
    case "personal_data": {
      return (
        <div className="flex flex-col gap-5">
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
                  locale === "kk" ? data.personal_info.city_of_birth.name_kk : data.personal_info.city_of_birth.name_ru,
              },
              { key: "nationality", value: data.personal_info.nationality },
              { key: "citizenship", value: data.personal_info.citizenship },
            ].map((field, index, array) => (
              <div
                key={field.key}
                className={cn(
                  "py-4 flex justify-between items-center",
                  index < array.length - 1 && "border-b surface-base-stroke",
                )}>
                <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                <p className="text-body-bold-md content-base-primary">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "contacts": {
      return (
        <div className="flex flex-col gap-5">
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
                    "py-4 flex justify-between items-center",
                    index < array.length - 1 && "border-b surface-base-stroke",
                  )}>
                  <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                  <p className="text-body-bold-md content-base-primary">{field.value}</p>
                </div>
              ))}
          </div>
        </div>
      );
    }

    case "emergency_contacts": {
      return (
        <div className="flex flex-col gap-5">
          <div className="pb-3 border-b surface-base-stroke">
            <h6 className="text-body-bold-lg content-base-primary">{t("modals.emergencyContacts")}</h6>
          </div>
          {data.emergency_contacts.length > 0 ? (
            data.emergency_contacts.map((contact, contactIndex) => (
              <div key={contactIndex} className="flex flex-col">
                <div className="py-3 flex justify-between items-center border-b surface-base-stroke">
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
                        "py-4 flex justify-between items-center",
                        index < array.length - 1 && "border-b surface-base-stroke",
                      )}>
                      <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                      <p className="text-body-bold-md content-base-primary">{field.value}</p>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <p className="text-body-regular-md content-base-secondary py-4">{t("modals.noEmergencyContacts")}</p>
          )}
        </div>
      );
    }

    case "addresses": {
      return (
        <div className="flex flex-col gap-5">
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
                    "py-4 flex flex-col gap-3",
                    index < array.length - 1 && "border-b surface-base-stroke",
                  )}>
                  <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                  <p className="text-body-bold-md content-base-primary">{field.value}</p>
                </div>
              ))}
          </div>
        </div>
      );
    }

    case "id_documents": {
      return (
        <div className="flex flex-col gap-5">
          <div className="pb-3 border-b surface-base-stroke">
            <h6 className="text-body-bold-lg content-base-primary">{t("modals.documents")}</h6>
          </div>
          <div className="flex flex-col">
            <div className="py-3 flex justify-between items-center border-b surface-base-stroke">
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
                  "py-4 flex justify-between items-center",
                  index < array.length - 1 && "border-b surface-base-stroke",
                )}>
                <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                <p className="text-body-bold-md content-base-primary">{field.value}</p>
              </div>
            ))}
            {data.national_id_file && (
              <div className="py-3 flex flex-col gap-3">
                <span className="text-body-regular-md content-base-secondary">{tApply("id.identity.file.label")}</span>
                <FileViewer existingFileUrl={data.national_id_file} />
              </div>
            )}
          </div>
          {data.military_certificate_file && (
            <div className="flex flex-col">
              <div className="py-3 flex justify-between items-center border-b surface-base-stroke">
                <span className="text-body-bold-md content-base-secondary">{t("modals.militaryCertificate")}</span>
              </div>
              <div className="py-3 flex flex-col gap-3">
                <span className="text-body-regular-md content-base-secondary">{tApply("id.military.file.label")}</span>
                <FileViewer existingFileUrl={data.military_certificate_file} />
              </div>
            </div>
          )}
        </div>
      );
    }

    case "banking": {
      return (
        <div className="flex flex-col gap-5">
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
                  "py-4 flex justify-between items-center",
                  index < array.length - 1 && "border-b surface-base-stroke",
                )}>
                <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                <p className="text-body-bold-md content-base-primary">{field.value}</p>
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
      );
    }

    case "education": {
      return (
        <div className="flex flex-col gap-5">
          <div className="pb-3 border-b surface-base-stroke">
            <h6 className="text-body-bold-lg content-base-primary">{t("modals.education")}</h6>
          </div>
          {data.education.length > 0 ? (
            data.education.map((edu) => (
              <div key={edu.id} className="flex flex-col">
                <div className="pb-3 border-b surface-base-stroke">
                  <h6 className="text-body-bold-lg content-base-primary">{t(`modals.degreeValues.${edu.degree}`)}</h6>
                </div>
                {[
                  { key: "university", value: edu.university_name },
                  { key: "specialty", value: edu.specialty },
                  { key: "graduationYear", value: edu.graduation_year },
                ].map((field, index, array) => (
                  <div
                    key={field.key}
                    className={cn(
                      "py-4 flex justify-between items-center gap-3",
                      index < array.length - 1 && "border-b surface-base-stroke",
                    )}>
                    <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                    <p
                      className={cn(
                        "text-body-bold-md content-base-primary",
                        field.key === "specialty" && "text-right",
                      )}>
                      {field.value}
                    </p>
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
            <p className="text-body-regular-md content-base-secondary py-4">{t("modals.noEducation")}</p>
          )}
        </div>
      );
    }

    case "experience": {
      return (
        <div className="flex flex-col gap-5">
          <div className="pb-3 border-b surface-base-stroke">
            <h6 className="text-body-bold-lg content-base-primary">{t("modals.workExperience")}</h6>
          </div>
          {data.work_proof_file && (
            <div className="flex flex-col">
              <div className="py-3 flex flex-col gap-3">
                <span className="text-body-regular-md content-base-secondary">{tApply("experience.proof.title")}</span>
                <FileViewer existingFileUrl={data.work_proof_file} />
              </div>
            </div>
          )}
          {data.work_experience.length > 0 ? (
            data.work_experience.map((work) => (
              <div key={work.id} className="flex flex-col">
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
                        "py-4 flex justify-between items-center gap-3",
                        index < array.length - 1 && "border-b surface-base-stroke",
                      )}>
                      <span className="text-body-regular-md content-base-secondary">{t(`modals.${field.key}`)}</span>
                      <p
                        className={cn(
                          "text-body-bold-md content-base-primary",
                          field.key === "startDate" && "text-right",
                        )}>
                        {field.value}
                      </p>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <p className="text-body-regular-md content-base-secondary py-4">{t("modals.noWorkExperience")}</p>
          )}
        </div>
      );
    }

    case "social_categories": {
      if (!data.social_categories || data.social_categories.length === 0) {
        return (
          <div className="flex flex-col gap-5">
            <div className="pb-3 border-b surface-base-stroke">
              <h6 className="text-body-bold-lg content-base-primary">{t("modals.socialCategories")}</h6>
            </div>
            <p className="text-body-regular-md content-base-secondary py-4">{tApply("social.empty")}</p>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-5">
          <div className="pb-3 border-b surface-base-stroke">
            <h6 className="text-body-bold-lg content-base-primary">{t("modals.socialCategories")}</h6>
          </div>
          {data.social_categories.map((category) => (
            <div key={category.id} className="flex flex-col">
              <div className="pb-3 border-b surface-base-stroke">
                <h6 className="text-body-bold-lg content-base-primary">
                  {category.category_type_display || category.category_type}
                </h6>
              </div>
              {category.issue_date && (
                <div className="py-4 flex justify-between items-center border-b surface-base-stroke">
                  <span className="text-body-regular-md content-base-secondary">
                    {tApply("social.issue_date.label")}
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatDateForDisplay(category.issue_date, false)}
                  </p>
                </div>
              )}
              {category.expiry_date && (
                <div className="py-4 flex justify-between items-center border-b surface-base-stroke">
                  <span className="text-body-regular-md content-base-secondary">
                    {tApply("social.expiry_date.label")}
                  </span>
                  <p className="text-body-bold-md content-base-primary">
                    {formatDateForDisplay(category.expiry_date, false)}
                  </p>
                </div>
              )}
              {category.notes && (
                <div className="py-4 flex flex-col gap-3 border-b surface-base-stroke">
                  <span className="text-body-regular-md content-base-secondary">{tApply("social.notes.label")}</span>
                  <p className="text-body-bold-md content-base-primary">{category.notes}</p>
                </div>
              )}
              <div className="py-4 flex flex-col gap-3">
                <span className="text-body-regular-md content-base-secondary">{tApply("social.document.label")}</span>
                <FileViewer
                  existingFileUrl={data.documents.find((doc) => doc.id === `social_${category.id}`)?.view_url}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

