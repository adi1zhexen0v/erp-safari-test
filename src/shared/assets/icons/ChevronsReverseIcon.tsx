import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export default function ChevronsReverseIcon({ size = 16, className, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M5.33325 5.99998L7.99992 3.33331L10.6666 5.99998M10.6666 9.99998L7.99992 12.6666L5.33325 9.99998"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
