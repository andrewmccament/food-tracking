import { ThemedText } from "@/components/ThemedText";
import { Chat } from "@/components/Log/Chat";
import { getSummedMacros } from "@/helpers/food-utils";
import {
  getRemainingMacros,
} from "@/helpers/planning-utils";
import { parseMeal } from "@/services/open-ai";
import { logMeal, recordMeal } from "@/state/foodSlice";
import { RootState } from "@/state/store";
import { Meal } from "@/types/openAi.types";
import * as Crypto from "expo-crypto";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const dateKey = () => {
  const date = new Date();
  return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
};

export default function PlanScreen() {
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.userData.goals);
  const meals = useSelector((state: RootState) => state.food.meals);
  const [plannedMeal, setPlannedMeal] = React.useState<Meal>();
  const planningRequestInFlight = React.useRef(false);

  const todayMeals = meals.filter(
    (meal) => meal.isAdded && !meal.recipe && meal.date === dateKey()
  );
  const consumed = getSummedMacros(todayMeals);
  const remaining = getRemainingMacros(goals, consumed);
  const servingMacros = plannedMeal ? getSummedMacros([plannedMeal]) : undefined;
  const remainingAfterPlan = servingMacros
    ? getRemainingMacros(remaining, servingMacros)
    : undefined;

  const estimateFood = async (input: string) => {
    const trimmedQuery = input.trim();
    if (!trimmedQuery) return "Tell me what you're considering eating.";
    if (planningRequestInFlight.current) return "I'm still estimating the last option.";

    planningRequestInFlight.current = true;
    try {
      const activePlanContext = plannedMeal
        ? `The user already has this one-serving plan: ${JSON.stringify({
            summary: plannedMeal.summary,
            ingredients: plannedMeal.ingredients,
          })}. If their request refers to it, preserve that food and apply any requested modification. `
        : "";
      const response = await parseMeal(
        `${activePlanContext}This is a food-planning conversation. Estimate the exact food and quantities in the user's latest request. If they refer to the current plan, treat their request as a revision of it. Do not normalize, scale, omit, or invent quantities: \"3 slices of pizza\" means three slices and \"12 nuggets\" means twelve nuggets. Food request: ${trimmedQuery}`,
        [],
        []
      );
      if ("error" in response) {
        return `I couldn't estimate that: ${response.error}`;
      }
      if (!response.ingredients.length) {
        return "I need a little more detail—try the food or restaurant item.";
      }
      setPlannedMeal(response);
      return plannedMeal
        ? "I updated the estimate using your latest change."
        : "I estimated that plan using the amount you described.";
    } catch {
      return "I couldn't estimate that just now. Please try again.";
    } finally {
      planningRequestInFlight.current = false;
    }
  };

  const logPlannedMeal = () => {
    if (!plannedMeal) return;

    const mealToLog = {
      ...plannedMeal,
      mealId: Crypto.randomUUID(),
      isAdded: true,
    };
    dispatch(recordMeal(mealToLog));
    dispatch(logMeal(mealToLog.mealId));
    setPlannedMeal(undefined);
    Alert.alert("Logged", "Added to today's food log.");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <ThemedText style={styles.intro}>
          See how a food fits before you log it. The estimate is a planning aid,
          not a rule.
        </ThemedText>

        <View style={styles.budgetCard}>
          <BudgetValue label="Calories left" value={remaining.calories} unit="kcal" />
          <BudgetValue label="Protein left" value={remaining.protein} unit="g" />
          <BudgetValue label="Net carbs left" value={remaining.net_carbohydrates} unit="g" />
        </View>
      </View>
      <Chat
        onSubmit={estimateFood}
        placeholder="Ask about pizza, a burrito bowl..."
        renderBelowMessages={() =>
          plannedMeal && servingMacros && remainingAfterPlan ? (
          <View style={styles.resultCard}>
            <ThemedText type="subtitle">{plannedMeal.summary}</ThemedText>
            <ThemedText style={styles.assumption}>
              Estimated from the exact amount you described. Say a change out loud
              to revise it.
            </ThemedText>

            <ThemedText style={styles.fitMessage}>
              {getFitMessage(remaining.calories, servingMacros.calories)}
            </ThemedText>
            <View style={styles.macroGrid}>
              <MacroValue label="Calories" value={servingMacros.calories} />
              <MacroValue label="Protein" value={servingMacros.protein} suffix="g" />
              <MacroValue label="Carbs" value={servingMacros.carbohydrate} suffix="g" />
              <MacroValue label="Fat" value={servingMacros.fat} suffix="g" />
            </View>

            <ThemedText type="defaultSemiBold" style={styles.afterTitle}>
              After this plan
            </ThemedText>
            <ThemedText style={styles.afterText}>
              {formatRemaining(remainingAfterPlan)}
            </ThemedText>
            <ThemedText style={styles.suggestion}>
              {getSuggestion(remainingAfterPlan, servingMacros)}
            </ThemedText>

            <Pressable style={styles.logButton} onPress={logPlannedMeal}>
              <ThemedText colorOverride="black" type="defaultSemiBold">
                Log this plan
              </ThemedText>
            </Pressable>
          </View>
          ) : null
        }
      />
    </View>
  );
}

function BudgetValue({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View>
      <ThemedText style={styles.budgetValue}>{Math.round(value)}{unit}</ThemedText>
      <ThemedText style={styles.budgetLabel}>{label}</ThemedText>
    </View>
  );
}

function MacroValue({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <View style={styles.macroValue}>
      <ThemedText type="defaultSemiBold">{value}{suffix}</ThemedText>
      <ThemedText style={styles.macroLabel}>{label}</ThemedText>
    </View>
  );
}

function getFitMessage(remainingCalories: number, plannedCalories: number) {
  if (remainingCalories <= 0) return "You are already around today's calorie target. You can still choose this—this just makes the trade-off visible.";
  if (plannedCalories <= remainingCalories) return "This fits within your remaining calorie target.";
  return `This is about ${Math.abs(remainingCalories - plannedCalories)} kcal over your remaining calorie target.`;
}

function formatRemaining(remaining: ReturnType<typeof getRemainingMacros>) {
  return `${Math.round(remaining.calories)} kcal left · ${Math.round(remaining.protein)}g protein left · ${Math.round(remaining.net_carbohydrates)}g net carbs left`;
}

function getSuggestion(
  remaining: ReturnType<typeof getRemainingMacros>,
  servingMacros: ReturnType<typeof getSummedMacros>
) {
  if (remaining.protein > 25 && servingMacros.protein < 15) return "For a more balanced day, pair it with something protein-forward later—whatever feels easy, not perfect.";
  if (remaining.calories < 0) return "If you want a lighter alternative, consider a smaller portion now and save the rest for tomorrow.";
  return "This fits reasonably well. You can log it now or adjust the portion first.";
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "black" },
  header: { paddingHorizontal: 16, paddingTop: 12 },
  intro: { color: "#b8b8bd", marginBottom: 12 },
  budgetCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#1c1c1e", borderRadius: 10, padding: 14 },
  budgetValue: { fontSize: 20, fontWeight: "700" },
  budgetLabel: { color: "#a9a9ad", fontSize: 12, marginTop: 2 },
  resultCard: { margin: 12, backgroundColor: "#1c1c1e", borderRadius: 10, padding: 16 },
  assumption: { color: "#a9a9ad", fontSize: 13, marginTop: 5 },
  fitMessage: { color: "#69cedf", marginTop: 16, lineHeight: 20 },
  macroGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#3a3a3c", paddingTop: 12 },
  macroValue: { width: "50%", marginBottom: 10 },
  macroLabel: { color: "#a9a9ad", fontSize: 13 },
  afterTitle: { marginTop: 4 },
  afterText: { color: "#b8b8bd", marginTop: 4 },
  suggestion: { color: "#b8b8bd", marginTop: 16, lineHeight: 20 },
  logButton: { backgroundColor: "#69cedf", borderRadius: 8, alignItems: "center", marginTop: 20, paddingVertical: 13 },
});
