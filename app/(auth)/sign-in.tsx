import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function SignInScreen() {
  setTimeout(() => router.push("/(tabs)/today"), 1000);
  return (
    <View style={styles.container}>
      <ThemedText>Signing in...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
