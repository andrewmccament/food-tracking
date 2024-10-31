import { Meal } from "@/gpt-prompts/meal-parsing";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MealSummary(meal: { meal: Meal }) {
  console.log("mealSummary!", meal);
  return meal ? (
    <View style={styles.container}>
      <Text>{meal.meal.summary}</Text>
      <View style={styles.ingredientList}>
        {meal.meal.ingredients.map((ingredient) => (
          <View key={ingredient.ingredientName} style={styles.ingredient}>
            <Text>
              {ingredient.ingredientName} - {ingredient.amount}{" "}
              {ingredient.unitName}
            </Text>
            <Text>
              {ingredient.calories} - {ingredient.macronutrients.carbs}g Carbs -{" "}
              {ingredient.macronutrients.fiber}g Fiber -{" "}
              {ingredient.macronutrients.netCarbs}g Net Carbs -{" "}
              {ingredient.macronutrients.protein}g Protein -{" "}
              {ingredient.macronutrients.fat}g Fat
            </Text>
          </View>
        ))}
      </View>
    </View>
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
    gap: 4,
  },
  ingredient: {},
});
