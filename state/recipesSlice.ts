import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Ingredient, Meal } from "@/types/openAi.types";

export interface recipesState {
  recipes: Meal[];
}

const initialState: recipesState = {
  recipes: [],
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = recipesSlice.actions;

export default recipesSlice.reducer;
