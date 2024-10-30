import { Image, StyleSheet, Platform, ScrollView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";

export default function TodayScreen() {
  return (
    <ScrollView style={styles.sheet}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Today</ThemedText>
        <ThemedText type="title">Add...</ThemedText>
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
    marginTop: 100,
    margin: 24,
    gap: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoPanel: {
    marginTop: 24,
    borderRadius: 4,
    padding: 4,
  },
});
