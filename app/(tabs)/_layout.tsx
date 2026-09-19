import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import HomeSVG from "../../svg/home.svg";
import TrendsSVG from "../../svg/trends.svg";
import SettingsSVG from "../../svg/settings.svg";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function TabLayout() {
  const theme = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.tabBackground,
          borderTopColor: theme.divider,
        },
        tabBarActiveTintColor: theme.accent,
        headerStyle: {
          backgroundColor: theme.surface,
          borderColor: theme.divider,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarLabel: () => <></>,
          tabBarIcon: (color) => (
            <HomeSVG
              width={35}
              height={35}
              color={color.focused ? theme.text : theme.tabInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarLabel: () => <></>,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="restaurant-outline"
              size={29}
              color={focused ? theme.text : theme.tabInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "",
          tabBarLabel: () => <></>,
          tabBarIcon: (color) => (
            <TrendsSVG
              width={35}
              height={35}
              color={color.focused ? theme.text : theme.tabInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarLabel: () => <></>,
          tabBarIcon: (color) => (
            <SettingsSVG
              width={35}
              height={35}
              color={color.focused ? theme.text : theme.tabInactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}
