import { type ReactElement, type ReactNode, cloneElement, Children, isValidElement } from "react";
import RadioButton from "./RadioButton";

interface RadioButtonProps {
  value: string;
  name?: string;
  checked?: boolean;
  onChange?: () => void;
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  name: string;
  wrapperClassName?: string;
}

export default function RadioGroup({ value, onChange, children, name, wrapperClassName }: Props) {
  const handle = (val: string) => onChange?.(val);

  const mappedChildren = Children.toArray(children).map((child) => {
    if (!isValidElement(child)) return child;

    const element = child as ReactElement<RadioButtonProps>;

    if (element.type !== RadioButton) return child;

    return cloneElement(element, {
      name,
      checked: element.props.value === value,
      onChange: () => handle(element.props.value),
    });
  });

  return <div className={wrapperClassName}>{mappedChildren}</div>;
}
