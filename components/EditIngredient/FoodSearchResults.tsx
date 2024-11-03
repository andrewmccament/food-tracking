import {
  FoodDetailedResponse,
  FoodSearchV1Response,
} from "@/types/fatSecret.types";
import { ThemedText } from "../ThemedText";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { getFoodById } from "@/services/fatsecret";
import { DisplayedMacroIterator, Serving } from "@/types/openAi.types";
import { ProgressBar } from "../Shared/ProgressBar";
import { scaleServing } from "@/helpers/food-utils";
import { ThemedButton } from "../ThemedButton";
import { ServingPicker } from "./ServingPicker";

export type FoodSearchResultsProps = {
  searchResults: FoodSearchV1Response;
  onFoodSelected: (foodId: string) => void;
};

export const FoodSearchResults = ({
  searchResults,
  onFoodSelected,
}: FoodSearchResultsProps) => {
  const [expandedIndex, setExpandedIndex] = React.useState(-1);
  const [expandedFoodDetails, setExpandedFoodDetails] =
    React.useState<FoodDetailedResponse>();
  const [selectedUnitIndex, selectUnitIndex] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [servingPreview, setServingPreview] = React.useState<Serving>();

  const expandIndex = async (index: number) => {
    const details = await getFoodById(searchResults.foods.food[index].food_id);
    if (details) {
      setExpandedIndex(index);
      setExpandedFoodDetails(details);
      setAmount(parseFloat(details.food.servings.serving[0].number_of_units));
      calculateServingPreview();
    }
  };

  React.useEffect(() => {
    if (expandedFoodDetails) {
      calculateServingPreview();
    }
  }, [selectedUnitIndex, amount]);

  const calculateServingPreview = () => {
    const serving =
      expandedFoodDetails?.food.servings.serving[selectedUnitIndex];
    if (serving) {
      setServingPreview(scaleServing(serving, parseFloat(amount)));
    }
  };

  return (
    <View>
      {searchResults?.foods?.food?.map((food, index) => (
        <View key={index} style={styles.resultContainer}>
          <TouchableOpacity onPress={() => expandIndex(index)}>
            <ThemedText type="subtitle">{food.food_name}</ThemedText>
            {index !== expandedIndex && (
              <ThemedText type="default">{food.food_description}</ThemedText>
            )}
          </TouchableOpacity>
          {index === expandedIndex && expandedFoodDetails && (
            <View>
              <ServingPicker
                possibleServings={expandedFoodDetails?.food.servings.serving}
                onAmountChange={(amount: number) => setAmount(amount)}
                onServingIndexChange={(newIndex: number) =>
                  selectUnitIndex(newIndex)
                }
              />
              <View>
                {servingPreview &&
                  DisplayedMacroIterator.map((macro) => (
                    <ProgressBar
                      macro={macro}
                      amount={parseFloat(servingPreview[macro])}
                    />
                  ))}
              </View>
              <ThemedButton onPress={() => {}} title="Add" />
            </View>
          )}
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
