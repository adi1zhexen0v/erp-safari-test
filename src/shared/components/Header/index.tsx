import { useTranslation } from "react-i18next";
import { Add, ArrowDown2, Command, DirectNormal } from "iconsax-react";
import { mapAuthUserToGetMeResponse } from "@/features/auth/utils";
import { AccessibilitySwitcher, LanguageSwitcher } from "@/features/settings";
import { SearchIcon } from "@/shared/assets/icons";
import { useAppSelector } from "@/shared/hooks/redux";
import { Button, Input } from "@/shared/ui";

export default function Header() {
  const { t } = useTranslation("Header");
  const { user: res } = useAppSelector((state) => state.auth.data ?? { user: null });
  const user = mapAuthUserToGetMeResponse(res);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
    : "";

  return (
    <header className="w-full p-5 flex justify-between items-center">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-label-md content-base-primary">
          {t("ngo")} "{user?.organization.name ?? ""}"
        </h2>
        <p className="text-body-regular-sm content-base-secondary">{t("welcome")}</p>
      </div>

      <div className="flex justify-end items-center gap-3 relative">
        {/* <Input
          placeholder={t("searchPlaceholder")}
          className="py-2.5! rounded-xl!"
          icon={<SearchIcon size={16} color="currentColor" />}>
          <div className="absolute top-1.5 right-2 flex p-2 surface-secondary-fill content-base-secondary rounded-lg">
            <Command size={12} color="currentColor" />
            <Add size={12} color="currentColor" />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.25 10.6794L2.25 1.32063L3.81629 1.32063L3.81629 5.66205L7.55329 1.32063L9.47704 1.32063L5.45407 5.90901L9.75 10.6794L7.76127 10.6794L3.81629 6.31196V10.6794H2.25Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Input>

        <span className="w-px h-6 bg-alpha-black-10"></span> */}

        {/* <Button variant="secondary">
          <Add size={16} color="currentColor" />
          <span>{t("create")}</span>
          <ArrowDown2 size={16} color="currentColor" />
        </Button> */}

        <LanguageSwitcher />

        <AccessibilitySwitcher />

        {/* <Button variant="secondary" isIconButton className="p-0!">
          <DirectNormal size={20} color="currentColor" />
        </Button> */}

        <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full background-brand-subtle">
          <span className="text-black text-sm font-bold">{initials}</span>
        </div>
      </div>
    </header>
  );
}

