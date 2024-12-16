import {
  Error,
  DropdownSelect,
  DropdownSelectOption,
  QuestionNumHeading,
  QuestionBoxPara,
  DisqualifierScreen,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import { useSharedStates } from "@/contexts";
import { useQuestions } from "@/contexts";
import { SET_THYROID_HISTORY } from "@/reducers";
import { useState } from "react";

export function ThyroidCancerInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { thyroidHistory } = state;
  const errorMsg = error.thyroidHistory ?? "";
  const [showDisqualifier, setShowDisqualifier] = useState(false);

  const options = {
    A: "Yes",
    B: "No",
  } as const;

  type OptionKey = keyof typeof options;

  function handleOptionClick(selectedOption: string) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.thyroidHistory;
        return newValue;
      });

    // Handle disqualifying answer
    if (selectedOption === options.A) {
      setShowDisqualifier(true);
      return;
    }

    dispatch({ type: SET_THYROID_HISTORY, payload: selectedOption });
    setTimeout(() => handleOkClick(), 600);
  }

  if (showDisqualifier) {
    return (
      <DisqualifierScreen
        title="Important Health Information"
        message="We notice you have a family history of thyroid cancer. For your safety, we need to take extra precautions."
        recommendation="We recommend consulting with your healthcare provider before starting any weight loss medication, as your family history may require special consideration."
        note="Your health and safety are our top priority!"
      />
    );
  }

  return (
    <>
      <QuestionNumHeading questionNum={10}>
        Do you have a family history of thyroid cancer? 🧬
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us assess potential health risks
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(options) as OptionKey[]).map((key) => {
            const option = options[key];
            const isSelected = option === thyroidHistory;

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
