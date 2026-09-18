import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DisplayedMacros } from "@/types/openAi.types";

export interface userDataState {
  goals: DisplayedMacros;
  goalCalculationInputs: GoalCalculationInputs;
}

// These inputs are intentionally separate from the manually editable goals.
// A future calculator can use them to suggest goals without overwriting a
// user's choices unless they explicitly accept the suggestions.
export type GoalCalculationInputs = {
  sex?: "male" | "female" | "unspecified";
  heightInches?: number;
  weightLbs?: number;
  targetWeightLbs?: number;
  weeklyWeightChangeLbs?: number;
};

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
  goalCalculationInputs: {
    sex: "unspecified",
  },
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
