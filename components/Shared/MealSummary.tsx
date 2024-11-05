import { getSummedMacros } from "@/helpers/food-utils";
import { capFirstLetter } from "@/helpers/ui";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { ProgressBar } from "./ProgressBar";
import { ThemedText } from "../ThemedText";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { removeMeal } from "@/state/foodSlice";
import {
  DisplayedMacroConfig,
  DisplayedMacroIterator,
  DisplayedMacroTypes,
  Ingredient,
  Meal,
  Serving,
} from "@/types/openAi.types";

export type MealSummaryProps = {
  mealId: string;
  allowAdding?: boolean;
  onAdd: () => void;
  expandedByDefault?: boolean;
  embedded?: boolean;
};

export type MacroBreakdownProps = { macros: Serving };
export const MacroBreakdown = ({ macros }: MacroBreakdownProps) => {
  return (
    <View>
      {DisplayedMacroIterator.map((macro, index) => (
        <View key={index}>
          <ProgressBar macro={macro} amount={macros[macro]} />
        </View>
      ))}
    </View>
  );
};

export default function MealSummary({
  mealId,
  allowAdding,
  onAdd,
  expandedByDefault = false,
  embedded = false,
}: MealSummaryProps) {
  const [expanded, setExpanded] = React.useState(expandedByDefault);
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal: Meal) => meal.mealId === mealId
  );

  const dispatch = useDispatch();

  const deleteMeal = () => {
    if (!meal?.mealId) return;
    Alert.alert("Are you sure you want to delete this meal?", "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Delete", onPress: () => dispatch(removeMeal(meal.mealId)) },
    ]);
  };

  return meal ? (
    <View style={{ ...styles.infoPanel, borderRadius: embedded ? 12 : 0 }}>
      <View style={styles.header}>
        <ThemedText type="subtitle" onPress={() => setExpanded(!expanded)}>
          {capFirstLetter(meal.meal)}
          <ThemedText type="defaultSemiBold">{` (${
            getSummedMacros([meal]).calories
          }${
            DisplayedMacroConfig.find(
              (macroConfig) => macroConfig.type === DisplayedMacroTypes.calories
            )?.unit
          })`}</ThemedText>
        </ThemedText>
        <View style={styles.row}>
          {meal.isAdded && <Button title="Delete" onPress={deleteMeal} />}
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
          {meal.ingredients.map((ingredient: Ingredient, index: number) => (
            <View style={styles.ingredient} key={index}>
              <View style={styles.row}>
                <ThemedText type="defaultSemiBold">
                  {capFirstLetter(ingredient.food_name)}
                </ThemedText>
                <ThemedText type="default">
                  {` ${ingredient.serving.serving_description}`}
                </ThemedText>
              </View>
              <MacroBreakdown macros={ingredient.serving} />
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
    borderRadius: 0,
    padding: 12,
  },
});
