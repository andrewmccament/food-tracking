import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";

import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { getSummedMacros, sortMealsByCategory } from "@/helpers/food-utils";
import {
  DAY_SUMMARY_MAX_AGE_MS,
  createDaySummarySignature,
  shouldRefreshDaySummary,
} from "@/helpers/day-summary";
import MealSummary from "@/components/Shared/MealSummary";
import { ProgressBar } from "@/components/Shared/ProgressBar";
import { ThemedText } from "@/components/ThemedText";
import { Meal } from "@/types/openAi.types";
import {
  defaultFocusedMetrics,
  setDailySummary,
} from "@/state/userDataSlice";
import { summarizeDay } from "@/services/open-ai";
import AddSVG from "../../svg/log.svg";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "react-native-gradients";

export default function TodayScreen() {
  const dispatch = useDispatch();
  const date = new Date();
  const todayDate = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`;
  const allMeals = useSelector((state: RootState) => state.food.meals);
  const meals = React.useMemo(
    () =>
      sortMealsByCategory(
        allMeals.filter(
          (meal) => meal?.isAdded && meal?.date === todayDate && !meal?.recipe
        )
      ),
    [allMeals, todayDate]
  );
  const todayMacros = React.useMemo(() => getSummedMacros(meals), [meals]);
  const goals = useSelector((state: RootState) => state.userData.goals);
  const focusedMetrics = useSelector(
    (state: RootState) => state.userData.focusedMetrics ?? defaultFocusedMetrics
  );
  const dailySummary = useSelector(
    (state: RootState) => state.userData.dailySummary ?? null
  );
  const summarySignature = createDaySummarySignature(
    todayDate,
    goals,
    todayMacros
  );
  const shouldRefreshSummary = shouldRefreshDaySummary(
    dailySummary,
    todayDate,
    summarySignature
  );
  const requestInFlightFor = React.useRef<string | undefined>(undefined);
  const latestSummarySignature = React.useRef(summarySignature);
  latestSummarySignature.current = summarySignature;
  const [, setSummaryRefreshTick] = React.useState(0);
  const [isSummarizing, setIsSummarizing] = React.useState(false);

  React.useEffect(() => {
    if (
      !shouldRefreshSummary ||
      requestInFlightFor.current === summarySignature
    ) {
      return;
    }

    requestInFlightFor.current = summarySignature;
    setIsSummarizing(true);

    void summarizeDay({
      currentTime: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      goals,
      consumed: todayMacros,
    })
      .then((content) => {
        if (!content) return;
        if (latestSummarySignature.current !== summarySignature) {
          console.info("[day-summary] response superseded by newer day data", {
            responseSignature: summarySignature,
            currentSignature: latestSummarySignature.current,
          });
          return;
        }
        console.info("[day-summary] applying summary to today view", {
          summaryLength: content.length,
        });
        dispatch(
          setDailySummary({
            date: todayDate,
            content,
            inputSignature: summarySignature,
            generatedAt: Date.now(),
          })
        );
      })
      .finally(() => {
        if (requestInFlightFor.current === summarySignature) {
          requestInFlightFor.current = undefined;
          setIsSummarizing(false);
        }
      });
  }, [dispatch, goals, shouldRefreshSummary, summarySignature, todayDate, todayMacros]);

  React.useEffect(() => {
    if (
      !dailySummary ||
      dailySummary.date !== todayDate ||
      dailySummary.inputSignature !== summarySignature
    ) {
      return;
    }

    const remainingMs = Math.max(
      DAY_SUMMARY_MAX_AGE_MS - (Date.now() - dailySummary.generatedAt),
      0
    );
    const timer = setTimeout(() => setSummaryRefreshTick(Date.now()), remainingMs);
    return () => clearTimeout(timer);
  }, [dailySummary, summarySignature, todayDate]);

  const isCurrentSummary =
    dailySummary?.date === todayDate &&
    dailySummary.inputSignature === summarySignature;

  return (
    <View style={styles.todayContainer}>
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: 1,
        }}
        pointerEvents="none"
      >
        <LinearGradient
          angle={270}
          colorList={[
            { offset: "0%", color: "#000000", opacity: "0" },
            { offset: "80%", color: "#000000", opacity: "0" },
            { offset: "95%", color: "#000000", opacity: "1" },
          ]}
        />
      </View>
      <View>
        <View style={styles.macros}>
          {focusedMetrics.map((macro) => (
            <ProgressBar
              key={macro}
              textColor="white"
              macro={macro}
              amount={todayMacros[macro]}
            />
          ))}
        </View>
      </View>
      <View style={styles.dailySummary}>
        <ThemedText type="defaultSemiBold" style={styles.dailySummaryTitle}>
          Today’s take
        </ThemedText>
        <ThemedText style={styles.dailySummaryText}>
          {isCurrentSummary
            ? dailySummary.content
            : isSummarizing
              ? "Updating your day’s take…"
              : "Your day’s take will appear here shortly."}
        </ThemedText>
      </View>
      <ScrollView>
        <View style={{ ...styles.mealsListContainer }}>
          {meals.map((meal: Meal, index) => (
            <View key={index}>
              <MealSummary mealId={meal.mealId} key={index} />
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.logButton}>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/(log)/log", params: { logMode: "meal" } })
          }
          style={{ zIndex: 1000 }}
        >
          <AddSVG
            width={80}
            height={80}
            color={Colors.themeColor}
            style={{ zIndex: 1000 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todayContainer: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "black",
    gap: 12,
    paddingBottom: 12,
  },
  mealsListContainer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: "100%",
  },
  logButtonContainer: {},
  todayList: {
    marginHorizontal: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
  },
  macros: {
    paddingHorizontal: 12,
  },
  dailySummary: {
    marginHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#1c1c1e",
    padding: 12,
  },
  dailySummaryTitle: {
    color: "#69cedf",
    marginBottom: 4,
  },
  dailySummaryText: {
    color: "#e6e6e8",
    lineHeight: 20,
  },
  logButton: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },

  logButtonGrad: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    zIndex: 1000,
  },
});
