import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Logout } from "iconsax-react";
import { useLogoutMutation } from "@/features/auth/api";
import { logout } from "@/features/auth/slice";
import { mapAuthUserToGetMeResponse } from "@/features/auth/utils";
import { ChevronsReverseIcon } from "@/shared/assets/icons";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { Button, Dropdown, DropdownItem } from "@/shared/ui";
import { LOGIN_PAGE_ROUTE } from "@/shared/utils";

export default function ProfileButton({ isCollapsed }: { isCollapsed?: boolean }) {
  const navigate = useNavigate();
  const { t } = useTranslation("Sidebar");
  const [isOpen, setIsOpen] = useState(false);

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

  const formattedName = user?.full_name
    ? (() => {
        const parts = user.full_name.split(" ").filter(Boolean).slice(0, 2);
        if (parts.length === 2) {
          return `${parts[0]} ${parts[1].charAt(0)}.`;
        }
        return parts.join(" ");
      })()
    : "";

  const [logoutRequest, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();

  async function handleLogout() {
    if (isLoading) return;
    try {
      await logoutRequest().unwrap();
      dispatch(logout());
      navigate(LOGIN_PAGE_ROUTE);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (isCollapsed) {
    return (
      <Dropdown open={isOpen} onClose={() => setIsOpen(false)} width="w-auto" direction="top">
        <button
          onClick={() => setIsOpen((p) => !p)}
          className="w-8 h-8 flex items-center justify-center rounded-full background-brand-subtle cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-black text-xs font-bold">{initials}</span>
        </button>
        <DropdownItem
          onClick={handleLogout}
          className={isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}>
          <Logout size={16} color="currentColor" />
          {isLoading ? t("logout.loading") : t("logout")}
        </DropdownItem>
      </Dropdown>
    );
  }

  return (
    <Dropdown open={isOpen} onClose={() => setIsOpen(false)} width="w-full" direction="top">
      <Button
        variant="secondary"
        className="flex items-center justify-between p-2! w-full"
        onClick={() => setIsOpen((p) => !p)}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center rounded-full background-brand-subtle shrink-0">
            <span className="text-black text-xs font-bold">{initials}</span>
          </div>
          <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
            <p className="text-label-sm text-left content-base-primary truncate w-full">{formattedName}</p>
            <span className="text-body-regular-xs text-left content-base-secondary truncate w-full">{user?.email}</span>
          </div>
        </div>

        <div className="relative icon-secondary">
          <ChevronsReverseIcon size={16} />
        </div>
      </Button>
      <DropdownItem
        onClick={handleLogout}
        className={isLoading ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}>
        <Logout size={16} color="currentColor" />
        {isLoading ? t("logout.loading") : t("logout")}
      </DropdownItem>
    </Dropdown>
  );
}

