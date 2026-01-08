import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useAppSelector } from "@/shared/hooks";
import { HR_EMPLOYEES_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from "@/shared/utils";

export default function ErrorFallback() {
  const { t } = useTranslation("ErrorBoundary");
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  return (
    <div className="mt-16 min-h-full w-full flex flex-col justify-center items-center px-4 text-center bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{t("title")}</h1>

      <p className="text-black mb-2">{t("description")}</p>

      <p className="text-black mb-6">
        {t("contact")}{" "}
        <Link to="/contact" className="text-info-500 underline">
          {t("contactLink")}
        </Link>
      </p>

      <Link
        to={isAuth ? HR_EMPLOYEES_PAGE_ROUTE : LOGIN_PAGE_ROUTE}
        className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors">
        {t("goHome")}
      </Link>
    </div>
  );
}
