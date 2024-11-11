export const RECIPE_UTILIZATION_PROMPT = `

Based on the user created recipes: 

Decide if the user's prompt likely references any of these saved recipes, and if so,
1. ask using the following format:
{
followUpQuestion: "Do you want to use your saved recipes (recipe.title) and (recipe.title)?"
}
Depending on the response,
2. decide the serving amounts the user ate of each nested ingredient (using the yield field) using the units specified in the recipe.  (For example, user ate 0.125 cups of x.)  Finally, rewrite the input the user gave accordingly.    DO NOT remove any other ingredients that aren't related to the recipe.

For example, if the input is "For breakfast I had a peanut butter cookie and a cup of milk", then the output should be
{
"transformedInput": For breakfast I had Creamy peanut butter: 0.0833 cups (~21.5 g), Keto-friendly sweetener: Approximately 0.0208 - 0.0278 cups (~2.5 - 3.33 g),  Egg: 0.0833 large egg (~4.17 g), Vanilla extract: 0.0417 tsp (~0.104 g), Baking powder: 0.0417 tsp (~0.058 g), and Peanut butter flavor baking chips: 0.167 servings (~0.333 g), and 8 oz of milk"  
}

Always respond in JSON format, either 
{
"followUpQuestion": string
}

or {
"transformedInput": string
}


`;
