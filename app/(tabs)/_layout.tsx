import { router, Tabs } from "expo-router";
import React from "react";
import { Button } from "react-native";
import HomeSVG from "../../svg/home.svg";
import MyFoodsSVG from "../../svg/myfoods.svg";
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
          title: "Log",
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
        name="foods"
        options={{
          title: "",
          tabBarLabel: () => <></>,
          tabBarIcon: (color) => (
            <MyFoodsSVG
              width={35}
              height={35}
              fill={color.focused ? "white" : Colors.themeColor}
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
