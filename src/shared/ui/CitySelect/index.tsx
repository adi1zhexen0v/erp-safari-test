import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/shared/utils/types";
import { useGetCitiesQuery } from "@/shared/api/common";
import type { CityResponse } from "@/shared/api/common";
import SearchableSelect from "../SearchableSelect";

interface CitySelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: number | undefined; // cityId вместо CityResponse
  onChange?: (cityId: number | undefined) => void; // возвращает cityId
  width?: string;
  disabled?: boolean;
}

export default function CitySelect({
  label,
  error,
  placeholder,
  searchPlaceholder,
  value, // cityId
  onChange,
  width = "w-full",
  disabled = false,
}: CitySelectProps) {
  const { i18n, t } = useTranslation("Common");
  const locale = i18n.language as Locale;
  const { data: cities = [], isLoading } = useGetCitiesQuery();

  // Находим выбранный город по cityId
  const selectedCity = useMemo(() => {
    if (!value || cities.length === 0) return null;
    return cities.find((city) => city.id === value) || null;
  }, [value, cities]);

  const getCityDisplayName = (city: CityResponse): string => {
    return locale === "kk" ? city.name_kk : city.name_ru;
  };

  const loadingPlaceholder = isLoading ? t("loadingCities") : placeholder;

  return (
    <SearchableSelect<CityResponse>
      label={label}
      error={error}
      placeholder={loadingPlaceholder}
      searchPlaceholder={searchPlaceholder}
      options={cities}
      value={selectedCity}
      onChange={(city) => {
        // Передаем cityId вместо CityResponse
        onChange?.(city?.id ?? undefined);
      }}
      searchKeys={["name_ru", "name_kk", "region_ru", "region_kk"]}
      displayKey="name_ru"
      getOptionLabel={getCityDisplayName}
      width={width}
      disabled={disabled || isLoading}
    />
  );
}

