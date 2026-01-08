import cn from "classnames";
import { CloseIcon } from "@/shared/assets/icons";

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function ModalWrapper({ onClose, children, width = "w-md" }: ModalWrapperProps) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen surface-backdrop blur-level-1 flex justify-center items-center z-[10001]"
      onClick={onClose}>
      <div
        className={cn(
          `
            background-static-white radius-lg prompt-box-shadow 
            relative flex flex-col 
            ${width} 
            p-8 gap-6
          `,
        )}
        onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-8 right-8 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onClose}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}
