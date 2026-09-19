import { DisplayedMacros } from "@/types/openAi.types";

export type PlanningMode = "quick" | "balanced" | "deep";
/** A format is the broad first decision; an option is a generic order idea. */
export type RecommendationLevel = "format" | "option";

export type WizardQuestionCategory =
  | "hunger"
  | "effort"
  | "craving"
  | "avoid"
  | "novelty";

export type WizardOption = {
  id: string;
  label: string;
  requiresCommentary?: boolean;
};

export type WizardQuestion = {
  category: WizardQuestionCategory;
  prompt: string;
  options: WizardOption[];
};

export type WizardQuestionGuardrail = {
  /** What this question is meant to learn; sent to the planner with every turn. */
  purpose: string;
  minOptions: number;
  maxOptions: number;
};

export type SuggestedMeal = {
  id: string;
  title: string;
  description: string;
  rationale: string;
  planningInput: string;
  estimatedMacros: DisplayedMacros;
};

export type WizardResponse =
  | { action: "question"; message: string; question: WizardQuestion }
  | {
      action: "recommendations";
      message: string;
      recommendations: SuggestedMeal[];
    };

/**
 * Product guardrails live here rather than in the prompt. Tune these during
 * beta without changing the session flow or API contract.
 */
export const PLANNING_WIZARD_CONFIG = {
  modes: {
    quick: { label: "Quick pick", questionBudget: 3 },
    balanced: { label: "Balanced pick", questionBudget: 5 },
    deep: { label: "Help me decide", questionBudget: 8 },
  } satisfies Record<PlanningMode, { label: string; questionBudget: number }>,
  maxRecommendations: 3,
  allowSuggestionsAnytime: true,
  /**
   * The first recommendation round chooses only a food format. Add or remove
   * formats here as beta feedback makes the vocabulary clearer.
   */
  mealFormats: [
    "Bowl",
    "Sandwich",
    "Stew",
    "Salad",
    "Wrap",
    "Tacos",
    "Pizza",
    "Burger",
    "Noodles",
    "Soup",
  ],
  /**
   * The model can choose the order and copy, but only from these question
   * types and option-count limits. This is the main beta-tuning surface.
   */
  questionGuardrails: {
    hunger: {
      purpose: "Understand whether the user wants a lighter bite or a substantial meal.",
      minOptions: 2,
      maxOptions: 5,
    },
    effort: {
      purpose: "Learn the user's appetite for cooking and cleanup tonight.",
      minOptions: 2,
      maxOptions: 5,
    },
    craving: {
      purpose: "Identify the flavor or texture direction that sounds appealing.",
      minOptions: 2,
      maxOptions: 5,
    },
    avoid: {
      purpose: "Learn what sounds unappealing right now without treating it as a dietary restriction.",
      minOptions: 2,
      maxOptions: 5,
    },
    novelty: {
      purpose: "Learn whether the user wants familiar comfort or something new.",
      minOptions: 2,
      maxOptions: 5,
    },
  } satisfies Record<WizardQuestionCategory, WizardQuestionGuardrail>,
  allowedQuestionCategories: ["hunger", "effort", "craving", "avoid", "novelty"] satisfies WizardQuestionCategory[],
};

export type WizardAnswer = {
  /** "adjustment" captures feedback after recommendations, e.g. "no salads". */
  category: WizardQuestionCategory | "mode" | "adjustment";
  answer: string;
};
