export const SET_FIRST_NAME = "SET_FIRST_NAME";
export const SET_LAST_NAME = "SET_LAST_NAME";
export const SET_INDUSTRY = "SET_INDUSTRY";
export const SET_ROLE = "SET_ROLE";
export const SET_GOALS = "SET_GOALS";
export const REMOVE_GOAL = "REMOVE_GOAL";
export const SET_EMAIL = "SET_EMAIL";
export const SET_WEIGHT_HISTORY = "SET_WEIGHT_HISTORY";
export const SET_WEIGHT = "SET_WEIGHT";
export const SET_WEIGHT_GOALS = "SET_WEIGHT_GOALS";
export const SET_MEDICATIONS = "SET_MEDICATIONS";
export const REMOVE_MEDICATION = "REMOVE_MEDICATION";
export const SET_CONDITIONS = "SET_CONDITIONS";
export const REMOVE_CONDITION = "REMOVE_CONDITION";
export const SET_THYROID_HISTORY = "SET_THYROID_HISTORY";
export const SET_PREGNANCY_STATUS = "SET_PREGNANCY_STATUS";
export const SET_READINESS = "SET_READINESS";

export type QuestionsActionsType =
  | { type: typeof SET_FIRST_NAME; payload: string }
  | { type: typeof SET_LAST_NAME; payload: string }
  | { type: typeof SET_INDUSTRY; payload: string }
  | { type: typeof SET_ROLE; payload: string }
  | { type: typeof SET_GOALS; payload: string }
  | { type: typeof REMOVE_GOAL; payload: string }
  | { type: typeof SET_EMAIL; payload: string }
  | { type: typeof SET_WEIGHT_HISTORY; payload: string }
  | { type: typeof SET_WEIGHT; payload: string }
  | { type: typeof SET_WEIGHT_GOALS; payload: string }
  | { type: typeof SET_MEDICATIONS; payload: string }
  | { type: typeof REMOVE_MEDICATION; payload: string }
  | { type: typeof SET_CONDITIONS; payload: string }
  | { type: typeof REMOVE_CONDITION; payload: string }
  | { type: typeof SET_THYROID_HISTORY; payload: string }
  | { type: typeof SET_PREGNANCY_STATUS; payload: string }
  | { type: typeof SET_READINESS; payload: string };
