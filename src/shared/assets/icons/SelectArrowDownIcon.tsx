interface SelectArrowDownIconProps {
  className?: string;
}

export default function SelectArrowDownIcon({ className }: SelectArrowDownIconProps = {}) {
  return (
    <svg 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className || "w-4 h-4"}
      style={{ width: "1rem", height: "1rem" }}
    >
      <g clipPath="url(#clip0_249_608)">
        <path
          d="M13.28 5.96664L8.9333 10.3133C8.41997 10.8266 7.57997 10.8266 7.06664 10.3133L2.71997 5.96664"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_249_608">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
