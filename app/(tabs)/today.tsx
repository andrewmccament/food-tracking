import React from "react";
import { Image, StyleSheet, Platform, ScrollView, Button } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";

export default function TodayScreen() {
  return (
    <ScrollView style={styles.sheet}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Today</ThemedText>
        <Button title="Log" onPress={() => router.push("../(log)/log")} />
      </ThemedView>
      <ThemedView style={styles.infoPanel}>
        <ThemedText>Calories: 1350/1850</ThemedText>
        <ThemedText>Carbohydrates: 18.5/20</ThemedText>
        <ThemedText>Protein: 120g/180g</ThemedText>
        <ThemedText>Fat: 140g/150g</ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoPanel}>
        <ThemedText type="subtitle">
          Breakfast
          <ThemedText type="defaultSemiBold"> (328 calories)</ThemedText>
        </ThemedText>
        <ThemedText>Eggs and spinach; heavy cream.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoPanel}>
        <ThemedText type="subtitle">Lunch</ThemedText>
        <ThemedText>Arnold keto bread, turkey and cheese. Yogurt.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoPanel}>
        <ThemedText type="subtitle">Snack before Dinner</ThemedText>
        <ThemedText>Heavy cream.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoPanel}>
        <ThemedText type="subtitle">Dinner</ThemedText>
        <ThemedText>Keto chow, heavy cream.</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sheet: {
    margin: 24,
    gap: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 12,
  },
  infoPanel: {
    marginTop: 24,
    borderRadius: 8,
    padding: 12,
  },
});
