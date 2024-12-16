import {
  QuestionsActionsType,
  QuestionsStateType,
  REMOVE_GOAL,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_INDUSTRY,
  SET_ROLE,
  SET_GOALS,
  SET_EMAIL,
  SET_WEIGHT_HISTORY,
  SET_WEIGHT,
  SET_WEIGHT_GOALS,
  SET_MEDICATIONS,
  REMOVE_MEDICATION,
  SET_CONDITIONS,
  REMOVE_CONDITION,
  SET_THYROID_HISTORY,
  SET_PREGNANCY_STATUS,
  SET_READINESS,
} from "../index";

export function questionsReducerFunc(
  state: QuestionsStateType,
  action: QuestionsActionsType
) {
  switch (action.type) {
    case SET_FIRST_NAME:
      return { ...state, firstName: action.payload };

    case SET_LAST_NAME:
      return { ...state, lastName: action.payload };

    case SET_INDUSTRY:
      return { ...state, industry: action.payload };

    case SET_ROLE:
      return { ...state, role: action.payload };

    case SET_GOALS:
      return { ...state, goals: [...state.goals, action.payload] };

    case REMOVE_GOAL:
      return {
        ...state,
        goals: state.goals.filter((goal) => goal !== action.payload),
      };

    case SET_EMAIL:
      return { ...state, email: action.payload };

    case SET_WEIGHT_HISTORY:
      return { ...state, weightHistory: action.payload };

    case SET_WEIGHT:
      return { ...state, weight: action.payload };

    case SET_WEIGHT_GOALS:
      return { ...state, weightGoals: action.payload };

    case SET_MEDICATIONS:
      return { ...state, medications: [...state.medications, action.payload] };

    case REMOVE_MEDICATION:
      return {
        ...state,
        medications: state.medications.filter((med) => med !== action.payload),
      };

    case SET_CONDITIONS:
      return { ...state, conditions: [...state.conditions, action.payload] };

    case REMOVE_CONDITION:
      return {
        ...state,
        conditions: state.conditions.filter(
          (condition) => condition !== action.payload
        ),
      };

    case SET_THYROID_HISTORY:
      return { ...state, thyroidHistory: action.payload };

    case SET_PREGNANCY_STATUS:
      return { ...state, pregnancyStatus: action.payload };

    case SET_READINESS:
      return { ...state, readiness: action.payload };

    default:
      return state;
  }
}
