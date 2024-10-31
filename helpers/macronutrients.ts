import { MacroNutrientEnum } from "@/gpt-prompts/meal-parsing";

export const getColorForMacro = (macro: MacroNutrientEnum) => {
  switch (macro) {
    case MacroNutrientEnum.calories:
      return "#FF816E";
    case MacroNutrientEnum.carbs:
      return "#FFCB6E";
    case MacroNutrientEnum.fat:
      return "#FFF86E";
    case MacroNutrientEnum.fiber:
      return "#90FF6E";
    case MacroNutrientEnum.netCarbs:
      return "#6EF8FF";
    case MacroNutrientEnum.protein:
      return "#FF6ED8";
  }
};

export const getPrettyNameForMacro = (macro: MacroNutrientEnum) => {
  switch (macro) {
    case MacroNutrientEnum.calories:
      return "Calories";
    case MacroNutrientEnum.carbs:
      return "Carbs";
    case MacroNutrientEnum.fat:
      return "Fat";
    case MacroNutrientEnum.fiber:
      return "Fiber";
    case MacroNutrientEnum.netCarbs:
      return "Net Carbs";
    case MacroNutrientEnum.protein:
      return "Protein";
  }
};

export const getPrettyUnitsForMacro = (macro: MacroNutrientEnum) => {
  switch (macro) {
    case MacroNutrientEnum.calories:
      return " Cal";
    default:
      return "g";
  }
};
