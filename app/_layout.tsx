import { store } from "@/state/store";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <Stack>
          <Stack.Screen
            name="(auth)/sign-in"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Back" }}
          />
          <Stack.Screen
            name="(log)/log"
            options={{ headerShown: true, title: "Log Food" }}
          />
          <Stack.Screen
            name="(editMeal)/editMeal"
            options={{ headerShown: true, title: "Edit Meal" }}
          />
        </Stack>
      </Provider>
    </>
  );
}
