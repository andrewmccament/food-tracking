import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { capFirstLetter } from "@/helpers/ui";
import { MacroBreakdown } from "@/components/Shared/MealSummary";
import {
  DisplayedMacroConfig,
  DisplayedMacroIterator,
  DisplayedMacroTypes,
  Ingredient,
} from "@/types/openAi.types";
import { ServingPicker } from "./ServingPicker";

export type ManualIngredientEditorProps = {
  ingredient: Ingredient;
  onUpdateIngredient: (ingredient: Ingredient) => void;
};

export const ManualIngredientEditor = ({
  ingredient,
  onUpdateIngredient,
}: ManualIngredientEditorProps) => {
  const [thisIngredient, updateThisIngredient] =
    React.useState<Ingredient>(ingredient);

  React.useEffect(() => onUpdateIngredient(thisIngredient), [thisIngredient]);

  const editIngredientName = (text: string) => {
    const updatedIngredient = { ...thisIngredient, food_name: text };
    updateThisIngredient(updatedIngredient);
  };

  const updateMacro = (macro: DisplayedMacroTypes, value: string) => {
    if (isNaN(parseInt(value))) return;

    let thisIngredientCopy = JSON.parse(JSON.stringify(thisIngredient));
    thisIngredientCopy.macronutrients[macro] = parseInt(value);
    updateThisIngredient(thisIngredientCopy);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        onChangeText={editIngredientName}
        clearButtonMode={"always"}
      >
        {capFirstLetter(thisIngredient?.food_name)}
      </TextInput>
      <ServingPicker
        possibleServings={[thisIngredient?.serving]}
        onAmountChange={() => {}}
        onServingIndexChange={() => {}}
      />
      <View>
        <MacroBreakdown macros={thisIngredient?.serving} />
        <View style={styles.macroEditingList}>
          {DisplayedMacroIterator.map((macro, index) => (
            <View style={styles.macroEditor} key={index}>
              <Text>
                {
                  DisplayedMacroConfig.find(
                    (macroConfig) => macroConfig.type === macro
                  )?.displayName
                }
              </Text>
              <TextInput
                onChangeText={(text) => updateMacro(macro, text)}
                style={{ ...styles.searchBox, width: "auto" }}
                keyboardType="numeric"
              >
                {thisIngredient?.serving[macro]}
              </TextInput>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 16,
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
    borderColor: "#22C2F1",
    borderRadius: 8,
    fontSize: 18,
  },
  macroEditingList: {
    width: "100%",
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
  },
  macroEditor: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#22C2F1",
    padding: 8,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
