import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { selectTheme, selectShowImages } from "@/features/settings/selectors";
import {
  useApplyApplicationGetCompletenessQuery,
  useApplyApplicationSubmitMutation,
  useApplyApplicationValidateTokenQuery,
  type SectionKey,
  type CompletenessResponse,
  type SectionStatus,
} from "@/features/hr/hiring";
import { setSocialCategoriesOpened } from "@/features/hr/hiring/slice";

const SECTIONS = [
  { id: "personal_data" as const },
  { id: "contacts" as const },
  { id: "addresses" as const },
  { id: "emergency_contacts" as const },
  { id: "id_documents" as const },
  { id: "banking" as const },
  { id: "education" as const },
  { id: "experience" as const },
  { id: "social_categories" as const },
] as const;

export interface UseApplyApplicationPageReturn {
  token: string | undefined;
  active: SectionKey;
  setActive: (section: SectionKey) => void;
  showConfirm: boolean;
  setShowConfirm: (show: boolean) => void;
  showPrompt: { type: "success" | "error" | null };
  setShowPrompt: (prompt: { type: "success" | "error" | null }) => void;
  completeness: CompletenessResponse | null;
  socialCategoriesWasOpened: boolean;
  validationData: ReturnType<typeof useApplyApplicationValidateTokenQuery>["data"];
  validationLoading: boolean;
  validationError: boolean;
  submitApplication: ReturnType<typeof useApplyApplicationSubmitMutation>[0];
  submitIsLoading: boolean;
  disabledSteps: SectionKey[];
  completedSteps: SectionKey[];
  sections: typeof SECTIONS;
  handleSubmit: () => Promise<void>;
  t: ReturnType<typeof useTranslation>["t"];
}

export function useApplyApplicationPage(): UseApplyApplicationPageReturn {
  const { t } = useTranslation("ApplyApplicationPage");
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();

  const [active, setActive] = useState<SectionKey>(SECTIONS[0].id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPrompt, setShowPrompt] = useState<{
    type: "success" | "error" | null;
  }>({ type: null });

  const completeness = useAppSelector((state) => state.completeness.data);
  const socialCategoriesWasOpened = useAppSelector((state) => state.completeness.socialCategoriesWasOpened);
  const theme = useAppSelector(selectTheme);
  const showImages = useAppSelector(selectShowImages);

  const {
    data: validationData,
    isLoading: validationLoading,
    isError: validationError,
  } = useApplyApplicationValidateTokenQuery(token!, { skip: !token });

  useApplyApplicationGetCompletenessQuery(token!, {
    skip: !token || !validationData?.valid,
  });

  const [submitApplication, { isLoading: submitIsLoading }] = useApplyApplicationSubmitMutation();

  const disabledSteps = useMemo(() => {
    const isPersonalDataComplete = completeness?.sections.personal_data?.complete;
    if (!isPersonalDataComplete) {
      return SECTIONS.filter((s) => s.id !== "personal_data").map((s) => s.id);
    }
    return [];
  }, [completeness?.sections.personal_data?.complete]);

  const completedSteps = useMemo(() => {
    const completedFromCompleteness = Object.entries(completeness?.sections ?? {})
      .filter(([_, section]) => (section as SectionStatus)?.complete)
      .map(([id]) => id as SectionKey);
    const isSocialCategoriesOpened =
      (token && localStorage.getItem(`social_categories_opened_${token}`) === "true") ||
      socialCategoriesWasOpened;

    const completedSteps = completedFromCompleteness.filter(
      (id) => id !== "social_categories" || isSocialCategoriesOpened,
    );

    if (isSocialCategoriesOpened && !completedSteps.includes("social_categories")) {
      const socialCategoriesSection = completeness?.sections.social_categories;
      if (socialCategoriesSection?.complete) {
        completedSteps.push("social_categories");
      }
    }

    return completedSteps;
  }, [completeness, token, socialCategoriesWasOpened]);

  useEffect(() => {
    if (!token) return;

    const storageKey = `social_categories_opened_${token}`;
    const wasOpened = localStorage.getItem(storageKey) === "true";

    if (active === "social_categories" && !wasOpened) {
      localStorage.setItem(storageKey, "true");
      if (completeness && !completeness.sections.social_categories) {
        dispatch(setSocialCategoriesOpened());
      }
    }
  }, [active, token, completeness, dispatch]);

  useEffect(() => {
    document.body.classList.add("surface-secondary-fill");

    if (theme === "dark") {
      document.body.classList.add("dark");
    }
    if (!showImages) {
      document.body.classList.add("no-images");
    }

    return () => {
      document.body.classList.remove("surface-secondary-fill");
    };
  }, [theme, showImages]);

  async function handleSubmit() {
    if (!token) return;
    try {
      await submitApplication(token).unwrap();
      setShowConfirm(false);
      setShowPrompt({ type: "success" });
    } catch (e) {
      setShowConfirm(false);
      setShowPrompt({ type: "error" });
      console.error("Ошибка при отправке анкеты", e);
    }
  }

  return {
    token,
    active,
    setActive,
    showConfirm,
    setShowConfirm,
    showPrompt,
    setShowPrompt,
    completeness,
    socialCategoriesWasOpened,
    validationData,
    validationLoading,
    validationError,
    submitApplication,
    submitIsLoading,
    disabledSteps,
    completedSteps,
    sections: SECTIONS,
    handleSubmit,
    t,
  };
}

