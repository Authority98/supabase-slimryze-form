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
import { SET_READINESS } from "@/reducers";
import { useState } from "react";

export function ReadinessInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { readiness } = state;
  const errorMsg = error.readiness ?? "";
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
        delete newValue.readiness;
        return newValue;
      });

    // Handle disqualifying answer
    if (selectedOption === options.A) {
      setShowDisqualifier(true);
      return;
    }

    dispatch({ type: SET_READINESS, payload: selectedOption });
    setTimeout(() => handleOkClick(), 600);
  }

  if (showDisqualifier) {
    return (
      <DisqualifierScreen
        title="Important Health Information"
        message="Thank you for taking the assessment. Based on your responses, we noticed that you are currently pregnant, breastfeeding, or planning to become pregnant. For your safety and your baby's safety, we're unable to recommend this medication at this time."
        recommendation="We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you and your baby."
        note="Your health and well-being are our top priority!"
      />
    );
  }

  return (
    <>
      <QuestionNumHeading questionNum={12}>
        Are you currently pregnant, breastfeeding or planning to become pregnant
        within the next 6 months? 👶
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us ensure our program is safe for you
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(options) as OptionKey[]).map((key) => {
            const option = options[key];
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
