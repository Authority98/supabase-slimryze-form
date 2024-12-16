export * from "./contexts";
export * from "./misc";
export * from "./question";

export type QuestionType =
  | "intro"
  | "firstName"
  | "lastName"
  | "symptoms"
  | "email"
  | "industry"
  | "role"
  | "goal"
  | "weight"
  | "weightGoals"
  | "weightHistory"
  | "medications"
  | "conditions"
  | "thyroidCancer"
  | "pregnancy"
  | "readiness"
  | "success";
