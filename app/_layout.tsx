import { persistor, store } from "@/state/store";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const headerStyle = {
    headerStyle: {
      backgroundColor: "#000000",
    },
  };

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#000000",
              },
              headerTitleStyle: {
                color: "white",
              },
            }}
          >
            <Stack.Screen
              name="(auth)/sign-in"
              options={{
                headerShown: false,
                ...headerStyle,
              }}
            />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                title: "Back",
                ...headerStyle,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="(log)/log"
              options={{ headerShown: true, title: "Log Food", ...headerStyle }}
            />
            <Stack.Screen
              name="(editIngredient)/editIngredient"
              options={{
                headerShown: true,
                title: "Edit Ingredient",
                ...headerStyle,
              }}
            />
          </Stack>
        </PersistGate>
      </Provider>
    </>
  );
}
