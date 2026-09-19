import MealSummary from "@/components/Shared/MealSummary";
import { useAppTheme } from "@/hooks/useAppTheme";
import { RootState } from "@/state/store";
import { Meal } from "@/types/openAi.types";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "react-native-gradients";
import { useSelector } from "react-redux";
import AddSVG from "../../svg/log.svg";

export default function RecipesScreen() {
  const theme = useAppTheme();
  const recipes = useSelector((state: RootState) => state.food.meals)
    .filter((meal: Meal) => meal?.isAdded && meal?.recipe)
    .sort((a: Meal, b: Meal) =>
      (a.recipe?.title ?? "").localeCompare(b.recipe?.title ?? "")
    );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.gradient} pointerEvents="none">
        <LinearGradient
          angle={270}
          colorList={[
            { offset: "0%", color: theme.background, opacity: "0" },
            { offset: "80%", color: theme.background, opacity: "0" },
            { offset: "95%", color: theme.background, opacity: "1" },
          ]}
        />
      </View>
      <ScrollView>
        <View style={styles.recipesList}>
          {recipes.map((meal) => (
            <MealSummary mealId={meal.mealId} key={meal.mealId} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.addButton}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(log)/log", params: { logMode: "recipe" } })}
          accessibilityLabel="Create recipe"
        >
          <AddSVG width={80} height={80} color={theme.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { position: "absolute", height: "100%", width: "100%", zIndex: 1 },
  addButton: { position: "absolute", bottom: 30, width: "100%", alignItems: "center", zIndex: 2 },
  recipesList: { flexDirection: "column", gap: 12, paddingHorizontal: 12, paddingBottom: "100%" },
});
