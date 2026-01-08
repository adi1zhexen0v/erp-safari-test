import { Outlet } from "react-router";
import { AccessibilitySwitcher, LanguageSwitcher } from "@/features/settings";

export default function PublicLayout() {
  return (
    <div className="surface-secondary-fill min-h-screen">
      <header className="max-w-7xl mx-auto flex py-4 justify-between items-center">
        <p></p>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AccessibilitySwitcher />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
