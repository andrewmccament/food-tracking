import {
  Ingredient,
  Meal,
  MacroNutrients,
  MacroNutrientEnum,
} from "@/gpt-prompts/meal-parsing";
import { getSummedMacros } from "@/helpers/food-utils";
import { getPrettyUnitsForMacro } from "@/helpers/macronutrients";
import { capFirstLetter } from "@/helpers/ui";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { ProgressBar } from "./ProgressBar";
import { ThemedText } from "./ThemedText";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";

export type MealSummaryProps = {
  mealId: string;
  allowAdding?: boolean;
  onAdd?: () => void;
};

export default function MealSummary({
  mealId,
  allowAdding,
  onAdd,
}: MealSummaryProps) {
  const [expanded, setExpanded] = React.useState(false);
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal: Meal) => meal.mealId === mealId
  );

  const MacroBreakdown = ({ macros }: MacroNutrients) => {
    return (
      <View>
        {Object.keys(macros).map((macro) => (
          <View>
            <ProgressBar macro={macro} amount={macros[macro]} />
          </View>
        ))}
      </View>
    );
  };

  return meal ? (
    <View style={styles.infoPanel}>
      <View style={styles.header}>
        <ThemedText type="subtitle" onPress={() => setExpanded(!expanded)}>
          {capFirstLetter(meal.meal)}
          <ThemedText type="defaultSemiBold">{` (${
            getSummedMacros([meal]).calories
          }${getPrettyUnitsForMacro(
            MacroNutrientEnum.calories
          )}) `}</ThemedText>
        </ThemedText>
        <View style={styles.row}>
          <Button
            title="Edit"
            onPress={() => {
              router.push({
                pathname: "../(editMeal)/editMeal",
                params: { mealId: meal.mealId },
              });
            }}
          />
          {allowAdding && <Button title="Add" onPress={() => onAdd()} />}
        </View>
      </View>
      <ThemedText>{meal.summary}</ThemedText>
      {expanded && (
        <ScrollView style={styles.ingredientList}>
          {meal.ingredients.map((ingredient) => (
            <View style={styles.ingredient}>
              <View style={styles.row}>
                <ThemedText type="defaultSemiBold">
                  {capFirstLetter(ingredient.ingredientName)}
                </ThemedText>
                <ThemedText type="default">
                  {` ${ingredient.amount} ${ingredient.unitName}`}
                </ThemedText>
              </View>
              <MacroBreakdown macros={ingredient.macronutrients} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  ingredientList: {
    gap: 12,
    marginTop: 8,
  },
  ingredient: {
    paddingTop: 12,
    paddingLeft: 2,
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  infoPanel: {
    backgroundColor: "#ffffff",

    marginTop: 24,
    borderRadius: 8,
    padding: 12,
  },
});
