import { Ingredient, Meal, MacroNutrients } from "@/gpt-prompts/meal-parsing";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export const calculateMealTotals = (ingredients: Ingredient[]) => {
  const keys = Object.keys(ingredients[0].macronutrients);
  console.log(keys);
  let totals: MacroNutrients = {
    calories: 0,
    carbs: 0,
    fiber: 0,
    netCarbs: 0,
    protein: 0,
    fat: 0,
  };
  for (let key of keys) {
    for (let ingredient of ingredients) {
      totals[key] += ingredient.macronutrients[key];
    }
  }
  console.log("totals", totals);
  return totals;
};

export default function MealSummary(meal: { meal: Meal }) {
  const MacroBreakdown = ({ macros }: MacroNutrients) => {
    return (
      <View style={styles.macrosList}>
        <Text>{macros.calories} Cal</Text>
        <Text>{macros.carbs}g Carbs</Text>
        <Text>{macros.fiber}g Fiber</Text>
        <Text>{macros.netCarbs}g Net Carbs</Text>
        <Text>{macros.protein}g Protein</Text>
        <Text>{macros.fat}g Fat</Text>
      </View>
    );
  };

  return meal ? (
    <ScrollView style={styles.container}>
      <Text>{`${meal.meal.summary} ${meal.meal.motivation}`}</Text>
      <View style={styles.ingredientList}>
        <MacroBreakdown macros={calculateMealTotals(meal.meal.ingredients)} />
        {meal.meal.ingredients.map((ingredient) => (
          <View key={ingredient.ingredientName} style={styles.ingredient}>
            <Text>
              {`${ingredient.ingredientName} - ${ingredient.amount} ${ingredient.unitName}`}
            </Text>
            <MacroBreakdown macros={ingredient.macronutrients} />
          </View>
        ))}
      </View>
    </ScrollView>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 12,
  },
  ingredientList: {
    gap: 12,
    marginTop: 8,
  },
  ingredient: {},
  macrosList: {
    marginTop: 4,
  },
  column: {
    flexDirection: "column",
  },
});
