export type Meal = {
  mealId: string; //uuid
  isAdded?: boolean;
  followUpQuestion?: string;
  date: string;
  meal: MealCategories;
  summary: string;
  motivation: string;
  ingredients: Ingredient[];
};

export enum MealCategories {
  UNCATEGORIZED = "Uncategorized",
  SNACK_EARLY_MORNING = "Early morning snack",
  BREAKFAST = "Breakfast",
  SNACK_MID_MORNING = "Snack before lunch",
  LUNCH = "Lunch",
  SNACK_AFTERNOON = "Snack before dinner",
  DINNER = "Dinner",
  SNACK_MIDNIGHT = "Midnight Snack",
}

export type Serving = {
  serving_id?: string;
  serving_description: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
  number_of_units: string;
  measurement_description: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat: string;
  polyunsaturated_fat: string;
  monounsaturated_fat: string;
  cholesterol: string;
  sodium: string;
  potassium: string;
  fiber: string;
  sugar: string;
  vitamin_a: string;
  vitamin_c: string;
  calcium: string;
  iron: string;
  net_carbohydrates?: string; // fatsecret does not give us this so we need to calculate it on the fly
  confidence?: number; // used by openai to provide a score from 0-10 representing its confidence in the accuracy of the nutritional data
};

export enum DisplayedMacroTypes {
  calories = "calories",
  carbohydrate = "carbohydrate",
  fiber = "fiber",
  net_carbohydrates = "net_carbohydrates",
  protein = "protein",
  fat = "fat",
  sugar = "sugar",
}

export const DisplayedMacroConfig = [
  {
    type: DisplayedMacroTypes.calories,
    color: "#FF816E",
    displayName: "Calories",
    unit: " Calories",
    shortUnit: " Cal",
    primary: true,
  },
  {
    type: DisplayedMacroTypes.carbohydrate,
    color: "#FFCB6E",
    displayName: "Carbs",
    unit: " grams",
    shortUnit: "g",
    primary: false,
  },
  {
    type: DisplayedMacroTypes.net_carbohydrates,
    color: "#FFF86E",
    displayName: "Net Carbs",
    unit: " grams",
    shortUnit: "g",
    primary: true,
  },
  {
    type: DisplayedMacroTypes.fat,
    color: "#90FF6E",
    displayName: "Fat",
    unit: " grams",
    shortUnit: "g",
    primary: true,
  },
  {
    type: DisplayedMacroTypes.protein,
    color: "#69CEDF",
    displayName: "Protein",
    unit: " grams",
    shortUnit: "g",
    primary: true,
  },
  {
    type: DisplayedMacroTypes.fiber,
    color: "#6986DF",
    displayName: "Fiber",
    unit: " grams",
    shortUnit: "g",
    primary: false,
  },
  {
    type: DisplayedMacroTypes.sugar,
    color: "#FF6ED8",
    displayName: "Sugar",
    unit: " grams",
    shortUnit: "g",
    primary: false,
  },
];

export const DisplayedMacroIterator = DisplayedMacroConfig.map((displayed) => {
  return displayed.type;
});

export type DisplayedMacros = {
  calories: number;
  carbohydrate: number;
  fiber: number;
  net_carbohydrates: number;
  protein: number;
  fat: number;
  sugar: number;
};

export type Ingredient = {
  food_name: string;
  food_type: string;
  food_url: string;
  serving: Serving;
};

export type Recipe = {
  name: string;
  ingredients: Ingredient[];
  yields: {
    amount: string;
    servingName: string;
  };
};
