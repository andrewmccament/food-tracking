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
import { LinearGradient, RadialGradient } from "react-native-gradients";

export default function TodayScreen() {
  const date = new Date();
  const todayDate = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`;
  let meals = useSelector((state: RootState) => state.food.meals).filter(
    (meal) => meal?.isAdded && meal?.date === todayDate && !meal?.recipe
  );
  meals = sortMealsByCategory(meals);
  const todayMacros = getSummedMacros(meals);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={90}
      style={styles.todayContainer}
    >
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: 1,
        }}
        pointerEvents="none"
      >
        <LinearGradient
          angle={270}
          colorList={[
            { offset: "0%", color: "#000000", opacity: "0" },
            { offset: "80%", color: "#000000", opacity: "0" },
            { offset: "95%", color: "#000000", opacity: "1" },
          ]}
        />
      </View>
      <View>
        <View style={styles.macros}>
          <ProgressBar
            textColor="white"
            macro={DisplayedMacroTypes.calories}
            amount={todayMacros.calories}
          />
          <ProgressBar
            textColor="white"
            macro={DisplayedMacroTypes.net_carbohydrates}
            amount={todayMacros.net_carbohydrates}
          />
          <ProgressBar
            textColor="white"
            macro={DisplayedMacroTypes.fat}
            amount={todayMacros.fat}
          />
          <ProgressBar
            textColor="white"
            macro={DisplayedMacroTypes.protein}
            amount={todayMacros.protein}
          />
        </View>
      </View>
      <ScrollView>
        <View style={{ ...styles.mealsListContainer }}>
          {meals.map((meal: Meal, index) => (
            <View key={index}>
              <MealSummary mealId={meal.mealId} key={index} />
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.logButton}>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/(log)/log", params: { logMode: "meal" } })
          }
          style={{ zIndex: 1000 }}
        >
          <AddSVG
            width={80}
            height={80}
            color={Colors.themeColor}
            style={{ zIndex: 1000 }}
          />
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
    height: "200%",
    paddingBottom: 12,
  },
  mealsListContainer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: "100%",
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
    paddingHorizontal: 12,
  },
  logButton: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },

  logButtonGrad: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 1000,
  },
});
