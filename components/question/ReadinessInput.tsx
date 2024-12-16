import { useQuestions, useSharedStates } from "@/contexts";
import classNames from "classnames";
import {
  Error,
  QuestionNumHeading,
  QuestionBoxPara,
  DropdownSelect,
  DropdownSelectOption,
} from "../index";
import styles from "./Question.module.css";
import { SET_READINESS } from "@/reducers";

export function ReadinessInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { readiness } = state;
  const errorMsg = error.readiness ?? "";

  const readinessOptions = {
    A: "Ready to go NOW! 🚀",
    B: "Within the next month",
    C: "Still researching, but interested!",
  } as const;

  type ReadinessKey = keyof typeof readinessOptions;
  type ReadinessValue = (typeof readinessOptions)[ReadinessKey];

  function handleOptionClick(selectedOption: ReadinessValue) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.readiness;
        return newValue;
      });

    dispatch({ type: SET_READINESS, payload: selectedOption });

    // Add a small delay before proceeding to success screen
    if (handleOkClick) {
      setTimeout(() => handleOkClick(), 600);
    }
  }

  return (
    <>
      <QuestionNumHeading questionNum={12}>
        When would you like to start your journey? 🚀
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us prepare your personalized program
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(readinessOptions) as ReadinessKey[]).map((key) => {
            const option = readinessOptions[key];
            const isSelected = option === readiness;

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
