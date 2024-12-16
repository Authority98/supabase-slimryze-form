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
import { SET_WEIGHT_HISTORY } from "@/reducers";

export function WeightHistoryInput(): JSX.Element {
  const {
    errorMsg: error,
    setErrorMsg,
    handleQuestionNumUpdate,
  } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { weightHistory, firstName } = state;
  const errorMsg = error.weightHistory ?? "";

  const capitalizedName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : "";

  const weightHistoryOptions = {
    A: "First time trying to lose weight",
    B: "Have tried before with some success",
    C: "Have tried multiple times with mixed results",
    D: "Have tried many times with little success",
  } as const;

  type WeightHistoryKey = keyof typeof weightHistoryOptions;
  type WeightHistoryValue = (typeof weightHistoryOptions)[WeightHistoryKey];

  function handleOptionClick(selectedOption: WeightHistoryValue) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.weightHistory;
        return newValue;
      });

    dispatch({ type: SET_WEIGHT_HISTORY, payload: selectedOption });
    setTimeout(() => handleQuestionNumUpdate(), 600);
  }

  return (
    <>
      <QuestionNumHeading questionNum={2}>
        {capitalizedName}, tell us about your weight loss journey 🌱
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us understand your experience
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(weightHistoryOptions) as WeightHistoryKey[]).map(
            (key) => {
              const option = weightHistoryOptions[key];
              const isSelected = option === weightHistory;

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
            }
          )}
        </div>
      </DropdownSelect>

      {errorMsg && <Error message={errorMsg} />}
    </>
  );
}
