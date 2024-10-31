import { MacroNutrients, Meal } from "@/gpt-prompts/meal-parsing";
import React from "react";

export const getSummedMacros = (meals: Meal[]) => {
  let totals: MacroNutrients = {
    calories: 0,
    carbs: 0,
    fiber: 0,
    netCarbs: 0,
    protein: 0,
    fat: 0,
  };

  const keys = Object.keys(totals);

  for (let key of keys) {
    for (let meal of meals) {
      for (let ingredient of meal.ingredients) {
        totals[key] += ingredient.macronutrients[key];
      }
    }
  }
  console.log("totals", totals);
  return totals;
};
