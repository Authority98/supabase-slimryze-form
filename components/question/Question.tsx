import { QuestionProps } from "@/types";
import classNames from "classnames";
import {
  EmailInput,
  FirstNameInput,
  AgeRangeInput,
  Intro,
  WeightInput,
  WeightGoalsInput,
  WeightHistoryInput,
  MedicationsInput,
  HealthConditionsInput,
  ThyroidCancerInput,
  PregnancyInput,
  ReadinessInput,
  SymptomsInput,
  SuccessScreen,
} from "./index";
import styles from "./Question.module.css";

export function Question({
  inView,
  inViewSlide,
  outView,
  outViewSlide,
  isRendered,
  type,
}: QuestionProps): JSX.Element {
  return (
    <div
      className={classNames(styles["question-box"], {
        [styles["slide-out"]]: outView,
        [styles["slide-in"]]: inView,
        [styles["out-view__up"]]: outViewSlide === "up",
        [styles["out-view__down"]]: outViewSlide === "down",
        [styles["in-view__up"]]: inViewSlide === "up",
        [styles["in-view__down"]]: inViewSlide === "down",
        [styles["rendered"]]: isRendered,
      })}
    >
      {type === "intro" && <Intro />}
      {type === "firstName" && <FirstNameInput />}
      {type === "symptoms" && <SymptomsInput />}
      {type === "email" && <EmailInput />}
      {type === "industry" && <AgeRangeInput />}
      {type === "weight" && <WeightInput />}
      {type === "weightGoals" && <WeightGoalsInput />}
      {type === "weightHistory" && <WeightHistoryInput />}
      {type === "medications" && <MedicationsInput />}
      {type === "conditions" && <HealthConditionsInput />}
      {type === "thyroidCancer" && <ThyroidCancerInput />}
      {type === "pregnancy" && <PregnancyInput />}
      {type === "readiness" && <ReadinessInput />}
      {type === "success" && <SuccessScreen />}
    </div>
  );
}
