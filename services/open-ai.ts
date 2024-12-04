import axios from "axios";
import { MEAL_PARSING_PROMPT } from "../gpt-prompts/meal-parsing";
const AUTHORIZATION = `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`;
import * as Crypto from "expo-crypto";
import { Message, MessageFrom } from "@/components/Log/Message";
import { Meal } from "@/types/openAi.types";
import { RECIPE_PARSING_PROMPT } from "@/gpt-prompts/recipe-parsing";
import { RECIPE_UTILIZATION_PROMPT } from "@/gpt-prompts/recipe-utilization";

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
export type UtilizeRecipeResponse = Promise<{
  followUpQuestion?: string;
  transformedInput?: string;
}>;

export const utilizeRecipes = async (
  input: string,
  pastMessages: Message[],
  recipes: Meal[]
): UtilizeRecipeResponse => {
  console.log(JSON.stringify(recipes));
  const messages = [
    {
      role: "system",
      content: RECIPE_UTILIZATION_PROMPT,
    },
    ...pastMessages.map((message) => {
      return {
        role: message.from === MessageFrom.GPT ? "system" : "user",
        content: message.contents,
      };
    }),
    ...recipes.map((recipe) => {
      return {
        role: "user",
        content: `Here's a recipe I've created in case you can use it to parse this meal: ${JSON.stringify(
          recipe
        )}`,
      };
    }),
    {
      role: "user",
      content: input,
    },
  ];

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
    try {
      console.log(response);
      const res = JSON.parse(response.data.choices[0].message.content) as {
        followUpQuestion?: string;
        transformedInput?: string;
      };
      return res;
    } catch (err) {
      return { error: `${err}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
};

export const parseMeal = async (
  input: string,
  pastMessages: Message[],
  recipes: Meal[]
): ParseMealResponse => {
  console.log(JSON.stringify(recipes));
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
    ...recipes.map((recipe) => {
      return {
        role: "user",
        content: `Here's a recipe I've created in case you can use it to parse this meal: ${JSON.stringify(
          recipe
        )}`,
      };
    }),
    {
      role: "user",
      content: input,
    },
  ];

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
    const date = new Date();
    try {
      const meal = JSON.parse(response.data.choices[0].message.content) as Meal;
      if (meal.error) {
        throw new Error("Tried to record an invalid meal");
      }
      return {
        ...meal,
        mealId: Crypto.randomUUID(),
        date: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
      };
    } catch (err) {
      return { error: `${err}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
};

export const parseMealRecipe = async (
  input: string,
  pastMessages: Message[]
): ParseMealResponse => {
  const messages = [
    {
      role: "system",
      content: RECIPE_PARSING_PROMPT,
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
    const date = new Date();
    try {
      const meal = JSON.parse(response.data.choices[0].message.content) as Meal;
      if (meal.error) {
        throw new Error("Tried to record an invalid meal");
      }
      return {
        ...meal,
        mealId: Crypto.randomUUID(),
        date: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
      };
    } catch (err) {
      return { error: `${err}` };
    }
  } catch (err) {
    return { error: `${err}` };
  }
};
