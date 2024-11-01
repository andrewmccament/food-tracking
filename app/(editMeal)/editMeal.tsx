import { RootState } from "@/state/store";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function EditMealScreen() {
  const { mealId } = useLocalSearchParams();
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal) => meal.mealId === mealId
  );

  return (
    <View>
      <Text>{meal?.summary}</Text>
    </View>
  );
}
