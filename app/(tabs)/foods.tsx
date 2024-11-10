import MealSummary from "@/components/Shared/MealSummary";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Meal } from "@/types/openAi.types";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "react-native-gradients";
import { useSelector } from "react-redux";
import AddSVG from "../../svg/log.svg";

export default function MyFoodsScreen() {
  let meals = useSelector((state: RootState) => state.food.meals)
    .filter((meal: Meal) => meal?.isAdded && meal?.recipe)
    .sort((a: Meal, b: Meal) =>
      a?.recipe?.title?.localeCompare(b?.recipe?.title)
    );
  return (
    <View style={styles.container}>
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
            router.push({
              pathname: "/(log)/log",
              params: { logMode: "recipe" },
            })
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
  container: {
    backgroundColor: "black",
    height: "100%",
  },
  logButton: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  mealsListContainer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: "100%",
  },
});
