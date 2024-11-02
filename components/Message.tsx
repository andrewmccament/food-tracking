import React from "react";
import { MessageFrom } from "./Chat";
import { View, Text, StyleSheet } from "react-native";
export type MessageProps = {
  from: MessageFrom;
  content: string;
};

export const Message = ({ from, content }: MessageProps) => {
  const loading = content === "...";

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: from === MessageFrom.GPT ? "flex-start" : "flex-end",
      }}
    >
      <View
        style={{
          ...styles.message,
          ...(from === MessageFrom.GPT
            ? styles.gptMessage
            : styles.userMessage),
        }}
      >
        <Text>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 12,
    flexDirection: "row",
  },
  message: {
    width: "60%",
    borderRadius: 12,
    padding: 12,
  },
  userMessage: {
    backgroundColor: "#22C2F1",
  },
  gptMessage: {
    backgroundColor: "#CACACA",
  },
});
