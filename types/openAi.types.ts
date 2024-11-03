export type Meal = {
  mealId: string; //uuid
  isAdded?: boolean;
  followUpQuestion?: string;
  date: string;
  meal:
    | "Breakfast"
    | "Snack before lunch"
    | "Uncategorized"
    | "Lunch"
    | "Snack before dinner"
    | "Dinner"
    | "Midnight Snack";
  summary: string;
  motivation: string;
  ingredients: Ingredient[];
  recipes: Recipe[];
};

export type MacroNutrients = {
  calories: number;
  carbs: number;
  fiber: number;
  netCarbs: number;
  protein: number;
  fat: number;
};

export enum MacroNutrientEnum {
  calories = "calories",
  carbs = "carbs",
  fiber = "fiber",
  netCarbs = "netCarbs",
  protein = "protein",
  fat = "fat",
}

export type Ingredient = {
  ingredientName: string;
  unitName?: string;
  amount?: number;
  macronutrients: MacroNutrients;
};

export type Recipe = {
  name: string;
  ingredients: Ingredient[];
  yields: {
    amount: string;
    servingName: string;
  };
};
