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
import { SET_PREGNANCY_STATUS } from "@/reducers";
import { useState } from "react";
import type { ObjectType } from "@/types";

export function PregnancyInput(): JSX.Element {
  const { errorMsg, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { pregnancyStatus } = state;
  const error = (errorMsg as ObjectType).pregnancyStatus ?? "";
  const [showDisqualifier, setShowDisqualifier] = useState(false);

  const options = {
    A: "Yes",
    B: "No",
  } as const;

  type OptionKey = keyof typeof options;

  function handleOptionClick(selectedOption: string) {
    setErrorMsg &&
      setErrorMsg((prevValue: ObjectType) => {
        const newValue = { ...prevValue };
        delete newValue.pregnancyStatus;
        return newValue;
      });

    // Handle disqualifying answer
    if (selectedOption === options.A) {
      setShowDisqualifier(true);
      return;
    }

    dispatch({ type: SET_PREGNANCY_STATUS, payload: selectedOption });
    setTimeout(() => handleOkClick(), 600);
  }

  if (showDisqualifier) {
    return (
      <DisqualifierScreen
        title="Important Health Information"
        message="Thank you for taking the assessment. Based on your responses, we noticed that you have been diagnosed with kidney disease. For your safety, we're unable to recommend this medication, as managing kidney disease requires specialized care and consideration."
        recommendation="We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you."
        note="Your health and well-being are our top priority!"
      />
    );
  }

  return (
    <>
      <QuestionNumHeading questionNum={11}>
        Have you been diagnosed with kidney disease? 🏥
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us ensure our program is safe for you
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(options) as OptionKey[]).map((key) => {
            const option = options[key];
            const isSelected = option === pregnancyStatus;

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

      {error && <Error message={error} />}
    </>
  );
}
