import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { capFirstLetter } from "@/helpers/ui";
import { MacroBreakdown } from "@/components/Shared/MealSummary";
import {
  DisplayedMacroConfig,
  DisplayedMacroIterator,
  DisplayedMacroTypes,
  Ingredient,
} from "@/types/openAi.types";
import { ServingPicker } from "./ServingPicker";
import { scaleServing } from "@/helpers/food-utils";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemedText } from "../ThemedText";

export type ManualIngredientEditorProps = {
  ingredient: Ingredient;
  onUpdateIngredient: (ingredient: Ingredient) => void;
};

export const ManualIngredientEditor = ({
  ingredient,
  onUpdateIngredient,
}: ManualIngredientEditorProps) => {
  const theme = useAppTheme();
  const [amount, setAmount] = React.useState(
    ingredient.serving.number_of_units
  );

  const editIngredientName = (text: string) => {
    const updatedIngredient: Ingredient = { ...ingredient, food_name: text };
    onUpdateIngredient(updatedIngredient);
  };

  const updateMacro = (macro: DisplayedMacroTypes, value: string) => {
    if (isNaN(parseInt(value))) return;

    let thisIngredientCopy = JSON.parse(JSON.stringify(ingredient));
    thisIngredientCopy.serving[macro] = parseInt(value);
    onUpdateIngredient(thisIngredientCopy);
  };

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: theme.background }}
      behavior="padding"
    >
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            style={[styles.searchBox, { borderColor: theme.accent, color: theme.text }]}
            onSubmitEditing={(event) =>
              editIngredientName(event.nativeEvent.text)
            }
            clearButtonMode={"always"}
          >
            {capFirstLetter(ingredient?.food_name)}
          </TextInput>
          <View style={[styles.panel, { backgroundColor: theme.surfaceRaised }] }>
            <MacroBreakdown macros={ingredient?.serving} />
          </View>
          <View style={[styles.panel, { backgroundColor: theme.surfaceRaised }] }>
            {DisplayedMacroIterator.map((macro, index) => (
              <View style={styles.macroEditor} key={index}>
                <ThemedText>
                  {
                    DisplayedMacroConfig.find(
                      (macroConfig) => macroConfig.type === macro
                    )?.displayName
                  }
                </ThemedText>
                <TextInput
                  onChangeText={(text) => updateMacro(macro, text)}
                  style={[styles.searchBox, { width: "auto", borderColor: theme.accent, color: theme.text }]}
                  keyboardType="numeric"
                >
                  {ingredient?.serving[macro]}
                </TextInput>
              </View>
            ))}
          </View>
          <View style={[styles.panel, { backgroundColor: theme.surfaceRaised }]}>
            <ServingPicker
              possibleServings={[ingredient?.serving]}
              onAmountChange={(val: number) => {
                const serving = scaleServing(ingredient.serving, val);
                if (!serving) return;
                onUpdateIngredient({
                  ...ingredient,
                  serving,
                });
              }}
              onServingIndexChange={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 12,
    marginRight: 8,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  searchBox: {
    borderWidth: 1,
    height: 40,
    width: "100%",
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 18,
  },
  panel: {
    width: "100%",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    borderRadius: 12,
  },
  macroEditor: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 2,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
