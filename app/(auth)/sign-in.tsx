import { router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function SignInScreen() {
  setTimeout(() => router.push("/(tabs)/today"), 3000);
  return (
    <View style={styles.container}>
      <Text>Signing in...</Text>
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
