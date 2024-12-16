export const SET_NAME = "SET_NAME";
export const SET_EMAIL = "SET_EMAIL";
export const SET_INDUSTRY = "SET_INDUSTRY";
export const SET_WEIGHT = "SET_WEIGHT";
export const SET_WEIGHT_GOALS = "SET_WEIGHT_GOALS";
export const SET_WEIGHT_HISTORY = "SET_WEIGHT_HISTORY";
export const SET_MEDICATIONS = "SET_MEDICATIONS";
export const REMOVE_MEDICATION = "REMOVE_MEDICATION";
export const SET_CONDITIONS = "SET_CONDITIONS";
export const REMOVE_CONDITION = "REMOVE_CONDITION";
export const SET_THYROID_HISTORY = "SET_THYROID_HISTORY";
export const SET_PREGNANCY_STATUS = "SET_PREGNANCY_STATUS";
export const SET_GOALS = "SET_GOALS";
export const REMOVE_GOAL = "REMOVE_GOAL";
export const SET_READINESS = "SET_READINESS";

export interface QuestionsState {
  name: string;
  email: string;
  industry: string;
  weight: string;
  weightGoals: string;
  weightHistory: string;
  medications: string[];
  conditions: string[];
  thyroidHistory: string;
  pregnancyStatus: string;
  goals: string[];
  readiness: string;
}

export const initialState: QuestionsState = {
  name: "",
  email: "",
  industry: "",
  weight: "",
  weightGoals: "",
  weightHistory: "",
  medications: [],
  conditions: [],
  thyroidHistory: "",
  pregnancyStatus: "",
  goals: [],
  readiness: "",
};

export type QuestionsAction =
  | { type: typeof SET_NAME; payload: string }
  | { type: typeof SET_EMAIL; payload: string }
  | { type: typeof SET_INDUSTRY; payload: string }
  | { type: typeof SET_WEIGHT; payload: string }
  | { type: typeof SET_WEIGHT_GOALS; payload: string }
  | { type: typeof SET_WEIGHT_HISTORY; payload: string }
  | { type: typeof SET_MEDICATIONS; payload: string }
  | { type: typeof REMOVE_MEDICATION; payload: string }
  | { type: typeof SET_CONDITIONS; payload: string }
  | { type: typeof REMOVE_CONDITION; payload: string }
  | { type: typeof SET_THYROID_HISTORY; payload: string }
  | { type: typeof SET_PREGNANCY_STATUS; payload: string }
  | { type: typeof SET_GOALS; payload: string }
  | { type: typeof REMOVE_GOAL; payload: string }
  | { type: typeof SET_READINESS; payload: string };

export function questionsReducer(
  state: QuestionsState,
  action: QuestionsAction
): QuestionsState {
  switch (action.type) {
    case SET_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SET_INDUSTRY:
      return {
        ...state,
        industry: action.payload,
      };
    case SET_WEIGHT:
      return {
        ...state,
        weight: action.payload,
      };
    case SET_WEIGHT_GOALS:
      return {
        ...state,
        weightGoals: action.payload,
      };
    case SET_WEIGHT_HISTORY:
      return {
        ...state,
        weightHistory: action.payload,
      };
    case SET_MEDICATIONS:
      return {
        ...state,
        medications: [...state.medications, action.payload],
      };
    case REMOVE_MEDICATION:
      return {
        ...state,
        medications: state.medications.filter((med) => med !== action.payload),
      };
    case SET_CONDITIONS:
      return {
        ...state,
        conditions: [...state.conditions, action.payload],
      };
    case REMOVE_CONDITION:
      return {
        ...state,
        conditions: state.conditions.filter(
          (condition) => condition !== action.payload
        ),
      };
    case SET_THYROID_HISTORY:
      return {
        ...state,
        thyroidHistory: action.payload,
      };
    case SET_PREGNANCY_STATUS:
      return {
        ...state,
        pregnancyStatus: action.payload,
      };
    case SET_GOALS:
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };
    case REMOVE_GOAL:
      return {
        ...state,
        goals: state.goals.filter((goal) => goal !== action.payload),
      };
    case SET_READINESS:
      return {
        ...state,
        readiness: action.payload,
      };
    default:
      return state;
  }
}
