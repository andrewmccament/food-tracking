import axios from "axios";
import { MEAL_PARSING_PROMPT } from "../gpt-prompts/meal-parsing";
const AUTHORIZATION = `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`;

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

export const parseMeal = async (input: string) => {
  const formData = new FormData();
  formData.append("model", "gpt-3.5-turbo");
  const messages = [
    {
      role: "system",
      content: MEAL_PARSING_PROMPT,
    },
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
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Transcription failed: ", err);
    return null;
  }
};
