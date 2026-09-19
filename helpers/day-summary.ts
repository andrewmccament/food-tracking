import { DisplayedMacros } from "@/types/openAi.types";

export type DailySummary = {
  date: string;
  content: string;
  inputSignature: string;
  generatedAt: number;
};

export const DAY_SUMMARY_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function createDaySummarySignature(
  date: string,
  goals: DisplayedMacros,
  consumed: DisplayedMacros
) {
  return JSON.stringify({ date, goals, consumed });
}

export function shouldRefreshDaySummary(
  summary: DailySummary | null | undefined,
  date: string,
  inputSignature: string,
  now = Date.now()
) {
  return (
    !summary ||
    summary.date !== date ||
    summary.inputSignature !== inputSignature ||
    now - summary.generatedAt >= DAY_SUMMARY_MAX_AGE_MS
  );
}
