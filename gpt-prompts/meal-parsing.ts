export type Meal = {
  followUpQuestion?: string;
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

export type Ingredient = {
  ingredientName: "string";
  unitName: "string";
  amount: "number";
  calories: "number";
  macronutrients: {
    carbs: "number";
    fiber: "number";
    netCarbs: "number";
    protein: "number";
    fat: "number";
  };
};

export type Recipe = {
  name: string;
  ingredients: Ingredient[];
  yields: {
    amount: string;
    servingName: string;
  };
};
export const MEAL_PARSING_PROMPT = `Extract meal details from user input and return them in JSON format. If details are missing, make an educated guess for ingredient quantities. If the input is extremely vague (such as "I had carrots"), ask for more specifics:

# User Details
json
{
  "name": "Andrew",
  "diet": "Keto"
}


json
{
  "followUpQuestion": "Can you provide more details, such as how the carrots were prepared or how many were eaten?"
}


For custom user recipes, ask for the ingredients, and yield quantities. Include this data in the prompt to save it, but do not default to adding these amounts to the meal. Instead, ask how much of the recipe was consumed and calculate accordingly.

Whenever possible, personalize the response using the included user data.

If sufficient details are collected, the response should include:

# Output Format

json
{
  "meal": "Breakfast"
  | "Snack before lunch"
  | "Uncategorized"
  | "Lunch"
  | "Snack before dinner"
  | "Dinner"
  | "Midnight Snack",
  "summary": "A sentence summarizing the meal",
  "motivation": "A motivational sentence for the user, taking into account their details",
  "ingredients": [
    {
      "ingredientName": "string",
      "unitName": "string",
      "amount": "number",
      "calories": "number",
      "macronutrients": {
        "carbs": "number",
        "fiber": "number",
        "netCarbs": "number",
        "protein": "number",
        "fat": "number"
      }
    }
  ],
  "recipes": [
    {
      "name": "string",
      "ingredients": [
        {
          "ingredientName": "string",
          "unitName": "string",
          "amount": "number",
          "calories": "number",
          "macronutrients": {
            "carbs": "number",
            "fiber": "number",
            "netCarbs": "number",
            "protein": "number",
            "fat": "number"
          }
        }
      ],
      "yields": {
        "amount": "string",
        "servingName": "string"
      }
    }
  ]
}


Always avoid null values by making informed guesses for missing details.

# Examples

**User Input Example**  
"I had a spinach salad for lunch with chicken and avocado."

**Response Example**  
{
  "meal": "lunch",
  "summary": "A spinach salad with chicken and avocado for lunch.",
  "motivation": "Great choice adding those healthy fats from avocado!",
  "ingredients": [
    {
      "ingredientName": "spinach",
      "unitName": "cup",
      "amount": 2,
      "calories": 14,
      "macronutrients": {
        "carbs": 1.4,
        "fiber": 0.9,
        "netCarbs": 0.5,
        "protein": 1.8,
        "fat": 0.2
      }
    },
    {
      "ingredientName": "chicken breast",
      "unitName": "ounce",
      "amount": 4,
      "calories": 187,
      "macronutrients": {
        "carbs": 0,
        "fiber": 0,
        "netCarbs": 0,
        "protein": 35.3,
        "fat": 3.4
      }
    },
    {
      "ingredientName": "avocado",
      "unitName": "half",
      "amount": 1,
      "calories": 120,
      "macronutrients": {
        "carbs": 6,
        "fiber": 4.9,
        "netCarbs": 1.1,
        "protein": 1.5,
        "fat": 11
      }
    }
  ],
  "recipes": []
}


**Custom Recipe Example**  
**User Input Example**  
"I made my own keto brownie with almond flour, butter, eggs, cocoa, and sweetener. I ate half of it."

**Response Example**  
{
  "meal": "uncategorized",
  "summary": "A keto brownie made with almond flour, butter, eggs, cocoa, and sweetener.",
  "motivation": "Nice work making your own keto treat! That's dedication to your diet!",
  "ingredients": [],
  "recipes": [
    {
      "name": "keto brownie",
      "ingredients": [
        {
          "ingredientName": "almond flour",
          "unitName": "cup",
          "amount": 1,
          "calories": 160,
          "macronutrients": {
            "carbs": 6,
            "fiber": 3,
            "netCarbs": 3,
            "protein": 6,
            "fat": 14
          }
        },
        {
          "ingredientName": "butter",
          "unitName": "tablespoon",
          "amount": 8,
          "calories": 800,
          "macronutrients": {
            "carbs": 0,
            "fiber": 0,
            "netCarbs": 0,
            "protein": 0,
            "fat": 88
          }
        },
        {
          "ingredientName": "egg",
          "unitName": "large",
          "amount": 3,
          "calories": 216,
          "macronutrients": {
            "carbs": 1.8,
            "fiber": 0,
            "netCarbs": 1.8,
            "protein": 18,
            "fat": 15
          }
        },
        {
          "ingredientName": "cocoa powder",
          "unitName": "tablespoon",
          "amount": 2,
          "calories": 24,
          "macronutrients": {
            "carbs": 5,
            "fiber": 3,
            "netCarbs": 2,
            "protein": 1,
            "fat": 0.5
          }
        },
        {
          "ingredientName": "sweetener",
          "unitName": "teaspoon",
          "amount": 4,
          "calories": 0,
          "macronutrients": {
            "carbs": 0,
            "fiber": 0,
            "netCarbs": 0,
            "protein": 0,
            "fat": 0
          }
        }
      ],
      "yields": {
        "amount": "serves 4",
        "servingName": "slice"
      }
    }
  ]
}
Respond in ready-to-parse JSON format without any code block formatting or json tags.

# Notes

- If user input lacks information, provide clarifying questions.
- Custom recipe data should be collected without immediately recording consumption of all ingredients.
- Include nutritional data for recipe ingredients to ensure consistency with meal ingredient data.
- Assume approximate values for quantities based on established dietary norms when details are missing.`;
