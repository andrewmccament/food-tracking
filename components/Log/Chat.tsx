import React from "react";
import {
  Text,
  Button,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import {
  parseMeal,
  parseMealRecipe,
  transcribeAudio,
  utilizeRecipes,
} from "@/services/open-ai";
import { recordMeal } from "@/state/foodSlice";
import { useSelector, useDispatch } from "react-redux";
import { Message, MessageFrom } from "./Message";
import { Meal } from "@/types/openAi.types";
import { ButtonStyle, ThemedButton } from "../ThemedButton";
import SpeakSVG from "../../svg/speak.svg";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { RootState } from "@/state/store";

export type ChatProps = {
  onMealRetrieval: (mealId: string) => void;
};

export const Chat = ({ onMealRetrieval }: ChatProps) => {
  const { logMode } = useLocalSearchParams();
  let recipes = useSelector((state: RootState) => state.food.meals).filter(
    (meal: Meal) => meal?.isAdded && meal?.recipe
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const messagesRef = React.useRef<Message[]>();
  const [listening, setListening] = React.useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recording = React.useRef({} as Audio.Recording);
  const [transcription, setTranscription] = React.useState<string>();
  const [meal, setMeal] = React.useState<Meal>();
  const dispatch = useDispatch();

  const scrollViewRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    // Scroll to the bottom when new messages are added
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // start logging automatically when the chat component first mounts (after waiting a second)
  React.useEffect(() => {
    //setTimeout(() => startLogging(), 1000);

    return () => {
      if (recording.current) {
        stopLogging(false);
      }
    };
  }, []);

  React.useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
        inputRef.current?.clear();
        setMessages((previous) => {
          return previous
            .concat({ from: MessageFrom.USER, contents: transcription })
            .concat({ from: MessageFrom.GPT, contents: "..." });
        });
      }
      const attemptUseRecipe = await utilizeRecipes(
        transcription,
        messagesRef.current,
        recipes
      );
      console.log(attemptUseRecipe);
      if (attemptUseRecipe.followUpQuestion) {
        setMessages((previous) =>
          previous.slice(0, -1).concat({
            from: MessageFrom.GPT,
            contents: response.followUpQuestion as string,
          })
        );
      } else if (attemptUseRecipe.transformedInput) {
        const response =
          logMode === "recipe"
            ? await parseMealRecipe(
                attemptUseRecipe.transformedInput,
                messagesRef.current,
                recipes
              )
            : await parseMeal(
                attemptUseRecipe.transformedInput,
                messagesRef.current,
                recipes
              );

        if (!response?.error) {
          if (response.meal) {
            dispatch(recordMeal(response));

            setMeal(response);
            onMealRetrieval(response.mealId);
            setMessages((previous) =>
              previous.slice(0, -1).concat({
                from: MessageFrom.GPT,
                contents: response.motivation,
                meal: response,
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
    }
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={90}
      style={styles.container}
    >
      <ScrollView ref={scrollViewRef}>
        <View>
          {messages.map((message, index) => (
            <Message
              from={message.from}
              content={message.contents}
              meal={message.meal}
              key={index}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.chatRow}>
        <View style={styles.speakButton}>
          <TouchableOpacity
            onPress={() => {
              listening ? stopLogging() : startLogging();
            }}
          >
            <SpeakSVG
              width={35}
              height={35}
              color={listening ? "red" : Colors.themeColor}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Type to AI..."
          returnKeyType="send"
          blurOnSubmit
          ref={inputRef}
          multiline
          numberOfLines={5}
          onSubmitEditing={(event) => {
            attemptParseMeal(event.nativeEvent.text, false);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    padding: 8,
    paddingBottom: 24,
  },
  messages: {
    flexDirection: "column-reverse",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: Colors.themeColor,
    borderWidth: 1,
    minHeight: 44,
    maxHeight: 100,
    fontSize: 18,
    justifyContent: "center",
    color: "white",
  },
  speakButton: {},
});
