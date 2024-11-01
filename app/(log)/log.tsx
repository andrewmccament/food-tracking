import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import { parseMeal, transcribeAudio } from "@/services/open-ai";
import MealSummary from "@/components/MealSummary";
import { Meal } from "@/gpt-prompts/meal-parsing";
import { RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { logMeal } from "@/state/foodSlice";
import { Chat } from "@/components/Chat";
import { router } from "expo-router";

export default function LoggingScreen() {
  const [mealId, setMealId] = React.useState<Meal>();
  const dispatch = useDispatch();

  const addMeal = () => {
    if (mealId) {
      dispatch(logMeal(mealId));
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {mealId ? (
          <MealSummary mealId={mealId} allowAdding onAdd={() => addMeal()} />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.bottomSection}>
        <Chat
          onMealRetrieval={(mealId) => {
            setMealId(mealId);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  topSection: {
    padding: 8,
    height: "45%",
  },
  bottomSection: {
    height: "45%",
    padding: 8,
    justifyContent: "flex-start",
  },
});
