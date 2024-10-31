import axios from "axios";

const AUTHORIZATION = `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`;

export const transcribeAudio = async (audioUri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: audioUri,
    name: "recording.m4a",
    type: "audio/m4a",
  } as any);
  formData.append("model", "whisper-1");

  console.log(JSON.stringify(formData));
  console.log(AUTHORIZATION);
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
    console.log(response);
    return response.data.text;
  } catch (err) {
    console.error("Transcription failed: ", err);
    return null;
  }
};
