import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DisplayedMacros } from "@/types/openAi.types";

export interface userDataState {
  goals: DisplayedMacros;
}

export const defaultUserGoals: DisplayedMacros = {
  calories: 1900,
  carbohydrate: 200,
  fiber: 30,
  net_carbohydrates: 170,
  protein: 150,
  fat: 65,
  sugar: 50,
};

const initialState: userDataState = {
  goals: defaultUserGoals,
};

export const resetDefaultUserGoals = (state?: Partial<userDataState>) => ({
  ...state,
  goals: defaultUserGoals,
});

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<Partial<DisplayedMacros>>) => {
      state.goals = {
        ...state.goals,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGoals } = userDataSlice.actions;

export default userDataSlice.reducer;
