import React from "react";
import { RootState } from "@/state/store";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { TabView, SceneMap } from "react-native-tab-view";
import { ManualIngredientEditor } from "@/components/EditIngredient/ManualIngredientEditor";
import { IngredientSearch } from "@/components/EditIngredient/IngredientSearch";
import { updateIngredient } from "@/state/foodSlice";
import { Ingredient } from "@/types/openAi.types";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemedText } from "@/components/ThemedText";

export default function EditIngredientScreen() {
  const theme = useAppTheme();
  const layout = useWindowDimensions();
  const dispatch = useDispatch();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "Search", title: "Search" },
    { key: "ManualEdit", title: "Manual" },
  ]);

  const { mealId, ingredient } = useLocalSearchParams();
  const mealIdParam = Array.isArray(mealId) ? mealId[0] : mealId;
  const ingredientParam = Array.isArray(ingredient) ? ingredient[0] : ingredient;
  const ingredientIndex = parseInt(ingredientParam ?? "", 10);
  const meal = useSelector((state: RootState) => state.food.meals).find(
    (meal) => meal.mealId === mealIdParam
  );
  const thisIngredient = meal?.ingredients[ingredientIndex];

  if (!mealIdParam || Number.isNaN(ingredientIndex)) return null;

  const pushUpdateIngredient = (ingredient: Ingredient) => {
    dispatch(
      updateIngredient({
        mealId: mealIdParam,
        ingredientIndex: ingredientIndex,
        ingredient: ingredient,
      })
    );
  };

  const ManualEdit = () =>
    thisIngredient ? (
      <KeyboardAvoidingView behavior="height">
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
    Search: Search,
    ManualEdit: ManualEdit,
  });

  const renderTabBar = (props: any) => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route: { title: string }, i: number) => {
          return (
            <TouchableOpacity
              style={{
                ...styles.tabButton,
                backgroundColor:
                  index === i ? theme.surfaceRaised : theme.background,
              }}
              onPress={() => setIndex(i)}
            >
              <ThemedText
                style={{
                  ...(index === i ? styles.selectedButtonText : {}),
                }}
              >
                {route.title}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{ backgroundColor: theme.background }}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    borderRightWidth: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButtonText: {
    fontWeight: "500",
  },
});
