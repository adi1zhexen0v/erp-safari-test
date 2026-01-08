import { useState } from "react";

export interface PromptState {
  title: string;
  text: string;
  variant?: "success" | "error" | "warning";
}

export function useContractModals() {
  const [downloadModal, setDownloadModal] = useState<{ id: number } | null>(null);
  const [uploadJobApplicationModal, setUploadJobApplicationModal] = useState<{ candidateId: number } | null>(null);
  const [uploadOrderModal, setUploadOrderModal] = useState<{ candidateId: number } | null>(null);
  const [prompt, setPrompt] = useState<PromptState | null>(null);

  return {
    downloadModal,
    setDownloadModal,
    uploadJobApplicationModal,
    setUploadJobApplicationModal,
    uploadOrderModal,
    setUploadOrderModal,
    prompt,
    setPrompt,
  };
}

