import {
  FoodDetailedResponse,
  FoodSearchV1Response,
} from "@/types/fatSecret.types";
import { ThemedText } from "./ThemedText";
import { View, StyleSheet } from "react-native";

export type FoodSearchResultsProps = {
  searchResults: FoodSearchV1Response;
  onFoodSelected: (foodId: string) => void;
};

export const FoodSearchResults = ({
  searchResults,
  onFoodSelected,
}: FoodSearchResultsProps) => {
  return (
    <View>
      {searchResults?.foods?.food?.map((food) => (
        <View
          style={styles.resultContainer}
          onTouchEnd={() => onFoodSelected(food.food_id)}
        >
          <ThemedText type="subtitle">{food.food_name}</ThemedText>
          <ThemedText type="default">{food.food_description}</ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    width: "100%",
    minHeight: 100,
  },
});
