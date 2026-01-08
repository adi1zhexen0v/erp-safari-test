import { useTranslation } from "react-i18next";

interface ApiError {
  data?: {
    error?: string;
    message?: string;
    detail?: string;
  };
}

interface UseApiErrorHandlerParams {
  namespace: string;
  setPrompt: (prompt: { title: string; text: string; variant?: "success" | "error" }) => void;
}

export function useApiErrorHandler({ namespace, setPrompt }: UseApiErrorHandlerParams) {
  const { t } = useTranslation(namespace);

  const handleApiError = (err: unknown, defaultMessageKey: string) => {
    const apiError = err as ApiError;
    const errorMessage =
      apiError?.data?.error || apiError?.data?.message || apiError?.data?.detail || t(defaultMessageKey);
    setPrompt({
      title: t("messages.errorTitle"),
      text: errorMessage,
      variant: "error",
    });
  };

  return { handleApiError };
}
