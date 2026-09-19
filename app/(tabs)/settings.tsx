import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("/settings/recipes")}
        accessibilityRole="button"
        accessibilityLabel="Recipes"
      >
        <View>
          <ThemedText type="defaultSemiBold">Recipes</ThemedText>
          <ThemedText style={styles.description}>
            Create and manage your saved foods
          </ThemedText>
        </View>
        <ThemedText style={styles.chevron}>›</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemSpaced]}
        onPress={() => router.push("/settings/goals")}
        accessibilityRole="button"
        accessibilityLabel="Goals"
      >
        <View>
          <ThemedText type="defaultSemiBold">Goals</ThemedText>
          <ThemedText style={styles.description}>
            Customize your daily nutrition targets
          </ThemedText>
        </View>
        <ThemedText style={styles.chevron}>›</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    marginBottom: 24,
    color: "white",
  },
  menuItem: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1c1c1e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemSpaced: {
    marginTop: 12,
  },
  description: {
    color: "#a9a9ad",
    fontSize: 14,
  },
  chevron: {
    color: "#a9a9ad",
    fontSize: 30,
    lineHeight: 30,
  },
});
