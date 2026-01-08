import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "@/shared/assets/icons";
import { FileUploader } from "@/shared/components";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { Button, Checkbox, CitySelect, DatePicker, Input, Select, Toast } from "@/shared/ui";
import { formatDateToISO, type Locale } from "@/shared/utils";
import { CITIZENSHIP_OPTIONS, NATIONALITY_OPTIONS, setGender, setIsResident, setIsStudent } from "@/features/hr/hiring";
import { useCreatePersonalInfoMutation, useGetPersonalInfoQuery } from "./api";
import { type PersonalInfoFormValues, createPersonalInfoSchema } from "./validation";
import GeneralFormSkeleton from "./GeneralFormSkeleton";

interface Props {
  token: string;
  openSubmit: () => void;
}

export default function GeneralForm({ token, openSubmit }: Props) {
  const { i18n, t } = useTranslation("ApplyApplicationPage");
  const locale = (i18n.language as Locale) || "ru";
  const dispatch = useAppDispatch();
  const isCompleted = useAppSelector((s) => s.completeness.data?.is_complete);
  const isStudentFromRedux = useAppSelector((s) => s.completeness.is_student);
  const { data, isLoading } = useGetPersonalInfoQuery(token);
  const [createPersonalInfo, { isLoading: isSaving }] = useCreatePersonalInfoMutation();

  const [toast, setToast] = useState<{
    text: string;
    color: "positive" | "negative" | "notice" | "grey";
  } | null>(null);

  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [isEnrollmentRemoved, setIsEnrollmentRemoved] = useState(false);

  const isStudent = isStudentFromRedux ?? false;
  const hasPhotoFromApi = !!data?.photo_file_url && !isPhotoRemoved;
  const hasEnrollmentFromApi = !!data?.enrollment_verification_file_url && !isEnrollmentRemoved;

  const schema = useMemo(
    () =>
      createPersonalInfoSchema(isStudent, {
        hasPhotoFromApi,
        hasEnrollmentFromApi,
      }),
    [isStudent, hasPhotoFromApi, hasEnrollmentFromApi],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      iin: "",
      name: "",
      surname: "",
      father_name: "",
      date_of_birth: null,
      gender: "",
      family_status: "",
      city_of_birth_id: undefined as number | undefined,
      nationality: "",
      citizenship: "",
      is_resident: true,
      is_student: false,
      photo_file: null,
      enrollment_verification_file: null,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        iin: data.iin ?? "",
        name: data.name ?? "",
        surname: data.surname ?? "",
        father_name: data.father_name ?? "",
        date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
        gender: data.gender ?? "",
        family_status: data.family_status ?? "",
        city_of_birth_id: data.city_of_birth_id ?? undefined,
        nationality: data.nationality ?? "",
        citizenship: data.citizenship ?? "",
        is_resident: data.is_resident ?? true,
        is_student: data.is_student ?? false,
        photo_file: null,
        enrollment_verification_file: null,
      });
      setIsPhotoRemoved(false);
      setIsEnrollmentRemoved(false);
      if (data.gender) {
        dispatch(setGender(data.gender as "male" | "female"));
      }
      dispatch(setIsResident(data.is_resident ?? true));
      dispatch(setIsStudent(data.is_student ?? false));
    }
  }, [data, reset, dispatch]);

  useEffect(() => {
    trigger(["photo_file", "enrollment_verification_file"]);
  }, [hasPhotoFromApi, hasEnrollmentFromApi, trigger]);

  const dateValue = watch("date_of_birth");
  const gender = watch("gender");
  const familyStatus = watch("family_status");
  const cityOfBirthId = watch("city_of_birth_id");
  const nationality = watch("nationality");
  const citizenship = watch("citizenship");
  const isResident = watch("is_resident");
  const isStudentValue = watch("is_student");
  const photo = watch("photo_file");
  const enrollmentFile = watch("enrollment_verification_file");

  async function onSubmit(values: PersonalInfoFormValues) {
    try {
      const hasPhotoFromApi = !!data?.photo_file_url && !isPhotoRemoved;
      const hasEnrollmentFromApi = !!data?.enrollment_verification_file_url && !isEnrollmentRemoved;

      await createPersonalInfo({
        token,
        body: {
          ...values,
          photo_file: hasPhotoFromApi ? null : (values.photo_file ?? null),
          date_of_birth: formatDateToISO(values.date_of_birth),
          enrollment_verification_file: hasEnrollmentFromApi ? null : (values.enrollment_verification_file ?? null),
        },
      }).unwrap();

      setToast({
        color: "positive",
        text: "personal.toast.success",
      });
    } catch (e) {
      setToast({
        color: "negative",
        text: "personal.toast.error",
      });
      console.error("Ошибка при создании персональной информации", e);
    }
  }

  if (isLoading && !data) return <GeneralFormSkeleton />;

  return (
    <form className="flex flex-col justify-between min-h-[640px] gap-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-7">
        <h2 className="text-display-2xs content-base-primary">{t("personal.title")}</h2>

        <div className="flex flex-col gap-4">
          <FileUploader
            label={t("personal.photo.label")}
            accept=".jpg,.jpeg,.png"
            formatsText={t("file_uploader.formats_images_only", { max: 5 })}
            value={photo}
            existingFileUrl={!isPhotoRemoved ? data?.photo_file_url : null}
            onChange={(file) => {
              setValue("photo_file", file, { shouldValidate: true });
              if (file) {
                setIsPhotoRemoved(false);
              } else {
                setIsPhotoRemoved(false);
                trigger("photo_file");
              }
            }}
            onRemoveExisting={() => {
              setIsPhotoRemoved(true);
              setValue("photo_file", null, { shouldValidate: true });
            }}
            error={errors.photo_file?.message ? t(errors.photo_file.message as string) : null}
          />

          <Input
            label={t("personal.surname.label")}
            placeholder={t("personal.surname.placeholder")}
            {...register("surname")}
            error={errors.surname?.message && t(errors.surname.message)}
          />

          <Input
            label={t("personal.name.label")}
            placeholder={t("personal.name.placeholder")}
            {...register("name")}
            error={errors.name?.message && t(errors.name.message)}
          />

          <Input
            label={t("personal.father_name.label")}
            placeholder={t("personal.father_name.placeholder")}
            {...register("father_name")}
            error={errors.father_name?.message && t(errors.father_name.message)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label={t("personal.iin.label")}
              placeholder={t("personal.iin.placeholder")}
              {...register("iin")}
              error={errors.iin?.message && t(errors.iin.message)}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-black dark:text-white leading-5 font-semibold">
                {t("personal.date_of_birth.label")}
              </label>

              <DatePicker
                mode="single"
                locale={locale}
                placeholder={t("personal.date_of_birth.placeholder")}
                value={dateValue}
                onChange={(v) => setValue("date_of_birth", (v as Date) ?? null, { shouldValidate: true })}
              />

              {errors.date_of_birth && (
                <p className="text-body-regular-xs content-action-negative">{t(errors.date_of_birth.message!)}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-black dark:text-white leading-5 font-semibold">
              {t("personal.gender.label")}
            </label>

            <Select
              options={[
                { label: t("personal.gender.male"), value: "male" },
                { label: t("personal.gender.female"), value: "female" },
              ]}
              value={gender}
              onChange={(v) => {
                setValue("gender", v ?? "", { shouldValidate: true });
                dispatch(setGender((v as "male" | "female") ?? null));
              }}
              placeholder={t("personal.gender.placeholder")}
            />

            {errors.gender && (
              <p className="text-body-regular-xs content-action-negative">{t(errors.gender.message!)}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-black dark:text-white leading-5 font-semibold">
              {t("personal.family_status.label")}
            </label>

            <Select
              options={[
                { label: t("personal.family_status.single"), value: "single" },
                { label: t("personal.family_status.married"), value: "married" },
                { label: t("personal.family_status.divorced"), value: "divorced" },
                { label: t("personal.family_status.widowed"), value: "widowed" },
              ]}
              value={familyStatus}
              onChange={(v) => setValue("family_status", v ?? "", { shouldValidate: true })}
              placeholder={t("personal.family_status.placeholder")}
            />

            {errors.family_status && (
              <p className="text-body-regular-xs content-action-negative">{t(errors.family_status.message!)}</p>
            )}
          </div>

          <CitySelect
            label={t("personal.city_of_birth.label")}
            placeholder={t("personal.city_of_birth.placeholder")}
            value={cityOfBirthId}
            onChange={(cityId) => {
              if (cityId !== undefined) {
                setValue("city_of_birth_id", cityId, { shouldValidate: true });
              }
            }}
            error={errors.city_of_birth_id?.message && t(errors.city_of_birth_id.message)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-black dark:text-white leading-5 font-semibold">
                {t("personal.nationality.label")}
              </label>
              <Select
                options={NATIONALITY_OPTIONS.map((opt) => ({
                  label: t(`GeneralForm.nationality.${opt.labelKey}`),
                  value: opt.value,
                }))}
                value={nationality}
                onChange={(v) => setValue("nationality", v ?? "", { shouldValidate: true })}
                placeholder={t("personal.nationality.placeholder")}
              />
              {errors.nationality && (
                <p className="text-body-regular-xs content-action-negative">{t(errors.nationality.message!)}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-black dark:text-white leading-5 font-semibold">
                {t("personal.citizenship.label")}
              </label>
              <Select
                options={CITIZENSHIP_OPTIONS.map((opt) => ({
                  label: t(`GeneralForm.citizenship.${opt.labelKey}`),
                  value: opt.value,
                }))}
                value={citizenship}
                onChange={(v) => setValue("citizenship", v ?? "", { shouldValidate: true })}
                placeholder={t("personal.citizenship.placeholder")}
              />
              {errors.citizenship && (
                <p className="text-body-regular-xs content-action-negative">{t(errors.citizenship.message!)}</p>
              )}
            </div>
          </div>

          <Checkbox
            state={!isResident ? "checked" : "unchecked"}
            onChange={() => {
              const newValue = !isResident;
              setValue("is_resident", newValue, { shouldValidate: true });
              dispatch(setIsResident(newValue));
            }}
            label={t("personal.not_resident")}
          />

          <Checkbox
            state={isStudentValue ? "checked" : "unchecked"}
            onChange={() => {
              const newValue = !isStudentValue;
              setValue("is_student", newValue, { shouldValidate: true });
              dispatch(setIsStudent(newValue));
            }}
            label={t("personal.is_student")}
          />

          {isStudentValue && (
            <FileUploader
              label={t("personal.enrollment.label")}
              value={enrollmentFile}
              existingFileUrl={!isEnrollmentRemoved ? data?.enrollment_verification_file_url : null}
              onChange={(file) => {
                setValue("enrollment_verification_file", file, { shouldValidate: true });
                if (file) {
                  setIsEnrollmentRemoved(false);
                } else {
                  setIsEnrollmentRemoved(false);
                  trigger("enrollment_verification_file");
                }
              }}
              onRemoveExisting={() => {
                setIsEnrollmentRemoved(true);
                setValue("enrollment_verification_file", null, { shouldValidate: true });
              }}
              error={
                errors.enrollment_verification_file?.message
                  ? t(errors.enrollment_verification_file.message as string)
                  : null
              }
            />
          )}
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        {toast && (
          <Toast
            key={`${toast.color}-${toast.text}`}
            color={toast.color}
            text={t(toast.text)}
            onClose={() => setToast(null)}
          />
        )}

        <Button variant="secondary" size="lg" disabled={!isCompleted || isSaving} onClick={openSubmit}>
          {t("personal.submit_review")}
        </Button>

        <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
          {isSaving ? t("personal.saving") : t("personal.save")}
          {!isSaving && (
            <span className="text-white">
              <ArrowRightIcon />
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

