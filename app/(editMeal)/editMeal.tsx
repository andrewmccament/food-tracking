import { EditableIngredient } from "@/components/EditableIngredient";
import { RootState } from "@/state/store";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function EditMealScreen() {
  const { mealId } = useLocalSearchParams();
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal) => meal.mealId === mealId
  );

  return (
    <View>
      <ScrollView style={styles.ingredientsList}>
        <Text>{meal?.summary}</Text>
        {meal?.ingredients.map((ingredient) => (
          <EditableIngredient
            ingredient={ingredient}
            onUpdateIngredient={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientsList: {
    flexDirection: "column",
  },
});
