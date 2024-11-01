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
    recordMeal: (state, action: PayloadAction<Meal>) => {
      // record just adds the meal to the array so it can be edited
      state.todaysMeals = state.todaysMeals.concat(action.payload);
    },
    logMeal: (state, action: PayloadAction<string>) => {
      // log meal makes it visible in today
      const mealIndex = state.todaysMeals.findIndex(
        (meal) => meal.mealId !== action.payload
      );
      state.todaysMeals[mealIndex].isAdded = true;
      state.todaysMeals = state.todaysMeals.filter((meal) => meal.isAdded);
    },
    removeMeal: (state, action: PayloadAction<string>) => {
      state.todaysMeals = state.todaysMeals.filter(
        (meal) => meal.mealId !== action.payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { recordMeal, logMeal, removeMeal } = foodSlice.actions;

export default foodSlice.reducer;
