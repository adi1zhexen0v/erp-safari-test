import { useState } from "react";
import { Eye, EyeSlash } from "iconsax-react";
import { Button, Dropdown } from "@/shared/ui";
import AccessibilityPanel from "./AccessibilityPanel";

export default function AccessibilitySwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown open={open} onClose={() => setOpen(false)} width="w-auto">
      <Button
        variant="secondary"
        isIconButton
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-0!">
        {open ? <EyeSlash size={20} color="currentColor" /> : <Eye size={20} color="currentColor" />}
      </Button>
      <AccessibilityPanel />
    </Dropdown>
  );
}
