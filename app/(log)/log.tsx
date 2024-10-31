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

export default function LoggingScreen() {
  const [listening, setListening] = React.useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = React.useState({} as Audio.Recording);
  const [transcription, setTranscription] = React.useState();
  const [meal, setMeal] = React.useState<Meal>();
  const todaysMeals = useSelector((state: RootState) => state.food.todaysMeals);
  const dispatch = useDispatch();

  const addMeal = () => {
    if (meal) {
      dispatch(logMeal(meal));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {meal ? <MealSummary meal={meal} /> : <></>}
      </View>
      <View style={styles.bottomSection}>
        <Chat
          onMealRetrieval={(meal) => {
            setMeal(meal);
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
    height: "50%",
  },
  bottomSection: {
    height: "50%",
    padding: 8,
    justifyContent: "flex-start",
  },
});
