import { useTranslation } from "react-i18next";
import { type LeaveApplication, useLeaveApplicationsActions } from "@/features/hr/leave-applications";
import { Prompt, PromptForm } from "@/shared/ui";
import { type Locale } from "@/shared/utils";
import LeaveApplicationCard from "./LeaveApplicationCard";

interface Props {
  leaves: LeaveApplication[];
  locale: Locale;
  onEdit: (leave: LeaveApplication) => void;
}

export default function LeaveApplicationsCardsView({ leaves, locale, onEdit }: Props) {
  const { t } = useTranslation("LeaveApplicationsPage");
  const { isLoading, prompt, setPrompt, deletingLeaveId, handleDelete, handleAction } = useLeaveApplicationsActions();

  async function handleDeleteConfirm() {
    if (prompt && prompt.leaveId) {
      const leave = leaves.find(function (l) {
        return `${l.leave_type}-${l.id}` === prompt.leaveId;
      });
      if (leave) {
        await handleDelete(leave);
      }
      setPrompt(null);
    }
  }

  function handleActionWithConfirm(action: string, leave: LeaveApplication) {
    if (action === "delete") {
      setPrompt({
        title: t("messages.deleteConfirmTitle"),
        text: t("messages.deleteConfirmText"),
        variant: "warning",
        leaveId: `${leave.leave_type}-${leave.id}`,
      });
    } else {
      handleAction(action as "edit" | "delete" | "preview", leave);
    }
  }

  function handlePromptClose() {
    setPrompt(null);
  }

  function handleErrorConfirm() {
    setPrompt(null);
  }

  function renderLeaveCard(leave: LeaveApplication) {
    return (
      <LeaveApplicationCard
        key={`${leave.leave_type}-${leave.id}`}
        leave={leave}
        locale={locale}
        isLoading={isLoading}
        deletingLeaveId={deletingLeaveId}
        onAction={handleActionWithConfirm}
        onEdit={onEdit}
      />
    );
  }

  return (
    <>
      {prompt && prompt.variant === "warning" && prompt.leaveId ? (
        <PromptForm
          title={prompt.title}
          text={prompt.text}
          onClose={handlePromptClose}
          onConfirm={handleDeleteConfirm}
          confirmText={t("actions.delete")}
          variant="warning"
          isLoading={deletingLeaveId !== null}
        />
      ) : prompt && prompt.variant === "error" ? (
        <PromptForm
          title={prompt.title}
          text={prompt.text}
          onClose={handlePromptClose}
          onConfirm={handleErrorConfirm}
          confirmText={t("actions.delete")}
          variant="error"
        />
      ) : prompt && prompt.variant === "success" ? (
        <Prompt
          title={prompt.title}
          text={prompt.text}
          variant="success"
          namespace="LeaveApplicationsPage"
          onClose={handlePromptClose}
        />
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
        {leaves.map(renderLeaveCard)}
      </div>
    </>
  );
}
