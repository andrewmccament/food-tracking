import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { MacroNutrients, Meal } from "@/gpt-prompts/meal-parsing";

export interface userDataState {
  goals: MacroNutrients;
}

const initialState: userDataState = {
  goals: {
    calories: 1800,
    carbs: 30,
    fiber: 20,
    netCarbs: 20,
    protein: 160,
    fat: 150,
  },
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    logMeal: (state, action: PayloadAction<Meal>) => {},
  },
});

// Action creators are generated for each case reducer function
export const { logMeal } = userDataSlice.actions;

export default userDataSlice.reducer;
