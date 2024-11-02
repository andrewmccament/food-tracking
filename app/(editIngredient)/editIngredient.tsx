import React from "react";
import { RootState } from "@/state/store";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ThemedText } from "@/components/ThemedText";
import { capFirstLetter } from "@/helpers/ui";
import { MacroBreakdown } from "@/components/MealSummary";
import { searchFood } from "@/services/fatsecret";
import { updateIngredient } from "@/state/foodSlice";
import { getPrettyNameForMacro } from "@/helpers/macronutrients";
import { MacroNutrientEnum } from "@/gpt-prompts/meal-parsing";

export default function EditIngredientScreen() {
  const dispatch = useDispatch();
  const { mealId, ingredient } = useLocalSearchParams();
  if (!(mealId && ingredient)) return;
  const ingredientIndex = parseInt(ingredient[0]);
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal) => meal.mealId === mealId
  );
  const [thisIngredient, updateThisIngredient] = React.useState(
    meal?.ingredients[ingredientIndex]
  );

  const editIngredientName = (text: string) => {
    const updatedIngredient = { ...thisIngredient, ingredientName: text };
    updateThisIngredient(updatedIngredient);
  };

  const updateMacro = (macro: MacroNutrientEnum, value: string) => {
    if (isNaN(parseInt(value))) return;

    let thisIngredientCopy = JSON.parse(JSON.stringify(thisIngredient));
    thisIngredientCopy.macronutrients[macro] = parseInt(value);
    updateThisIngredient(thisIngredientCopy);
  };

  React.useEffect(() => {
    return () => {
      dispatch(
        updateIngredient({
          mealId: mealId,
          ingredientIndex: ingredientIndex,
          ingredient: thisIngredient,
        })
      );
    };
  }, [thisIngredient]);

  return (
    <View style={styles.container}>
      <TextInput
        onSubmitEditing={(event) => searchFood(event.nativeEvent.text)}
        style={styles.searchBox}
        onChangeText={editIngredientName}
        clearButtonMode={"always"}
      >
        {capFirstLetter(thisIngredient?.ingredientName)}
      </TextInput>
      <MacroBreakdown macros={thisIngredient?.macronutrients} />
      <View style={styles.macroEditingList}>
        {Object.keys(thisIngredient?.macronutrients).map((macro) => (
          <View style={styles.macroEditor}>
            <Text>{getPrettyNameForMacro(macro)}</Text>
            <TextInput
              onChangeText={(text) => updateMacro(macro, text)}
              style={{ ...styles.searchBox, width: "auto" }}
              keyboardType="numeric"
            >
              {thisIngredient?.macronutrients[macro]}
            </TextInput>
          </View>
        ))}
      </View>
    </View>
  );
}

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
