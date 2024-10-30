import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "Back" }}
      />
      <Stack.Screen
        name="(log)/log"
        options={{ headerShown: true, title: "Log Food" }}
      />
    </Stack>
  );
}
