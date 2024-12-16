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
import { SET_WEIGHT_GOALS } from "@/reducers";

export function WeightGoalsInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { weightGoals } = state;
  const errorMsg = error.weightGoals ?? "";

  const goalOptions = {
    A: "Lose 10-20 lbs",
    B: "Lose 20-40 lbs",
    C: "Lose 40-60 lbs",
    D: "Lose 60+ lbs",
  } as const;

  type GoalKey = keyof typeof goalOptions;
  type GoalValue = (typeof goalOptions)[GoalKey];

  function handleOptionClick(selectedOption: GoalValue) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.weightGoals;
        return newValue;
      });

    dispatch({ type: SET_WEIGHT_GOALS, payload: selectedOption });
    setTimeout(() => handleOkClick(), 600);
  }

  return (
    <>
      <QuestionNumHeading questionNum={7}>
        What&apos;s your weight loss goal? 🎯
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us set realistic milestones
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(goalOptions) as GoalKey[]).map((key) => {
            const option = goalOptions[key];
            const isSelected = option === weightGoals;

            return (
              <DropdownSelectOption
                key={key}
                className={styles["role-option"]}
                onClick={() => handleOptionClick(option)}
                isSelected={isSelected}
              >
                <span
                  className={classNames({
                    [styles["selected"]]: isSelected,
                  })}
                >
                  {key}
                </span>
                {option}
              </DropdownSelectOption>
            );
          })}
        </div>
      </DropdownSelect>

      {errorMsg && <Error message={errorMsg} />}
    </>
  );
}
