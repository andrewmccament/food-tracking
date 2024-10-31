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

export type ChatProps = {
  onMealRetrieval: (meal: Meal) => void;
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

    const uri = recording.getURI();
    if (uri) {
      const transcription = await transcribeAudio(uri);
      if (transcription) {
        setTranscription(transcription);
        setMessages((previous) =>
          previous.concat({ from: MessageFrom.USER, contents: transcription })
        );
        const response = await parseMeal(transcription);
        const jsonResponse = JSON.parse(response) as Meal;
        if (!jsonResponse.followUpQuestion) {
          setMeal(jsonResponse);
          onMealRetrieval(jsonResponse);
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
      console.log(messages);
      //sound.replayAsync();
    } else {
      console.error("NULL URI");
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
