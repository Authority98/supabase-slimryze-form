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
  const { errorMsg, setErrorMsg, handleQuestionNumUpdate } = useSharedStates();
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
    setTimeout(() => handleQuestionNumUpdate(), 600);
  }

  if (showDisqualifier) {
    return (
      <DisqualifierScreen
        title="Important Health Information"
        message="We notice you're currently pregnant or breastfeeding. For your safety and your baby's safety, we need to take extra precautions."
        recommendation="We recommend waiting until after pregnancy and breastfeeding to start any weight loss medication. Please consult with your healthcare provider for safe weight management options during this time."
        note="Your health and your baby's health are our top priority! 👶"
      />
    );
  }

  return (
    <>
      <QuestionNumHeading questionNum={11}>
        Are you pregnant or planning to become pregnant? 👶
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
