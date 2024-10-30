import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="today" options={{ title: "Today" }} />
      <Tabs.Screen name="foods" options={{ title: "My Foods" }} />
      <Tabs.Screen name="trends" options={{ title: "Trends" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
