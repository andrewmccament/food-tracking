import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import MealSummary from "@/components/Shared/MealSummary";
import { useDispatch } from "react-redux";
import { logMeal } from "@/state/foodSlice";
import { Chat } from "@/components/Log/Chat";
import { router } from "expo-router";

export default function LoggingScreen() {
  const mealId = React.useRef<string>();
  const [mealIdChanged, setMealIdChanged] = React.useState<string>();
  const userAddedMeal = React.useRef(false);
  const dispatch = useDispatch();

  const addMeal = () => {
    if (mealId.current) {
      userAddedMeal.current = true;
      dispatch(logMeal(mealId.current));
      router.back();
    }
  };

  React.useEffect(() => {
    return () => {
      if (mealId.current && userAddedMeal.current == false) {
        Alert.alert("Did you want to save the meal or discard?", "", [
          {
            text: "Discard",
            onPress: () => {},
            style: "cancel",
          },
          { text: "Save", onPress: () => dispatch(logMeal(mealId.current)) },
        ]);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Chat
          onMealRetrieval={(thisMealId) => {
            mealId.current = thisMealId;
            setMealIdChanged(thisMealId);
          }}
        />
        {mealId.current ? (
          <MealSummary
            mealId={mealId.current}
            allowAdding
            onAdd={() => addMeal()}
            expandedByDefault
          />
        ) : (
          <></>
        )}
      </View>
      <View style={styles.bottomSection}>
        {mealId.current ? (
          <MealSummary
            mealId={mealId.current}
            allowAdding
            onAdd={() => addMeal()}
            expandedByDefault
          />
        ) : (
          <></>
        )}
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
    backgroundColor: "#D5E1E1",
  },
  topSection: {
    padding: 0,
    height: "40%",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
