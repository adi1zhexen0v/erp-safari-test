import { useMemo } from "react";
import type { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import { BANKS, type Bank } from "@/shared/consts/banks";

interface UseBankSelectionParams<T extends FieldValues> {
  bankName: string;
  bankBik: string;
  setValue: UseFormSetValue<T>;
  bankNameField: Path<T>;
  bankBikField: Path<T>;
}

export function useBankSelection<T extends FieldValues>({
  bankName,
  bankBik,
  setValue,
  bankNameField,
  bankBikField,
}: UseBankSelectionParams<T>) {
  const selectedBank = useMemo(() => {
    if (bankBik) {
      return BANKS.find((bank) => bank.bik === bankBik) || (bankName ? BANKS.find((bank) => bank.name === bankName) : null);
    }
    return null;
  }, [bankBik, bankName]);

  const handleBankChange = (bank: Bank | null) => {
    if (bank) {
      setValue(bankNameField, bank.name as PathValue<T, Path<T>>, { shouldValidate: true });
      setValue(bankBikField, bank.bik as PathValue<T, Path<T>>, { shouldValidate: true });
    } else {
      setValue(bankNameField, "" as PathValue<T, Path<T>>, { shouldValidate: true });
      setValue(bankBikField, "" as PathValue<T, Path<T>>, { shouldValidate: true });
    }
  };

  return {
    selectedBank,
    handleBankChange,
  };
}

