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
import { recordMeal } from "@/state/foodSlice";
import { useSelector, useDispatch } from "react-redux";
import { Message } from "./Message";
import { Meal } from "@/types/openAi.types";

export type ChatProps = {
  onMealRetrieval: (mealId: string) => void;
};

export enum MessageFrom {
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
      setMessages((previous) =>
        previous.concat({ from: MessageFrom.USER, contents: "..." })
      );
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
      console.info(`Failed to unload recording: ${err}`);
      return;
    }

    if (transcribe) {
      const uri = recording.current.getURI();
      if (uri) {
        const transcription = await transcribeAudio(uri);

        if (transcription) {
          setTranscription(transcription);
          setMessages((previous) => {
            return previous
              .slice(0, -1)
              .concat({ from: MessageFrom.USER, contents: transcription })
              .concat({ from: MessageFrom.GPT, contents: "..." });
          });
          const response = await parseMeal(transcription);
          console.log(response);
          if (!response?.error) {
            if (response.mealId) {
              dispatch(recordMeal(response));

              setMeal(response);
              onMealRetrieval(response.mealId);
              setMessages((previous) =>
                previous.slice(0, -1).concat({
                  from: MessageFrom.GPT,
                  contents: response.motivation,
                })
              );
            } else {
              setMessages((previous) =>
                previous.slice(0, -1).concat({
                  from: MessageFrom.GPT,
                  contents: response.followUpQuestion as string,
                })
              );
            }
          } else {
            setMessages((previous) =>
              previous.slice(0, -1).concat({
                from: MessageFrom.GPT,
                contents: `I'm sorry, I didn't quite get that.  Can you try again please?`,
              })
            );
          }
        }
      } else {
        console.error("NULL URI");
      }
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.messages}>
        {messages.map((message, index) => (
          <Message from={message.from} content={message.contents} key={index} />
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
  messages: {
    flexDirection: "column-reverse",
  },
});
