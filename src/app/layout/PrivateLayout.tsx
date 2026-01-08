import { Outlet } from "react-router";
import { Header, Sidebar } from "@/shared/components";

export default function PrivateLayout() {
  return (
    <div className="flex h-screen surface-secondary-fill overflow-hidden">
      <Sidebar />
      <main className="flex flex-col w-full min-w-0">
        <Header />
        <div className="flex-1 h-full px-5 pb-5 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
