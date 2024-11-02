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
  for (let key of keys) {
    totals[key] = Math.round(totals[key]);
  }
  return totals;
};

export const sortMealsByCategory = (meals: Meal[]) => {
  const mealRanking: string[] = [
    "uncategorized",
    "breakfast",
    "snack before lunch",
    "lunch",
    "snack before dinner",
    "dinner",
    "midnight Snack",
  ];
  console.log(meals);
  return meals.sort((meal1, meal2) => {
    console.log(
      meal1.meal,
      mealRanking.findIndex((str) => str === meal1.meal.toLowerCase())
    );
    return (
      mealRanking.findIndex((str) => str === meal1.meal.toLowerCase()) -
      mealRanking.findIndex((str) => str === meal2.meal.toLowerCase())
    );
  });
};
