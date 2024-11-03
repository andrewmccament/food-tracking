import axios from "axios";
import { Meal, MEAL_PARSING_PROMPT } from "../gpt-prompts/meal-parsing";
const AUTHORIZATION = `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`;
import * as Crypto from "expo-crypto";
import { Message, MessageFrom } from "@/components/Chat";

export const transcribeAudio = async (audioUri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: audioUri,
    name: "recording.m4a",
    type: "audio/m4a",
  } as any);
  formData.append("model", "whisper-1");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: AUTHORIZATION,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.text;
  } catch (err) {
    console.error("Transcription failed: ", err);
    return null;
  }
};

export type ParseMealResponse = Promise<Meal | { error: string }>;

export const parseMeal = async (
  input: string,
  pastMessages: Message[]
): ParseMealResponse => {
  const messages = [
    {
      role: "system",
      content: MEAL_PARSING_PROMPT,
    },
    ...pastMessages.map((message) => {
      return {
        role: message.from === MessageFrom.GPT ? "system" : "user",
        content: message.contents,
      };
    }),
    {
      role: "user",
      content: input,
    },
  ];

  console.log(messages);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
      },
      {
        headers: {
          Authorization: AUTHORIZATION,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("hello");
    const date = new Date();
    try {
      console.log("unpased", response.data.choices[0].message.content);
      const meal = JSON.parse(response.data.choices[0].message.content) as Meal;
      if (meal.error) {
        throw new Error("Tried to record an invalid meal");
      }
      console.log(meal);
      return {
        ...meal,
        mealId: Crypto.randomUUID(),
        date: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
      };
    } catch (err) {
      console.log(err);

      return { error: `${err}` };
    }
  } catch (err) {
    console.log(err);
    return { error: `${err}` };
  }
};
