import { FoodDetailedResponse } from "@/types/fatSecret.types";
import {
  DisplayedMacros,
  DisplayedMacroTypes,
  Ingredient,
  Meal,
} from "@/types/openAi.types";

export const getSummedMacros = (meals: Meal[]) => {
  let totals: DisplayedMacros = {
    calories: 0,
    carbohydrate: 0,
    fiber: 0,
    net_carbohydrates: 0,
    protein: 0,
    fat: 0,
    sugar: 0,
  };

  const keys = Object.keys(totals);

  for (let key of keys) {
    for (let meal of meals) {
      for (let ingredient of meal.ingredients) {
        totals[key] += parseInt(ingredient.serving[key]);
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
    "early morning snack",
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
    food_name: food.food.food_name,
    food_type: food.food.food_type,
    food_url: food.food.food_url,
    serving: {
      ...food.food.servings.serving[0],
      confidence: 10,
      net_carbohydrates: (
        parseInt(food.food.servings.serving[0].carbohydrate) -
        parseInt(food.food.servings.serving[0].fiber)
      ).toString(),
    },
  };
};
