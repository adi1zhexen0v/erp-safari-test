import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Global } from "iconsax-react";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { value: "ru", label: "Русский" },
    { value: "kk", label: "Қазақша" },
    { value: "en", label: "English" },
  ];

  return (
    <Dropdown open={open} onClose={() => setOpen(false)} width="w-36">
      <Button variant="secondary" isIconButton onClick={() => setOpen((prev) => !prev)} className="p-0!">
        <Global size={20} color="currentColor" />
      </Button>

      {languages.map((lng) => (
        <DropdownItem
          key={lng.value}
          active={i18n.language === lng.value}
          onClick={() => {
            i18n.changeLanguage(lng.value);
            setOpen(false);
          }}>
          {lng.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

