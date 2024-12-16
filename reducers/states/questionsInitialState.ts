export const questionsInitialState = {
  firstName: "",
  lastName: "",
  email: "",
  industry: "",
  role: "",
  weight: "",
  weightGoals: "",
  weightHistory: "",
  medications: [] as string[],
  conditions: [] as string[],
  thyroidHistory: "",
  pregnancyStatus: "",
  goals: [] as string[],
  readiness: "",
};

export type QuestionsStateType = {
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
};
