import React from "react";
import { RootState } from "@/state/store";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { TabView, SceneMap } from "react-native-tab-view";
import { ManualIngredientEditor } from "@/components/EditIngredient/ManualIngredientEditor";
import { IngredientSearch } from "@/components/EditIngredient/IngredientSearch";
import { updateIngredient } from "@/state/foodSlice";
import { Ingredient } from "@/types/openAi.types";
import { Colors } from "@/constants/Colors";

export default function EditIngredientScreen() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "Search", title: "Search" },
    { key: "ManualEdit", title: "Manual" },
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

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <TouchableOpacity
              style={{
                ...styles.tabButton,
                backgroundColor:
                  index === i ? Colors.themeColorBackground : "black",
              }}
              onPress={() => setIndex(i)}
            >
              <Text
                style={{
                  color: "white",
                  ...(index === i ? styles.selectedButtonText : {}),
                }}
              >
                {route.title}
              </Text>
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
      style={{ backgroundColor: "white" }}
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
