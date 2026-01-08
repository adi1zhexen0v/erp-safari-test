import { type Icon } from "iconsax-react";
import cn from "classnames";
import { CheckIcon } from "@/shared/assets/icons";

export interface StepItem {
  id: string;
  label: string;
  icon: Icon;
}

interface Props {
  steps: StepItem[];
  activeStep: string;
  onStepChange: (stepId: string) => void;
  completedSteps?: string[];
  errorSteps?: string[];
  disabledSteps?: string[];
  disabledTooltip?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function StepsSwitcher({
  steps,
  activeStep,
  onStepChange,
  completedSteps = [],
  errorSteps = [],
  disabledSteps = [],
  disabledTooltip,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <div className={cn("p-7 rounded-[28px] surface-base-fill flex items-start justify-between gap-7", className)}>
      <div className="w-xs">
        <aside className="relative flex gap-2">
          <div className="flex flex-col mt-1.5 gap-1.5 items-center">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isError = errorSteps.includes(step.id);
              const isDisabled = disabledSteps.includes(step.id);
              const isLast = index === steps.length - 1;

              return (
                <>
                  <button
                    key={step.id}
                    onClick={() => {
                      if (isDisabled) return;
                      onStepChange(step.id);
                    }}
                    disabled={isDisabled}
                    title={isDisabled ? disabledTooltip : undefined}
                    className={cn(
                      "w-6 aspect-square rounded-md flex items-center justify-center text-label-xs transition-all duration-300",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      !isDisabled && "cursor-pointer",
                      isActive && !isDisabled && "primary-focused-radial-gradient text-white border border-primary-700",
                      isCompleted &&
                        !isActive &&
                        !isDisabled &&
                        "border primary-focused-radial-gradient border-primary-700 text-white",
                      isCompleted && isActive && !isDisabled && "text-white",
                      !isCompleted &&
                        !isActive &&
                        isError &&
                        !isDisabled &&
                        "negative-focused-radial-gradient text-white border border-negative-700",
                      !isActive &&
                        !isError &&
                        !isCompleted &&
                        !isDisabled &&
                        "surface-secondary-fill content-base-secondary",
                      isDisabled && "surface-secondary-fill content-base-secondary",
                    )}>
                    {isCompleted ? <CheckIcon /> : index + 1}
                  </button>

                  {!isLast && <span className="h-1.5 w-px bg-grey-200" />}
                </>
              );
            })}
          </div>

          <div className="flex flex-col gap-0.5">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isError = errorSteps.includes(step.id);
              const isDisabled = disabledSteps.includes(step.id);

              return (
                <button
                  key={step.id}
                  disabled={isDisabled}
                  title={isDisabled ? disabledTooltip : undefined}
                  className={cn(
                    "px-3 py-2.5 radius-xs flex items-center gap-2 transition-all duration-300",
                    isDisabled && "opacity-50 cursor-not-allowed",
                    !isDisabled && "cursor-pointer",
                    isActive && !isDisabled && "surface-secondary-fill",
                    !isActive && isError && !isDisabled && "bg-negative-100",
                  )}
                  onClick={() => {
                    if (isDisabled) return;
                    onStepChange(step.id);
                  }}>
                  <span className={isActive ? "content-action-brand" : "content-action-neutral"}>
                    <Icon size={16} variant={isActive ? "Bold" : "Linear"} color="currentColor" />
                  </span>

                  <p
                    className={
                      isActive
                        ? "text-body-bold-md content-base-primary"
                        : "text-body-regular-md content-base-secondary"
                    }>
                    {step.label}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <div className={cn("flex-1 p-7 radius-lg border surface-base-stroke", contentClassName)}>{children}</div>
    </div>
  );
}
