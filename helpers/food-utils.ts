import { Ingredient, MacroNutrients, Meal } from "@/gpt-prompts/meal-parsing";
import { FoodDetailedResponse } from "@/types/fatSecret.types";

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
    "midnight snack",
  ];
  return meals.sort((meal1, meal2) => {
    return (
      mealRanking.findIndex((str) => str === meal1.meal.toLowerCase()) -
      mealRanking.findIndex((str) => str === meal2.meal.toLowerCase())
    );
  });
};

export const convertFatSecretFood = (
  food: FoodDetailedResponse
): Ingredient => {
  return {
    ingredientName: food.food.food_name,
    unitName: food.food.servings.serving[0].measurement_description,
    amount: parseInt(food.food.servings.serving[0].number_of_units),
    macronutrients: food.food.servings.serving[0],
  };
};
