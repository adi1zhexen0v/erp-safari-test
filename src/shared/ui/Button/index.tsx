import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router";
import cn from "classnames";
import "./Button.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "plain" | "danger" | "destructive" | "dashed";
  size?: "sm" | "md" | "lg" | "huge";
  className?: string;
  isIconButton?: boolean;
  link?: string;
}

export default function Button({
  children = "Button",
  variant = "primary",
  size = "huge",
  type = "button",
  isIconButton = false,
  className,
  link,
  disabled,
  onClick,
  ...rest
}: Props) {
  if (link) {
    return (
      <Link
        to={disabled ? "#" : link}
        className={cn("btn", `btn-${variant}`, `btn-${size}`, className, {
          "btn-icon": isIconButton,
          "btn-base": !isIconButton,
        })}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e as any);
        }}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn("btn", `btn-${variant}`, `btn-${size}`, className, {
        "btn-icon": isIconButton,
        "btn-base": !isIconButton,
      })}
      {...rest}>
      {children}
    </button>
  );
}
