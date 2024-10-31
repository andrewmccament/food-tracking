import { router, Tabs } from "expo-router";
import React from "react";
import { Button } from "react-native";
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          headerRight: () => (
            <Button title="Log" onPress={() => router.push("../(log)/log")} />
          ),
        }}
      />
      <Tabs.Screen name="foods" options={{ title: "My Foods" }} />
      <Tabs.Screen name="trends" options={{ title: "Trends" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
