interface Props {
  size?: number;
  color?: string;
}

export default function ChevronRightIcon({ size = 20, color = "currentColor" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.20001 13.6L11.8 10L8.20001 6.4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
