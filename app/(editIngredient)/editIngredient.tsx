import React from "react";
import { RootState } from "@/state/store";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { TabView, SceneMap } from "react-native-tab-view";
import { ManualIngredientEditor } from "@/components/EditIngredient/ManualIngredientEditor";
import { IngredientSearch } from "@/components/EditIngredient/IngredientSearch";
import { updateIngredient } from "@/state/foodSlice";
import { Ingredient } from "@/types/openAi.types";

export default function EditIngredientScreen() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "ManualEdit", title: "Manual" },
    { key: "Search", title: "Search" },
  ]);

  const { mealId, ingredient } = useLocalSearchParams();
  if (!(mealId && ingredient)) return;
  const ingredientIndex = parseInt(ingredient[0]);
  const meal = useSelector((state: RootState) => state.food.todaysMeals).find(
    (meal) => meal.mealId === mealId
  );
  const thisIngredient = meal?.ingredients[ingredientIndex];

  const pushUpdateIngredient = (ingredient: Ingredient) => {
    dispatch(
      updateIngredient({
        mealId: mealId,
        ingredientIndex: ingredientIndex,
        ingredient: ingredient,
      })
    );
  };

  const ManualEdit = () =>
    thisIngredient ? (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={90}>
        <ManualIngredientEditor
          ingredient={thisIngredient}
          onUpdateIngredient={(ingredient: Ingredient) => {
            pushUpdateIngredient(ingredient);
          }}
        />
      </KeyboardAvoidingView>
    ) : (
      <View></View>
    );

  const Search = () => (
    <View>
      <IngredientSearch
        initialSearch={thisIngredient?.food_name}
        onSelectIngredient={(ingredient: Ingredient) => {
          pushUpdateIngredient(ingredient);
        }}
      />
    </View>
  );

  const renderScene = SceneMap({
    ManualEdit: ManualEdit,
    Search: Search,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({});
