import React from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { getFoodById, searchFood } from "@/services/fatsecret";
import { FoodSearchV1Response } from "@/types/fatSecret.types";
import { FoodSearchResults } from "@/components/EditIngredient/FoodSearchResults";
import { Ingredient } from "@/types/openAi.types";

export type IngredientSearchProps = {
  initialSearch?: string;
  onSelectIngredient: (ingredient: Ingredient) => void;
};

export const IngredientSearch = ({
  initialSearch,
  onSelectIngredient,
}: IngredientSearchProps) => {
  const inputRef = React.useRef(null);
  const [searchResults, setSearchResults] =
    React.useState<FoodSearchV1Response>();

  const search = async (query: string, clear?: boolean) => {
    const results = await searchFood(query);
    if (results) {
      setSearchResults(results);
      if (clear) {
        inputRef?.current?.clear();
      }
    }
  };

  React.useEffect(() => {
    if (initialSearch) {
      search(initialSearch);
    }
  }, [initialSearch]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type to AI..."
        returnKeyType="search"
        blurOnSubmit
        ref={inputRef}
        style={styles.searchBox}
        onSubmitEditing={(event) => search(event.nativeEvent.text, true)}
        clearButtonMode={"always"}
      ></TextInput>
      {searchResults && (
        <ScrollView>
          <FoodSearchResults
            searchResults={searchResults}
            onFoodSelected={(food) => onSelectIngredient(food)}
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
