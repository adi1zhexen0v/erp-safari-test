import type { TFunction } from "i18next";

export interface ApiError {
  data?: {
    error?: string;
    message?: string;
    detail?: string;
    non_field_errors?: string[];
    [key: string]: unknown;
  };
}

export function extractErrorMessage(error: unknown, defaultKey: string, t: TFunction): string {
  const apiError = error as ApiError;

  if (
    apiError?.data?.non_field_errors &&
    Array.isArray(apiError.data.non_field_errors) &&
    apiError.data.non_field_errors.length > 0
  ) {
    return apiError.data.non_field_errors[0];
  }

  if (apiError?.data && typeof apiError.data === "object") {
    const errorMessages: string[] = [];
    for (const [, value] of Object.entries(apiError.data)) {
      if (Array.isArray(value) && value.length > 0) {
        errorMessages.push(...(value as string[]));
      } else if (typeof value === "string") {
        errorMessages.push(value);
      }
    }
    if (errorMessages.length > 0) {
      return errorMessages[0];
    }
  }

  if (apiError?.data?.error) {
    return apiError.data.error;
  }

  if (apiError?.data?.message) {
    return apiError.data.message;
  }

  if (apiError?.data?.detail) {
    return apiError.data.detail;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Fallback to default translated message
  return t(defaultKey);
}
