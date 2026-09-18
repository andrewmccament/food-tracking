import { defaultUserGoals, setGoals } from "@/state/userDataSlice";
import { DisplayedMacroConfig, DisplayedMacroTypes } from "@/types/openAi.types";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "@/components/ThemedText";
import { RootState } from "@/state/store";

type GoalInputValues = Record<DisplayedMacroTypes, string>;

const editableMacroConfig = DisplayedMacroConfig.filter(
  ({ type }) => type !== DisplayedMacroTypes.net_carbohydrates
);

export default function GoalsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.userData.goals);
  const [values, setValues] = useState<GoalInputValues>(() =>
    createInputValues(goals)
  );

  const hasInvalidValue = useMemo(
    () => editableMacroConfig.some(({ type }) => !isPositiveNumber(values[type])),
    [values]
  );

  const updateValue = (type: DisplayedMacroTypes, value: string) => {
    setValues((current) => ({ ...current, [type]: value }));
  };

  const saveGoals = () => {
    if (hasInvalidValue) {
      Alert.alert("Check your goals", "Enter a number greater than zero for each goal.");
      return;
    }

    const updatedGoals = Object.fromEntries(
      editableMacroConfig.map(({ type }) => [type, Number(values[type])])
    ) as Partial<typeof goals>;
    updatedGoals.net_carbohydrates =
      Number(values.carbohydrate) - Number(values.fiber);

    dispatch(setGoals(updatedGoals));
    router.back();
  };

  const resetGoals = () => {
    Alert.alert("Reset goals?", "This will restore the app's default daily goals.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => setValues(createInputValues(defaultUserGoals)),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText style={styles.intro}>
          Set the targets you want to see on Today. These are intentionally simple
          estimates, and you can change them whenever your needs change.
        </ThemedText>

        <View style={styles.card}>
          {editableMacroConfig.map(({ type, displayName, shortUnit }) => (
            <View key={type} style={styles.inputRow}>
              <ThemedText style={styles.label}>{displayName}</ThemedText>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={values[type]}
                  onChangeText={(value) => updateValue(type, value)}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                  selectTextOnFocus
                  style={styles.input}
                  accessibilityLabel={`${displayName} daily goal`}
                />
                <ThemedText style={styles.unit}>
                  {type === DisplayedMacroTypes.calories ? "kcal" : shortUnit}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <ThemedText style={styles.note}>
          Net carbs are calculated from carbs minus fiber. A future goal calculator
          can use your height, sex, weight, BMI, and desired weekly weight change
          to suggest these targets.
        </ThemedText>

        <Pressable style={styles.saveButton} onPress={saveGoals}>
          <ThemedText type="defaultSemiBold" colorOverride="black">
            Save goals
          </ThemedText>
        </Pressable>
        <Pressable style={styles.resetButton} onPress={resetGoals}>
          <ThemedText colorOverride="#ff8f8f">Reset to defaults</ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createInputValues(goals: typeof defaultUserGoals): GoalInputValues {
  return Object.fromEntries(
    DisplayedMacroConfig.map(({ type }) => [type, String(goals[type])])
  ) as GoalInputValues;
}

function isPositiveNumber(value: string) {
  const number = Number(value);
  return value.trim().length > 0 && Number.isFinite(number) && number > 0;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    color: "#b8b8bd",
    marginBottom: 20,
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#1c1c1e",
  },
  inputRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#3a3a3c",
  },
  label: {
    fontSize: 16,
    color: "white",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    minWidth: 72,
    color: "white",
    fontSize: 17,
    textAlign: "right",
    paddingVertical: 8,
  },
  unit: {
    width: 42,
    marginLeft: 6,
    color: "#a9a9ad",
  },
  note: {
    color: "#88888d",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 16,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#69cedf",
    borderRadius: 8,
    marginTop: 28,
    paddingVertical: 13,
  },
  resetButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
});
