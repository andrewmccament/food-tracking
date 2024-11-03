import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import MealSummary from "@/components/MealSummary";
import { useDispatch } from "react-redux";
import { logMeal } from "@/state/foodSlice";
import { Chat } from "@/components/Chat";
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
      console.log("unmount", userAddedMeal, mealId.current);
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
        <Chat
          onMealRetrieval={(thisMealId) => {
            mealId.current = thisMealId;
            setMealIdChanged(thisMealId);
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
