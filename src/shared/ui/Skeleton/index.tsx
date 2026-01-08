import SkeletonLib, { type SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Skeleton(props: SkeletonProps) {
  return (
    <SkeletonLib baseColor="var(--skeleton-base)" highlightColor="var(--skeleton-highlight)" duration={2} {...props} />
  );
}
