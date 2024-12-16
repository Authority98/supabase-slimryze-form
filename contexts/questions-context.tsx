import { TOTAL_QUESTIONS } from "@/constants";
import { questionsInitialState, questionsReducerFunc } from "@/reducers";
import { QuestionsContextType } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";

interface QuestionsState {
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  role: string;
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

const QuestionsContext = createContext<QuestionsContextType>({
  state: questionsInitialState as QuestionsState,
  dispatch: () => undefined,
  percent: 0,
});

type QuestionsProviderType = {
  readonly children: ReactNode;
};

export function QuestionsProvider({ children }: QuestionsProviderType) {
  const [state, dispatch] = useReducer(
    questionsReducerFunc,
    questionsInitialState
  );

  const percent = useMemo(
    function () {
      let answeredQues = 0;
      const {
        firstName,
        email,
        industry,
        role,
        weight,
        weightGoals,
        weightHistory,
        medications,
        conditions,
        thyroidHistory,
        pregnancyStatus,
        readiness,
      } = state as QuestionsState;

      // Count intro as answered by default since it's just informational
      answeredQues += 1;

      if (firstName) answeredQues += 1;
      if (role) answeredQues += 1; // symptoms
      if (weightHistory) answeredQues += 1;
      if (email) answeredQues += 1;
      if (industry) answeredQues += 1;
      if (weight) answeredQues += 1;
      if (weightGoals) answeredQues += 1;
      if (medications.length > 0) answeredQues += 1;
      if (conditions.length > 0) answeredQues += 1;
      if (thyroidHistory) answeredQues += 1;
      if (pregnancyStatus) answeredQues += 1;
      if (readiness) answeredQues += 1;
      // Count success screen as answered when we reach it
      if (readiness) answeredQues += 1;

      return Math.min((answeredQues * 100) / TOTAL_QUESTIONS, 100);
    },
    [state]
  );

  const value = { state: state as QuestionsState, dispatch, percent };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions(): QuestionsContextType {
  const context = useContext(QuestionsContext);

  if (context) {
    return context;
  }

  throw new Error("useQuestions must be use inside QuestionsProvider");
}
