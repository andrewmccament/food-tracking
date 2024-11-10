import { getRecipeSummedMacros, getSummedMacros } from "@/helpers/food-utils";
import { capFirstLetter } from "@/helpers/ui";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from "react-native";
import { ProgressBar, ProgressBarStyles } from "./ProgressBar";
import { ThemedText } from "../ThemedText";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { removeMeal, updateMeal } from "@/state/foodSlice";
import {
  DisplayedMacroConfig,
  DisplayedMacroIterator,
  DisplayedMacroTypes,
  Ingredient,
  Meal,
  MealCategories,
  Serving,
} from "@/types/openAi.types";
import { Picker } from "@react-native-picker/picker";
import DeleteSVG from "../../svg/delete.svg";
import EditSVG from "../../svg/edit.svg";
import DoneSVG from "../../svg/done.svg";
import AddSVG from "../../svg/add.svg";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export type MealSummaryProps = {
  mealId: string;
  allowAdding?: boolean;
  onAdd?: () => void;
  expandedByDefault?: boolean;
  embedded?: boolean;
};

export type MacroBreakdownProps = { macros: Serving; textStyle?: any };
export const MacroBreakdown = ({ macros, textStyle }: MacroBreakdownProps) => {
  return (
    <View>
      {DisplayedMacroIterator.map((macro, index) => (
        <View key={index}>
          <ProgressBar
            style={ProgressBarStyles.REVERSED}
            macro={macro}
            amount={macros[macro]}
            textStyle={textStyle}
          />
        </View>
      ))}
    </View>
  );
};

export default function MealSummary({
  mealId,
  allowAdding,
  onAdd,
  expandedByDefault = false,
  embedded = false,
}: MealSummaryProps) {
  const [expanded, setExpanded] = React.useState(expandedByDefault);
  const [editing, setEditing] = React.useState(false);
  let colorScheme = useColorScheme();

  const meal = useSelector((state: RootState) => state.food.meals).find(
    (meal: Meal) => meal.mealId === mealId
  );

  React.useEffect(() => setExpanded(editing), [editing]);
  React.useEffect(() => setEditing(expanded ? editing : false), [expanded]);

  const [pickerCategory, setPickerCategory] = React.useState(meal?.meal);
  React.useEffect(() => updateMealCategory(), [pickerCategory]);

  const dispatch = useDispatch();

  let recipeServings = [];
  for (let i = 0; i < 1000; i += 0.5) {
    recipeServings.push(i);
  }

  const deleteMeal = () => {
    if (!meal?.mealId) return;
    Alert.alert("Are you sure you want to delete this meal?", "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Delete", onPress: () => dispatch(removeMeal(meal.mealId)) },
    ]);
  };

  const updateMealCategory = () => {
    dispatch(updateMeal({ updatedMeal: { ...meal, meal: pickerCategory } }));
  };

  const updateMealSummary = (text: string) => {
    dispatch(updateMeal({ updatedMeal: { ...meal, summary: text } }));
  };

  const updateRecipeYields = (value: number) => {
    dispatch(
      updateMeal({
        updatedMeal: {
          ...meal,
          recipe: { title: meal.recipe.title, yields: value },
        },
      })
    );
  };

  const updateRecipeTitle = (value: string) => {
    dispatch(
      updateMeal({
        updatedMeal: {
          ...meal,
          recipe: { title: value, yields: meal.recipe.yields },
        },
      })
    );
  };
  return meal ? (
    <ThemedView
      style={{ ...styles.infoPanel, borderRadius: embedded ? 12 : 12 }}
    >
      <View style={styles.header}>
        {((meal.recipe && !editing) || !meal.recipe) && (
          <ThemedText type="subtitle" onPress={() => setExpanded(!expanded)}>
            {capFirstLetter(meal.recipe ? meal.recipe.title : meal.meal)}
          </ThemedText>
        )}
        {meal.recipe && editing && (
          <TextInput
            placeholder="Name your recipe..."
            style={styles.titleEdit}
            onSubmitEditing={(event) =>
              updateRecipeTitle(event.nativeEvent.text)
            }
          >
            {meal.recipe.title}
          </TextInput>
        )}
        <View style={styles.row}>
          {editing ? (
            <TouchableOpacity onPress={() => setEditing(false)}>
              <DoneSVG
                width={30}
                height={30}
                fill={colorScheme === "dark" ? "#ffffff" : Colors.themeColor}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setEditing(true);
              }}
            >
              <EditSVG
                width={30}
                height={25}
                color={colorScheme === "dark" ? "#ffffff" : Colors.themeColor}
              />
            </TouchableOpacity>
          )}

          {meal.isAdded && (
            <TouchableOpacity onPress={deleteMeal}>
              <DeleteSVG
                width={30}
                height={30}
                fill={colorScheme === "dark" ? "#ffffff" : "#C2473E"}
              />
            </TouchableOpacity>
          )}

          {allowAdding && (
            <TouchableOpacity onPress={() => onAdd()}>
              <AddSVG width={30} height={30} color={Colors.themeColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {editing && meal.meal !== "Recipe" && (
        <View style={styles.categoryPickerContainer}>
          <Picker
            selectedValue={pickerCategory}
            onValueChange={(value) => setPickerCategory(value)}
            style={styles.categoryPicker}
          >
            {Object.values(MealCategories).map((key) => (
              <Picker.Item value={key} label={key}></Picker.Item>
            ))}
          </Picker>
        </View>
      )}
      <View>
        <View style={styles.macros}>
          {meal.recipe && !editing && (
            <ThemedText type="defaultSemiBold">
              Makes {meal.recipe.yields} servings. Per serving:
            </ThemedText>
          )}
          {meal.recipe && editing && (
            <Picker
              selectedValue={meal.recipe.yields}
              onValueChange={(value) => updateRecipeYields(value)}
              itemStyle={{ color: "white" }}
            >
              {recipeServings.map((i) => (
                <Picker.Item value={i} label={i + " servings"} />
              ))}
            </Picker>
          )}
          <ProgressBar
            macro={DisplayedMacroTypes.calories}
            amount={
              meal.recipe
                ? getRecipeSummedMacros(meal).calories
                : getSummedMacros([meal]).calories
            }
          />
          <ProgressBar
            macro={DisplayedMacroTypes.net_carbohydrates}
            amount={
              meal.recipe
                ? getRecipeSummedMacros(meal).net_carbohydrates
                : getSummedMacros([meal]).net_carbohydrates
            }
          />
          <ProgressBar
            macro={DisplayedMacroTypes.fat}
            amount={
              meal.recipe
                ? getRecipeSummedMacros(meal).fat
                : getSummedMacros([meal]).fat
            }
          />
          <ProgressBar
            macro={DisplayedMacroTypes.protein}
            amount={
              meal.recipe
                ? getRecipeSummedMacros(meal).protein
                : getSummedMacros([meal]).protein
            }
          />
        </View>
      </View>
      {editing ? (
        <TextInput
          style={styles.summaryInputBox}
          value={meal.summary}
          multiline
          onChangeText={(text) => updateMealSummary(text)}
        ></TextInput>
      ) : (
        <ThemedText type="defaultSemiBold" style={{ marginTop: 8 }}>
          {meal.summary}
        </ThemedText>
      )}
      {expanded && (
        <ScrollView style={styles.ingredientList}>
          {meal.ingredients.map((ingredient: Ingredient, index: number) => (
            <TouchableOpacity
              style={styles.ingredient}
              key={index}
              onPress={() =>
                router.push({
                  pathname: "../(editIngredient)/editIngredient",
                  params: { mealId: mealId, ingredient: index },
                })
              }
            >
              <View style={styles.row}>
                <ThemedText type="defaultSemiBold">
                  {capFirstLetter(ingredient.food_name)}
                </ThemedText>
                <ThemedText type="default">
                  {` ${ingredient.serving.serving_description}`}
                </ThemedText>
              </View>
              <MacroBreakdown macros={ingredient.serving} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  ingredientList: {
    gap: 12,
    marginTop: 8,
  },
  ingredient: {
    paddingTop: 12,
    paddingLeft: 2,
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoPanel: {
    borderRadius: 0,
    padding: 12,
  },
  categoryPickerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  categoryPicker: { flex: 1 },
  categoryPickerBtn: {},
  summaryInputBox: {
    fontSize: 16,
    color: "white",
  },
  titleEdit: {
    color: "white",
    fontSize: 22,
  },
});
