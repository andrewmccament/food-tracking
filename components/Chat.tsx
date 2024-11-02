import React from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { Audio } from "expo-av";
import { parseMeal, transcribeAudio } from "@/services/open-ai";
import { Meal } from "@/gpt-prompts/meal-parsing";
import { recordMeal } from "@/state/foodSlice";
import { useSelector, useDispatch } from "react-redux";

export type ChatProps = {
  onMealRetrieval: (mealId: string) => void;
};

enum MessageFrom {
  USER = "Andrew",
  GPT = "Nourishly",
}

type Message = {
  from: MessageFrom;
  contents: string;
};

export const Chat = ({ onMealRetrieval }: ChatProps) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [listening, setListening] = React.useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recording = React.useRef({} as Audio.Recording);
  const [transcription, setTranscription] = React.useState();
  const [meal, setMeal] = React.useState<Meal>();
  const dispatch = useDispatch();

  // start logging automatically when the chat component first mounts (after waiting a second)
  React.useEffect(() => {
    setTimeout(() => startLogging(), 1000);

    return () => {
      if (recording.current) {
        stopLogging(false);
      }
    };
  }, []);

  const startLogging = async () => {
    setListening(true);
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: currentRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = currentRecording;
    } catch (err) {
      console.error(err);
    }
  };

  const stopLogging = async (transcribe = true) => {
    setListening(false);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    try {
      await recording.current?.stopAndUnloadAsync();
    } catch (err) {
      console.warn(`Failed to unload recording: ${err}`);
      return;
    }

    if (transcribe) {
      const uri = recording.current.getURI();
      if (uri) {
        const transcription = await transcribeAudio(uri);
        if (transcription) {
          setTranscription(transcription);
          setMessages((previous) =>
            previous.concat({ from: MessageFrom.USER, contents: transcription })
          );
          const response = await parseMeal(transcription);
          const jsonResponse = response;
          if (jsonResponse) {
            if (jsonResponse.mealId) {
              dispatch(recordMeal(jsonResponse));

              setMeal(jsonResponse);
              onMealRetrieval(jsonResponse.mealId);
              setMessages((previous) =>
                previous.concat({
                  from: MessageFrom.GPT,
                  contents: jsonResponse.motivation,
                })
              );
            } else {
              setMessages((previous) =>
                previous.concat({
                  from: MessageFrom.GPT,
                  contents: jsonResponse.followUpQuestion as string,
                })
              );
            }
          }
        }
      } else {
        console.error("NULL URI");
      }
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        {messages.map((message) => (
          <Text
            style={styles.text}
          >{`${message.from}: ${message.contents}`}</Text>
        ))}
      </ScrollView>
      <TextInput />
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    borderRadius: 8,
    padding: 8,
  },
  text: {
    color: "white",
  },
});
