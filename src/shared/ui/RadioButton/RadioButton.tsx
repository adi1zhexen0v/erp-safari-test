import type { InputHTMLAttributes } from "react";
import cn from "classnames";
import styles from "./RadioButton.module.css";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export default function RadioButton({ id, label, className, disabled, ...rest }: Props) {
  return (
    <label htmlFor={id} className={cn(styles.wrapper, disabled && styles.disabled, className)}>
      <input id={id} type="radio" disabled={disabled} className={styles.input} {...rest} />

      <span className={styles.control} />

      {label && <span className="text-body-regular-sm content-base-primary">{label}</span>}
    </label>
  );
}
