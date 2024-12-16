import {
  Error,
  DropdownSelect,
  DropdownSelectOption,
  QuestionNumHeading,
  QuestionBoxPara,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import { useSharedStates } from "@/contexts";
import { useQuestions } from "@/contexts";
import { SET_INDUSTRY } from "@/reducers";
import type { ReactNode } from "react";

export function IndustryInput(): ReactNode {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { industry } = state;
  const errorMsg = error.industry ?? "";

  const ageRanges = {
    A: "Under 18",
    B: "18-29",
    C: "30-39",
    D: "40-49",
    E: "50-59",
    F: "60+",
  } as const;

  type AgeRangeKey = keyof typeof ageRanges;

  function handleOptionClick(selectedAge: string) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        delete prevValue.industry;
        return prevValue;
      });

    dispatch({ type: SET_INDUSTRY, payload: selectedAge });
    setTimeout(() => handleOkClick(), 600);
  }

  return (
    <>
      <QuestionNumHeading questionNum={3}>
        What&apos;s Your Age Range?
      </QuestionNumHeading>
      <QuestionBoxPara>What&apos;s Your Age Range?</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        (We need this to personalize your journey!)
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(ageRanges) as AgeRangeKey[]).map((key) => {
            const ageRange = ageRanges[key];
            const isSelected = ageRange === industry;

            return (
              <DropdownSelectOption
                key={key}
                className={styles["role-option"]}
                onClick={() => handleOptionClick(ageRange)}
                isSelected={isSelected}
              >
                <span
                  className={classNames({
                    [styles["selected"]]: isSelected,
                  })}
                >
                  {key}
                </span>
                {ageRange}
              </DropdownSelectOption>
            );
          })}
        </div>
      </DropdownSelect>

      {errorMsg && <Error message={errorMsg} />}
    </>
  );
}
