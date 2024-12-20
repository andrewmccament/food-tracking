import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import MealSummary from "@/components/Shared/MealSummary";
import { useDispatch, useSelector } from "react-redux";
import { logMeal } from "@/state/foodSlice";
import { Chat } from "@/components/Log/Chat";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { RootState } from "@/state/store";

export default function LoggingScreen() {
  const { logMode } = useLocalSearchParams();
  const navigation = useNavigation();
  navigation.setOptions({
    title: logMode === "recipe" ? "Save Recipe" : "Log Food",
  });
  const mealId = React.useRef<string>();
  const [mealIdChanged, setMealIdChanged] = React.useState<string>();
  const userAddedMeal = React.useRef(false);
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.food.meals);
  React.useEffect(() => {
    return () => {
      setTimeout(() => {
        if (
          mealId.current &&
          !meals.find((meal) => meal.mealId === mealId.current)?.isAdded
        ) {
          Alert.alert("Did you want to save the meal or discard?", "", [
            {
              text: "Discard",
              onPress: () => {},
              style: "cancel",
            },
            { text: "Save", onPress: () => dispatch(logMeal(mealId.current)) },
          ]);
        }
      }, 1000);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Chat
        onMealRetrieval={(thisMealId) => {
          mealId.current = thisMealId;
          setMealIdChanged(thisMealId);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
