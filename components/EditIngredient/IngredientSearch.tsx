import React from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { getFoodById, searchFood } from "@/services/fatsecret";
import { FoodSearchV1Response } from "@/types/fatSecret.types";
import { FoodSearchResults } from "@/components/EditIngredient/FoodSearchResults";
import { Ingredient } from "@/types/openAi.types";
import { convertFatSecretFood } from "@/helpers/food-utils";

export type IngredientSearchProps = {
  onSelectIngredient: (ingredient: Ingredient) => {};
};

export const IngredientSearch = ({
  onSelectIngredient,
}: IngredientSearchProps) => {
  const [searchResults, setSearchResults] =
    React.useState<FoodSearchV1Response>();
  const [thisIngredient, updateThisIngredient] = React.useState<Ingredient>();

  const search = async (query: string) => {
    const results = await searchFood(query);
    if (results) {
      setSearchResults(results);
    }
  };

  const fatSecretFoodSelected = async (foodId: string) => {
    const detailedFood = await getFoodById(foodId);
    if (detailedFood) {
      updateThisIngredient(convertFatSecretFood(detailedFood));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        onSubmitEditing={(event) => search(event.nativeEvent.text)}
        clearButtonMode={"always"}
      ></TextInput>
      {searchResults && (
        <ScrollView>
          <FoodSearchResults
            searchResults={searchResults}
            onFoodSelected={(foodId) => fatSecretFoodSelected(foodId)}
          />
        </ScrollView>
      )}
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
});
