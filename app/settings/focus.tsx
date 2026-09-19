import { ThemedText } from "@/components/ThemedText";
import {
  defaultFocusedMetrics,
  setFocusedMetrics,
} from "@/state/userDataSlice";
import { RootState } from "@/state/store";
import { DisplayedMacroConfig, DisplayedMacroTypes } from "@/types/openAi.types";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function FocusScreen() {
  const dispatch = useDispatch();
  const focusedMetrics = useSelector(
    (state: RootState) => state.userData.focusedMetrics ?? defaultFocusedMetrics
  );

  const toggleMetric = (metric: DisplayedMacroTypes) => {
    const isFocused = focusedMetrics.includes(metric);
    if (isFocused && focusedMetrics.length === 1) {
      Alert.alert("Keep one metric", "Choose at least one metric to display in summaries.");
      return;
    }

    const next = isFocused
      ? focusedMetrics.filter((focusedMetric) => focusedMetric !== metric)
      : DisplayedMacroConfig.map(({ type }) => type).filter(
          (configuredMetric) =>
            configuredMetric === metric || focusedMetrics.includes(configuredMetric)
        );
    dispatch(setFocusedMetrics(next));
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ThemedText style={styles.intro}>
        Pick the metrics that matter most to you. They appear on Today and on
        compact meal summaries; detailed views still show everything.
      </ThemedText>
      <View style={styles.card}>
        {DisplayedMacroConfig.map(({ type, displayName, shortUnit, color }) => {
          const isFocused = focusedMetrics.includes(type);
          return (
            <Pressable
              key={type}
              style={styles.option}
              onPress={() => toggleMetric(type)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isFocused }}
              accessibilityLabel={`${displayName} ${isFocused ? "shown" : "hidden"}`}
            >
              <View style={styles.optionLabel}>
                <View style={[styles.colorDot, { backgroundColor: color }]} />
                <View>
                  <ThemedText type="defaultSemiBold">{displayName}</ThemedText>
                  <ThemedText style={styles.unit}>
                    {type === DisplayedMacroTypes.calories ? "Calories" : `Grams (${shortUnit})`}
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.checkbox, isFocused && styles.checkboxSelected]}>
                {isFocused && <ThemedText colorOverride="black">✓</ThemedText>}
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "black" },
  content: { padding: 20, paddingBottom: 40 },
  intro: { color: "#b8b8bd", marginBottom: 20 },
  card: { backgroundColor: "#1c1c1e", borderRadius: 10, paddingHorizontal: 16 },
  option: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3a3a3c",
  },
  optionLabel: { flexDirection: "row", alignItems: "center", gap: 10 },
  colorDot: { height: 10, width: 10, borderRadius: 5 },
  unit: { color: "#a9a9ad", fontSize: 13 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#85858a",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: { borderColor: "#69cedf", backgroundColor: "#69cedf" },
});
