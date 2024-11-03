import React from "react";
import { RootState } from "@/state/store";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { TabView, SceneMap } from "react-native-tab-view";
import { ManualIngredientEditor } from "@/components/EditIngredient/ManualIngredientEditor";
import { IngredientSearch } from "@/components/EditIngredient/IngredientSearch";

export default function EditIngredientScreen() {
  const layout = useWindowDimensions();

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

  const ManualEdit = () =>
    thisIngredient ? (
      <View>
        <ManualIngredientEditor
          ingredient={thisIngredient}
          onUpdateIngredient={() => {}}
        />
      </View>
    ) : (
      <View></View>
    );

  const Search = () => (
    <View>
      <IngredientSearch onSelectIngredient={() => {}} />
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
