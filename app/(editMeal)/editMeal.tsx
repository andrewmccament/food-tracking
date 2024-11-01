import { EditableIngredient } from "@/components/EditableIngredient";
import { ThemedText } from "@/components/ThemedText";
import { capFirstLetter } from "@/helpers/ui";
import { addIngredient, removeIngredient } from "@/state/foodSlice";
import { RootState } from "@/state/store";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function EditMealScreen() {
  const { mealId } = useLocalSearchParams();
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal) => meal.mealId === mealId
  );
  const dispatch = useDispatch();

  const addNewIngredient = () => {
    dispatch(addIngredient(mealId));
    router.push({
      pathname: "../(editIngredient)/editIngredient",
      params: {
        mealId: mealId,
        ingredient: meal?.ingredients.length ?? 1,
      },
    });
  };

  const deleteIngredient = (index: number) => {
    dispatch(removeIngredient({ mealId: mealId, ingredientIndex: index }));
  };

  return (
    <View>
      <ScrollView style={styles.ingredientsList}>
        <Text style={styles.summary}>{meal?.summary}</Text>
        <Button title="Add ingredient..." onPress={() => addNewIngredient()} />
        {meal?.ingredients.map((ingredient, index) => (
          <View style={styles.row}>
            <View
              style={styles.ingredient}
              onTouchEnd={() =>
                router.push({
                  pathname: "../(editIngredient)/editIngredient",
                  params: { mealId: mealId, ingredient: index },
                })
              }
            >
              <ThemedText>
                {capFirstLetter(ingredient.ingredientName)}
              </ThemedText>
            </View>
            <View
              style={styles.delete}
              onTouchEnd={() => deleteIngredient(index)}
            >
              <Text>Delete</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    padding: 8,
  },
  ingredientsList: {
    flexDirection: "column",
  },
  row: {
    minHeight: 80,
    margin: 4,
    flexDirection: "row",
    gap: 4,
  },
  ingredient: {
    flexGrow: 1,
    backgroundColor: "#B5B5B5",
    padding: 8,
    borderRadius: 4,
    shadowRadius: 4,
  },
  delete: {
    borderRadius: 4,
    minHeight: 80,
    width: 80,
    zIndex: 100,
    backgroundColor: "red",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
