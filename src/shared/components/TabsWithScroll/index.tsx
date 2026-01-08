import { useRef, useEffect, useState } from "react";
import cn from "classnames";

interface SectionItem {
  id: string;
  label: string;
  ref: React.RefObject<HTMLDivElement>;
}

interface Props {
  items: SectionItem[];
}

export default function TabsWithScroll({ items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(items[0]?.id);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function scrollToSection(item: SectionItem) {
    setActiveId(item.id);
    item.ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      ref={containerRef}
      className={cn("flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap border-b border-alpha-black-10")}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            className={cn(
              "py-2 text-grey-400 text-label-sm cursor-pointer",
              isActive && "content-action-brand border-b-2 background-brand-stroke",
            )}
            onClick={() => scrollToSection(item)}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
