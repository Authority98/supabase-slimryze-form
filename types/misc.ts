import { ReactElement } from "react";

export type ObjectType = {
  [key: string]: string;
};

export type QuestionNumHeadingProps = {
  children: React.ReactNode;
  questionNum: number;
};

export type QuestionBoxParaProps = {
  children: React.ReactNode;
};

export type DropdownSelectProps = {
  className?: string;
  children: React.ReactNode;
};

export type DropdownSelectOptionProps = {
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

export type ErrorProps = {
  message: string;
};

export type DisqualifierScreenProps = {
  title: string;
  message: string;
  recommendation: string;
  note: string;
};

export type QuestionComponent = ReactElement;
export type ErrorComponent = ReactElement;
export type QuestionNumHeadingComponent = ReactElement;
export type QuestionBoxParaComponent = ReactElement;
export type DropdownSelectComponent = ReactElement;
export type DropdownSelectOptionComponent = ReactElement;
export type DisqualifierScreenComponent = ReactElement;
