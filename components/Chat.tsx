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
import { ButtonStyle, ThemedButton } from "./ThemedButton";

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
  const [transcription, setTranscription] = React.useState<string>();
  const [meal, setMeal] = React.useState<Meal>();
  const dispatch = useDispatch();

  // start logging automatically when the chat component first mounts (after waiting a second)
  React.useEffect(() => {
    //setTimeout(() => startLogging(), 1000);

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
        attemptParseMeal(transcription);
      } else {
        console.error("NULL URI");
      }
    }
  };

  const attemptParseMeal = async (
    transcription: string,
    voiceOrigin = true
  ) => {
    if (transcription) {
      setTranscription(transcription);
      if (voiceOrigin) {
        setMessages((previous) => {
          return previous
            .slice(0, -1)
            .concat({ from: MessageFrom.USER, contents: transcription })
            .concat({ from: MessageFrom.GPT, contents: "..." });
        });
      } else {
        setMessages((previous) => {
          return previous
            .concat({ from: MessageFrom.USER, contents: transcription })
            .concat({ from: MessageFrom.GPT, contents: "..." });
        });
      }
      const response = await parseMeal(transcription);
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
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.messages}>
        {messages.map((message, index) => (
          <Message from={message.from} content={message.contents} key={index} />
        ))}
      </ScrollView>
      <View style={styles.chatRow}>
        <TextInput
          style={styles.input}
          placeholder="Type to AI..."
          returnKeyType="send"
          onSubmitEditing={(event) => {
            attemptParseMeal(event.nativeEvent.text);
          }}
        />
        <View style={styles.speakButton}>
          <ThemedButton
            title={listening ? "Stop" : "Speak"}
            style={ButtonStyle.DARK}
            onPress={() => {
              listening ? stopLogging() : startLogging();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    padding: 8,
    paddingBottom: 0,
  },
  text: {
    color: "white",
  },
  messages: {
    flexDirection: "column-reverse",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderColor: "#316A7D",
    borderWidth: 1,
    height: 44,
    color: "white",
  },
  speakButton: {
    width: 90,
  },
});
