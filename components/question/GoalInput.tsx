import { useQuestions, useSharedStates } from "@/contexts";
import classNames from "classnames";
import {
  Error,
  QuestionNumHeading,
  DropdownSelect,
  DropdownSelectOption,
} from "../index";
import styles from "./Question.module.css";
import { SET_GOALS, REMOVE_GOAL } from "@/reducers";
import type { JSX } from "react";

export function GoalInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { goals } = state;
  const errorMsg = error.goals ?? "";

  const goalOptions = {
    A: "Better energy & mood",
    B: "Control appetite & cravings",
    C: "Improve overall health",
    D: "All of the above!",
  } as const;

  type GoalKey = keyof typeof goalOptions;
  type GoalValue = (typeof goalOptions)[GoalKey];

  function handleOptionClick(selectedGoal: GoalValue) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.goals;
        return newValue;
      });

    // If "All of the above!" is selected, clear other selections
    if (selectedGoal === "All of the above!") {
      dispatch({ type: SET_GOALS, payload: selectedGoal });
      setTimeout(() => handleOkClick && handleOkClick(), 600);
      return;
    }

    // Handle other goal selections
    if (goals.includes(selectedGoal)) {
      // Remove the selected goal
      dispatch({ type: REMOVE_GOAL, payload: selectedGoal });
    } else {
      // Remove "All of the above!" if it was selected
      if (goals.includes("All of the above!")) {
        dispatch({ type: REMOVE_GOAL, payload: "All of the above!" });
      }
      // Add the selected goal
      dispatch({ type: SET_GOALS, payload: selectedGoal });
    }

    // Proceed to next question if any goal is selected
    if (goals.length > 0 || selectedGoal) {
      setTimeout(() => handleOkClick && handleOkClick(), 600);
    }
  }

  return (
    <>
      <QuestionNumHeading questionNum={10}>
        What&apos;s Your Overall Health Goal? 🎯
      </QuestionNumHeading>
      <span className={styles["choose-num"]}>
        Focus on what feels right for you 💪
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(goalOptions) as GoalKey[]).map((key) => {
            const goal = goalOptions[key];
            const isSelected = goals.includes(goal);

            return (
              <DropdownSelectOption
                key={key}
                className={styles["role-option"]}
                onClick={() => handleOptionClick(goal)}
                isSelected={isSelected}
              >
                <span
                  className={classNames({
                    [styles["selected"]]: isSelected,
                  })}
                >
                  {key}
                </span>
                {goal}
              </DropdownSelectOption>
            );
          })}
        </div>
      </DropdownSelect>

      {errorMsg && <Error message={errorMsg} />}
    </>
  );
}
