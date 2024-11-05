import React from "react";
import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { getSummedMacros, sortMealsByCategory } from "@/helpers/food-utils";
import MealSummary from "@/components/Shared/MealSummary";
import { ProgressBar } from "@/components/Shared/ProgressBar";
import { DisplayedMacroTypes, Meal } from "@/types/openAi.types";
import { ThemedButton } from "@/components/ThemedButton";
import AddSVG from "../../svg/log.svg";
import { Colors } from "@/constants/Colors";

export default function TodayScreen() {
  const date = new Date();
  const todayDate = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`;
  let todaysMeals = useSelector(
    (state: RootState) => state.food.todaysMeals
  ).filter((meal) => meal?.isAdded && meal?.date === todayDate);
  todaysMeals = sortMealsByCategory(todaysMeals);
  const todayMacros = getSummedMacros(todaysMeals);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={90}
      style={styles.todayContainer}
    >
      <View>
        <View style={styles.macros}>
          <ProgressBar
            macro={DisplayedMacroTypes.calories}
            amount={todayMacros.calories}
            textStyle={{ color: "white" }}
          />
          <ProgressBar
            macro={DisplayedMacroTypes.net_carbohydrates}
            amount={todayMacros.net_carbohydrates}
            textStyle={{ color: "white" }}
          />
          <ProgressBar
            macro={DisplayedMacroTypes.fat}
            amount={todayMacros.fat}
            textStyle={{ color: "white" }}
          />
          <ProgressBar
            macro={DisplayedMacroTypes.protein}
            amount={todayMacros.protein}
            textStyle={{ color: "white" }}
          />
        </View>
      </View>
      <ScrollView>
        <View style={styles.mealsListContainer}>
          {todaysMeals.map((meal: Meal, index) => (
            <MealSummary mealId={meal.mealId} key={index} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.logButton}>
        <TouchableOpacity onPress={() => router.push("/(log)/log")}>
          <AddSVG width={80} height={80} color={Colors.themeColor} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  todayContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "black",
    gap: 12,
    height: "100%",
  },
  mealsListContainer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 12,
  },
  logButtonContainer: {},
  todayList: {
    marginHorizontal: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
  },
  macros: {
    color: "white",
    padding: 12,
  },
  logButton: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
});
