import React from "react";
import { RootState } from "@/state/store";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, TextInput, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ThemedText } from "@/components/ThemedText";
import { capFirstLetter } from "@/helpers/ui";
import { MacroBreakdown } from "@/components/MealSummary";
import { searchFood } from "@/services/fatsecret";
import { updateIngredient } from "@/state/foodSlice";
import { getPrettyNameForMacro } from "@/helpers/macronutrients";
import { FoodSearchV1Response } from "@/types/fatSecret.types";
import { FoodSearchResults } from "@/components/FoodSearchResults";
import {
  DisplayedMacroConfig,
  DisplayedMacroIterator,
  DisplayedMacroTypes,
  Ingredient,
} from "@/types/openAi.types";

export default function EditIngredientScreen() {
  const dispatch = useDispatch();
  const { mealId, ingredient } = useLocalSearchParams();
  if (!(mealId && ingredient)) return;
  const ingredientIndex = parseInt(ingredient[0]);
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal) => meal.mealId === mealId
  );
  const [searchResults, setSearchResults] =
    React.useState<FoodSearchV1Response>();
  const [thisIngredient, updateThisIngredient] = React.useState<Ingredient>(
    meal?.ingredients[ingredientIndex]
  );

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

  const search = async (query: string) => {
    const results = await searchFood(query);
    if (results) {
      setSearchResults(results);
    }
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
        onSubmitEditing={(event) => search(event.nativeEvent.text)}
        style={styles.searchBox}
        onChangeText={editIngredientName}
        clearButtonMode={"always"}
      >
        {capFirstLetter(thisIngredient?.food_name)}
      </TextInput>
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
      {searchResults && (
        <ScrollView>
          <FoodSearchResults
            searchResults={searchResults}
            onFoodSelected={() => {}}
          />
        </ScrollView>
      )}
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
