import { Paperclip2 } from "iconsax-react";

interface Props {
  file?: File | null;
  existingFileUrl?: string | null;
}

export default function FileViewer({ file, existingFileUrl }: Props) {
  const show = Boolean(file) || Boolean(existingFileUrl);
  if (!show) return null;

  const fileUrl = file ? URL.createObjectURL(file) : existingFileUrl!;

  const fileName = file
    ? file.name
    : decodeURIComponent(existingFileUrl!.split("/").pop()?.split("?")[0] ?? "document");

  function humanSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="surface-tertiary-fill rounded-[10px] p-0.5 input-box-shadow flex items-center">
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center gap-2 radius-xs surface-base-fill py-3 px-2 pr-4 cursor-pointer hover:opacity-90 transition min-w-0">
        <span className="content-base-low shrink-0">
          <Paperclip2 size={16} color="currentColor" />
        </span>
        <p className="content-base-primary text-label-sm truncate min-w-0 flex-1">{fileName}</p>
        {file && <span className="text-label-sm content-action-neutral shrink-0">{humanSize(file.size)}</span>}
      </a>
    </div>
  );
}

