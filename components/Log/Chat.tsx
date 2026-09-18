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
  Alert,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
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
import { useLocalSearchParams } from "expo-router";
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
  const messagesRef = React.useRef<Message[]>([]);
  const [listening, setListening] = React.useState(false);
  const recording = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const audioBusy = React.useRef(false);
  const [audioPending, setAudioPending] = React.useState(false);
  const [transcription, setTranscription] = React.useState<string>();
  const [meal, setMeal] = React.useState<Meal>();
  const dispatch = useDispatch();

  const scrollViewRef = React.useRef<ScrollView>(null);
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    // Scroll to the bottom when new messages are added
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // useAudioRecorder releases the native recorder when the screen unmounts.

  React.useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const startLogging = async () => {
    if (audioBusy.current) return;
    audioBusy.current = true;
    setAudioPending(true);
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Microphone access needed", "Allow microphone access in Settings, or type your meal below.");
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recording.prepareToRecordAsync();
      recording.record();
      setListening(true);
      setMessages((previous) =>
        previous.concat({ from: MessageFrom.USER, contents: "..." })
      );
    } catch (err) {
      setListening(false);
      Alert.alert("Couldn't start recording", "Please try again or type your meal.");
    } finally {
      audioBusy.current = false;
      setAudioPending(false);
    }
  };

  const stopLogging = async (transcribe = true) => {
    if (audioBusy.current) return;
    audioBusy.current = true;
    setAudioPending(true);
    try {
      await recording.stop();
      setListening(false);
      await setAudioModeAsync({ allowsRecording: false });

      if (transcribe) {
        const uri = recording.uri;
        if (uri) {
          const transcription = await transcribeAudio(uri);
          if (transcription) {
            await attemptParseMeal(transcription);
          } else {
            setMessages((previous) =>
              previous.slice(0, -1).concat({
                from: MessageFrom.GPT,
                contents:
                  "I couldn't transcribe that recording. Check the Metro log for the OpenAI error.",
              })
            );
          }
        } else {
          throw new Error("Recording has no URI");
        }
      }
    } catch {
      Alert.alert("Couldn't finish recording", "Please try again or type your meal.");
    } finally {
      setListening(false);
      audioBusy.current = false;
      setAudioPending(false);
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
      const attemptUseRecipe =
        recipes.length > 0
          ? await utilizeRecipes(
              transcription,
              messagesRef.current ?? [],
              recipes
            )
          : { transformedInput: transcription };

      if (attemptUseRecipe.error) {
        console.error("Recipe matching failed:", attemptUseRecipe.error);
        setMessages((previous) =>
          previous.slice(0, -1).concat({
            from: MessageFrom.GPT,
            contents: `OpenAI request failed: ${attemptUseRecipe.error}`,
          })
        );
        return;
      }

      if (attemptUseRecipe.followUpQuestion) {
        setMessages((previous) =>
          previous.slice(0, -1).concat({
            from: MessageFrom.GPT,
            contents: attemptUseRecipe.followUpQuestion as string,
          })
        );
      } else if (attemptUseRecipe.transformedInput) {
        const response =
          logMode === "recipe"
            ? await parseMealRecipe(
                attemptUseRecipe.transformedInput,
                messagesRef.current ?? []
              )
            : await parseMeal(
                attemptUseRecipe.transformedInput,
                messagesRef.current ?? [],
                recipes
              );

        if (!("error" in response)) {
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
          console.error("Meal parsing failed:", response.error);
          setMessages((previous) =>
            previous.slice(0, -1).concat({
              from: MessageFrom.GPT,
              contents: `OpenAI request failed: ${response.error}`,
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
            disabled={audioPending}
            accessibilityLabel={listening ? "Stop recording" : "Record meal"}
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
    paddingBottom: 48,
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
