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
import { scaleServing } from "@/helpers/food-utils";

export type ManualIngredientEditorProps = {
  ingredient: Ingredient;
  onUpdateIngredient: (ingredient: Ingredient) => void;
};

export const ManualIngredientEditor = ({
  ingredient,
  onUpdateIngredient,
}: ManualIngredientEditorProps) => {
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
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        onSubmitEditing={(event) => editIngredientName(event.nativeEvent.text)}
        clearButtonMode={"always"}
      >
        {capFirstLetter(ingredient?.food_name)}
      </TextInput>
      <ServingPicker
        possibleServings={[ingredient?.serving]}
        onAmountChange={(val: number) => {
          onUpdateIngredient({
            ...ingredient,
            serving: scaleServing(ingredient.serving, val),
          });
        }}
        onServingIndexChange={() => {}}
      />
      <View>
        <MacroBreakdown macros={ingredient?.serving} />
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
                {ingredient?.serving[macro]}
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
