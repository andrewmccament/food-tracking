import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SignInScreen() {
  setTimeout(() => router.push("/(tabs)/today"), 1000);
  return (
    <View>
      <Text>Sign In</Text>
    </View>
  );
}
