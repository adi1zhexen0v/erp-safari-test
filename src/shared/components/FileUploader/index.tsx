import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { ExportCurve, Paperclip2 } from "iconsax-react";
import { CloseIcon } from "@/shared/assets/icons";

interface FileUploadProps {
  label?: string;
  maxSizeMB?: number;
  accept?: string;
  value?: File | null;
  existingFileUrl?: string | null;
  onChange?: (file: File | null) => void;
  onRemoveExisting?: () => void;
  error?: string | null;
  namespace?: string;
  formatsText?: string;
}

export default function FileUploader({
  label,
  maxSizeMB = 5,
  accept = ".pdf,.jpg,.jpeg,.png",
  value,
  existingFileUrl,
  onChange,
  onRemoveExisting,
  error,
  namespace = "ApplyApplicationPage",
  formatsText,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { t } = useTranslation(namespace);

  const existingFileName = useMemo(() => {
    if (!existingFileUrl) return null;
    return decodeURIComponent(existingFileUrl.split("/").pop()?.split("?")[0] ?? "document");
  }, [existingFileUrl]);

  function processFile(file: File | null) {
    if (!file) {
      setValidationError(null);
      onChange?.(null);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setValidationError(t("file_uploader.errors.file_too_large", { max: maxSizeMB }));
      return;
    }
    const allowedExtensions = accept.split(",").map((ext) => ext.trim().toLowerCase());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setValidationError(t("file_uploader.errors.invalid_format"));
      return;
    }

    setValidationError(null);
    onChange?.(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    processFile(file);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] ?? null;
    processFile(file);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function handleRemove() {
    if (existingFileUrl && !value) {
      onRemoveExisting?.();
    } else {
      onChange?.(null);
    }
    setValidationError(null);
  }

  const showFileCard = Boolean(value) || Boolean(existingFileUrl);
  const fileUrl = value ? URL.createObjectURL(value) : existingFileUrl!;
  const displayError = error || validationError;

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-body-bold-sm content-base-primary">{label}</p>}

      {showFileCard && (
        <div className="surface-tertiary-fill rounded-[10px] p-0.5 input-box-shadow flex items-center">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center gap-2 radius-xs surface-base-fill py-3 px-2 cursor-pointer hover:opacity-90 transition min-w-0">
            <span className="content-base-low shrink-0">
              <Paperclip2 size={16} color="currentColor" />
            </span>
            <p className="content-base-primary text-label-sm truncate min-w-0 flex-1">
              {value?.name ?? existingFileName}
            </p>
            {value && <span className="text-label-sm content-action-neutral shrink-0">{humanSize(value.size)}</span>}
          </a>

          <button
            type="button"
            onClick={handleRemove}
            className="w-10 aspect-square flex items-center justify-center content-action-neutral hover:opacity-80 transition shrink-0">
            <CloseIcon />
          </button>
        </div>
      )}

      {!showFileCard && (
        <div
          tabIndex={0}
          role="button"
          className={cn(
            "radius-sm border border-dashed surface-tertiary-stroke surface-base-fill flex flex-col items-center justify-center gap-3 py-12 px-7 cursor-pointer transition w-full",
            "input-box-shadow outline-none",
            isDragging && "surface-secondary-fill!",
            displayError && "border-action-negative",
          )}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}>
          <div className="flex items-center justify-center gap-2">
            <span className="content-base-secondary">
              <ExportCurve size={16} color="currentColor" />
            </span>
            <p className="text-body-bold-sm content-base-primary text-center">{t("file_uploader.drop_here")}</p>
          </div>

          <p className="text-body-regular-xs text-grey-400 text-center">
            {formatsText || t("file_uploader.formats", { max: maxSizeMB })}
          </p>

          <input type="file" ref={inputRef} className="hidden" accept={accept} onChange={handleSelect} />
        </div>
      )}

      {displayError && <p className="text-body-regular-xs content-action-negative">{displayError}</p>}
    </div>
  );
}
