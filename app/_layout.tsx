import { persistor, store } from "@/state/store";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
            <Stack.Screen
              name="(editIngredient)/editIngredient"
              options={{ headerShown: true, title: "Edit Ingredient" }}
            />
          </Stack>
        </PersistGate>
      </Provider>
    </>
  );
}
