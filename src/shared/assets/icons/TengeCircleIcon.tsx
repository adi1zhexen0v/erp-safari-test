interface Props {
  size?: number | string;
  className?: string;
}

export default function TengeCircleIcon({ size = 18, className }: Props) {
  const numericSize = typeof size === "string" ? parseInt(size, 10) || 18 : size || 18;
  return (
    <svg
      width={numericSize}
      height={numericSize}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <g clipPath="url(#clip0)">
        <path
          d="M9 8.25V12.75M12 6L6 6M12 8.25L6 8.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
