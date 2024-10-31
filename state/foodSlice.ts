import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Meal } from "@/gpt-prompts/meal-parsing";

export interface foodState {
  todaysMeals: Meal[];
}

const initialState: foodState = {
  todaysMeals: [],
};

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    logMeal: (state, action: PayloadAction<Meal>) => {
      state.todaysMeals = state.todaysMeals.concat(action.payload);
      console.log(state.todaysMeals);
    },
  },
});

// Action creators are generated for each case reducer function
export const { logMeal } = foodSlice.actions;

export default foodSlice.reducer;
