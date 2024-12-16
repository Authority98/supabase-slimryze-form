import { Dispatch, SetStateAction } from "react";
import { QuestionType } from "./index";

export type QuestionProps = {
  readonly inView: boolean;
  readonly inViewSlide: "up" | "down" | "";
  readonly outView: boolean;
  readonly outViewSlide: "up" | "down" | "";
  readonly isRendered?: boolean;
  readonly type: QuestionType;
};

export type IndustriesProps = {
  readonly showIndustriesList: boolean;
  readonly setShowIndustriesList: Dispatch<SetStateAction<boolean>>;
};
