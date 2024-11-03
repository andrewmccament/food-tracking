import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Serving, Meal } from "@/gpt-prompts/meal-parsing";

export interface userDataState {
  goals: Serving;
}

const initialState: userDataState = {
  goals: {
    calories: 1800,
    carbohydrate: 30,
    fiber: 20,
    net_carbohydrates: 20,
    protein: 160,
    fat: 150,
    sugar: 10,
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
