import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import { parseMeal, transcribeAudio } from "@/services/open-ai";
import MealSummary from "@/components/mealSummary";
import { Meal } from "@/gpt-prompts/meal-parsing";

export default function LoggingScreen() {
  const [listening, setListening] = React.useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = React.useState({} as Audio.Recording);
  const [transcription, setTranscription] = React.useState();
  const [meal, setMeal] = React.useState<Meal>();

  const startLogging = async () => {
    setListening(true);
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("waiting for permission");
        await requestPermission();
      }
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error(err);
    }
  };

  const stopLogging = async () => {
    setListening(false);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await recording.stopAndUnloadAsync();
    //const { sound, status } = await recording.createNewLoadedSoundAsync();

    const uri = recording.getURI();
    if (uri) {
      const transcription = await transcribeAudio(uri);
      if (transcription) {
        setTranscription(transcription);
        const response = await parseMeal(transcription);
        console.log("foobar raw", response);
        const jsonResponse = JSON.parse(response) as Meal;
        if (!jsonResponse.followUpQuestion) {
          console.log("foobar processed ", jsonResponse);
          setMeal(jsonResponse);
          console.log("i was supposed to set the meal", meal?.summary);
        } else {
          console.log(response.followUpQuestion);
        }
      }
      //sound.replayAsync();
    } else {
      console.error("NULL URI");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        {meal ? <MealSummary meal={meal} /> : <></>}
      </View>
      <View style={styles.bottomSection}>
        {transcription ? <Text>"{transcription}"</Text> : <></>}
        {listening ? (
          <Button
            title="Stop Logging"
            onPress={() => {
              stopLogging();
            }}
          />
        ) : (
          <Button
            title="Log"
            onPress={() => {
              startLogging();
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  topSection: {
    flex: 1,
    padding: 8,
  },
  bottomSection: {
    height: "20%",
    padding: 8,
    justifyContent: "flex-start",
  },
});
