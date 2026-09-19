import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import HomeSVG from "../../svg/home.svg";
import TrendsSVG from "../../svg/trends.svg";
import SettingsSVG from "../../svg/settings.svg";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "black",
        },
        tabBarActiveTintColor: "blue",
        headerStyle: {
          backgroundColor: "#000000",
          borderColor: "black",
        },
        headerTitleStyle: {
          color: "white",
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
              color={color.focused ? "#ffffff" : Colors.themeColor}
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
              color={focused ? "white" : Colors.themeColor}
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
              color={color.focused ? "#ffffff" : Colors.themeColor}
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
              color={color.focused ? "#ffffff" : Colors.themeColor}
            />
          ),
        }}
      />
    </Tabs>
  );
}
