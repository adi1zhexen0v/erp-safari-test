/**
 * Скачивает blob как файл с указанным именем
 * @param blob - Blob объект для скачивания
 * @param filename - Имя файла для скачивания
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = filename;
  window.document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  window.document.body.removeChild(a);
}

