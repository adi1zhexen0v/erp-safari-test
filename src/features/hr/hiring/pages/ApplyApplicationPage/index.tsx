import { Alarm, Bank, Briefcase, Call, Location, Note, Profile, Teacher, People } from "iconsax-react";
import { Loader } from "@/shared/components";
import { Prompt, PromptForm, StepsSwitcher } from "@/shared/ui";
import { useApplyApplicationPage } from "@/features/hr/hiring";
import SectionRenderer from "./onboarding/SectionRenderer";

export default function ApplyApplicationPage() {
  const {
    token,
    active,
    setActive,
    showConfirm,
    setShowConfirm,
    showPrompt,
    setShowPrompt,
    validationData,
    validationLoading,
    validationError,
    submitIsLoading,
    disabledSteps,
    completedSteps,
    handleSubmit,
    t,
  } = useApplyApplicationPage();

  if (!token) return null;

  if (validationLoading) {
    return <Loader isFullPage />;
  }

  if (validationError || !validationData?.valid) {
    return (
      <div className="max-w-3xl mx-auto my-16">
        <h1 className="text-display-xs content-base-primary mb-4">{t("page.invalid_link")}</h1>
        <p className="text-body-md content-base-secondary">{validationData?.error ?? t("page.link_expired")}</p>
      </div>
    );
  }

  const sectionsWithIcons = [
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

  return (
    <>
      <title>{t("page.title")}</title>
      <div className="max-w-7xl mx-auto flex flex-col gap-7 pb-16">
        <header className="flex flex-col gap-2">
          <h1 className="text-display-sm content-base-primary">{t("page.heading")}</h1>
          <p className="text-body-regular-md content-base-secondary">{t("page.subtitle")}</p>
        </header>

        <StepsSwitcher
          steps={sectionsWithIcons.map((section) => ({
            id: section.id,
            label: t(`sections.${section.id}`),
            icon: section.icon,
          }))}
          activeStep={active}
          onStepChange={(stepId) => {
            if (disabledSteps.includes(stepId as typeof active)) return;
            setActive(stepId as typeof active);
          }}
          disabledSteps={disabledSteps}
          disabledTooltip={t("sections.personal_data_required_tooltip")}
          completedSteps={completedSteps}>
          <SectionRenderer section={active} token={token} onSubmit={() => setShowConfirm(true)} />
        </StepsSwitcher>

        {showConfirm && (
          <PromptForm
            variant="warning"
            onClose={() => setShowConfirm(false)}
            onConfirm={handleSubmit}
            title={t("prompt_form.title")}
            text={t("prompt_form.description")}
            isLoading={submitIsLoading}
          />
        )}

        {showPrompt.type && (
          <Prompt
            variant={showPrompt.type}
            onClose={() => {
              setShowPrompt({ type: null });
              if (showPrompt.type === "success") {
                window.close();

                setTimeout(() => {
                  if (!document.hidden) {
                    window.location.reload();
                  }
                }, 150);
              }
            }}
            title={showPrompt.type === "success" ? t("page.success_title") : t("page.error_title")}
            text={showPrompt.type === "success" ? t("page.success_message") : t("page.error_message")}
          />
        )}
      </div>
    </>
  );
}
