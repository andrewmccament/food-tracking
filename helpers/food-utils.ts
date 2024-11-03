import { FoodDetailedResponse } from "@/types/fatSecret.types";
import {
  DisplayedMacros,
  DisplayedMacroTypes,
  Ingredient,
  Meal,
  Serving,
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

export const scaleServing = (serving: Serving, actualAmount: number) => {
  if (!(serving && !Number.isNaN(actualAmount))) return null;
  const baseAmount = parseInt(serving.number_of_units);
  const divisor = baseAmount / actualAmount;
  return {
    ...serving,
    serving_description: `${actualAmount.toFixed(2)} ${
      serving.metric_serving_unit
    }`,
    metric_serving_amount: actualAmount.toFixed(3),
    number_of_units: actualAmount.toFixed(3),
    calories: divideString(serving.calories, divisor),
    carbohydrate: divideString(serving.carbohydrate, divisor),
    net_carbohydrates: divideString(
      (parseFloat(serving.carbohydrate) - parseFloat(serving.fiber)).toString(),
      divisor
    ),
    protein: divideString(serving.protein, divisor),
    fat: divideString(serving.fat, divisor),
    saturated_fat: divideString(serving.saturated_fat, divisor),
    polyunsaturated_fat: divideString(serving.polyunsaturated_fat, divisor),
    monounsaturated_fat: divideString(serving.monounsaturated_fat, divisor),
    cholesterol: divideString(serving.cholesterol, divisor),
    sodium: divideString(serving.sodium, divisor),
    potassium: divideString(serving.potassium, divisor),
    fiber: divideString(serving.fiber, divisor),
    sugar: divideString(serving.sugar, divisor),
    vitamin_a: divideString(serving.vitamin_a, divisor),
    vitamin_c: divideString(serving.vitamin_c, divisor),
    calcium: divideString(serving.calcium, divisor),
    iron: divideString(serving.iron, divisor),
  };
};

const divideString = (str: string, divisor: number) =>
  (parseFloat(str) / divisor).toFixed(2);
