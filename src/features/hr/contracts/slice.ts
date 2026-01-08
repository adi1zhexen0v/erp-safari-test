import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ContractFormValues, SectionId } from "@/features/hr/contracts/types";

interface WorkContractState {
  data: ContractFormValues | null;
  sectionCompleteness: Record<SectionId, boolean>;
  isReadyForSigning: boolean;
}

const initialState: WorkContractState = {
  data: null,
  sectionCompleteness: {
    basic_info: false,
    position_duties: false,
    work_schedule: false,
  },
  isReadyForSigning: false,
};

export const workContractSlice = createSlice({
  name: "workContract",
  initialState,
  reducers: {
    setContractData(state, action: PayloadAction<ContractFormValues>) {
      state.data = action.payload;
    },

    setSectionCompleteness(state, action: PayloadAction<{ section: SectionId; complete: boolean }>) {
      const { section, complete } = action.payload;
      state.sectionCompleteness[section] = complete;
    },

    resetContractState() {
      return initialState;
    },

    setReadyForSigning(state, action: PayloadAction<boolean>) {
      state.isReadyForSigning = action.payload;
    },
  },
});

export const { setContractData, setSectionCompleteness, resetContractState, setReadyForSigning } = workContractSlice.actions;

