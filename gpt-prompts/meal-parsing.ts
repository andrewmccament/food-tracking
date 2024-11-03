export const MEAL_PARSING_PROMPT = `
If you have enough information to do so, attempt to parse the input into a Meal in the following JSON format: 
{
  followUpQuestion?: string; // only used if you do not have enough info to populate the other fields.
  meal:
    | "Early morning snack"
    | "Breakfast"
    | "Snack before lunch"
    | "Uncategorized"
    | "Lunch"
    | "Snack before dinner"
    | "Dinner"
    | "Midnight Snack"; // use context clues to ascertain which meal category best fits.  ONLY USE THESE VALUES.
  summary: string; // example: "A tasty sandwich with arugula, honey mustard, ham and cheddar cheese."
  motivation: string; //example: "Well done!  You did a great job incorporating green vegetables."
  ingredients: Ingredient[]
}

Where Ingredient's structure is: 
{ 
    food_name: string;
    food_type: string;
    food_url: string;
      serving: {
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
        net_carbohydrates: string;
        confidence: number; // use this to provide a score from 0-10 representing your confidence in the accuracy of the nutritional data
    };
  }

An example of serving data is as follows: {
          "serving_description": "1 tbsp",
          "metric_serving_amount": "14.900",
          "metric_serving_unit": "g",
          "number_of_units": "1.000",
          "measurement_description": "tbsp",
          "calories": "51",
          "carbohydrate": "0.42",
          "protein": "0.31",
          "fat": "5.51",
          "saturated_fat": "3.432",
          "polyunsaturated_fat": "0.205",
          "monounsaturated_fat": "1.592",
          "cholesterol": "20",
          "sodium": "6",
          "potassium": "11",
          "fiber": "0",
          "sugar": "0.02",
          "vitamin_a": "61",
          "vitamin_c": "0.1",
          "calcium": "10",
          "iron": "0.00"
        }

Rules:
1. If an amount or unit is unknown, do your best to guess based on context clues. For example, "a peanut butter sandwich" - you'd assume two slices of bread and a tablespoon of peanut butter, for example.
2. If you need more information, return the following:
{
followUpQuestion: "How many carrots did you consume and how were they cooked"
} for example.
3. Always return ingredients in standard units of measurement, even if conversions are needed.
4. Do your very best to avoid any null values.
5. Only return JSON that is ready to JSON.parse() - no tags.
`;
