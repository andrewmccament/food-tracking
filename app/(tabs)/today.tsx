import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { getSummedMacros, sortMealsByCategory } from "@/helpers/food-utils";
import MealSummary from "@/components/Shared/MealSummary";
import { ProgressBar } from "@/components/Shared/ProgressBar";
import { Meal } from "@/types/openAi.types";
import { defaultFocusedMetrics } from "@/state/userDataSlice";
import AddSVG from "../../svg/log.svg";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "react-native-gradients";

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
  const focusedMetrics = useSelector(
    (state: RootState) => state.userData.focusedMetrics ?? defaultFocusedMetrics
  );

  return (
    <View style={styles.todayContainer}>
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
          {focusedMetrics.map((macro) => (
            <ProgressBar
              key={macro}
              textColor="white"
              macro={macro}
              amount={todayMacros[macro]}
            />
          ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  todayContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "black",
    gap: 12,
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
