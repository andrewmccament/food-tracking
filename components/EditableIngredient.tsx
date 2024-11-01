import { Ingredient } from "@/gpt-prompts/meal-parsing";
import { capFirstLetter } from "@/helpers/ui";
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "./ThemedText";
export type EditableIngredientProps = {
  ingredient: Ingredient;
  onUpdateIngredient: (updatedIngredient: Ingredient) => void;
};

export const EditableIngredient = ({
  ingredient,
  onUpdateIngredient,
}: EditableIngredientProps) => {
  return (
    <View style={styles.card}>
      <TextInput>{capFirstLetter(ingredient.ingredientName)}</TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 4,
    backgroundColor: "gray",
    borderRadius: 8,
    width: "100%",
    minHeight: 100,
  },
});
