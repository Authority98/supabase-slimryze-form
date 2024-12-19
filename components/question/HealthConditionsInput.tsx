import {
  Error,
  DropdownSelect,
  DropdownSelectOption,
  QuestionNumHeading,
  QuestionBoxPara,
  DisqualifierScreen,
  QuestionInputText,
  BtnContainer,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import { useSharedStates } from "@/contexts";
import { useQuestions } from "@/contexts";
import { useState, ChangeEventHandler } from "react";
import Image from "next/image";

// Define action types since they're missing from reducers
const SET_CONDITIONS = "SET_CONDITIONS";
const REMOVE_CONDITION = "REMOVE_CONDITION";

type ConditionType =
  | "Type 1 Diabetes"
  | "Type 2 Diabetes"
  | "High blood pressure"
  | "High cholesterol"
  | "Sleep apnea"
  | "None of the above"
  | "Other";

// HealthConditionsInput Component
export function HealthConditionsInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const errorMsg = error.conditions ?? "";
  const [showDisqualifier, setShowDisqualifier] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherCondition, setOtherCondition] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const healthConditions = {
    A: "Type 1 Diabetes",
    B: "Type 2 Diabetes",
    C: "High blood pressure",
    D: "High cholesterol",
    E: "Sleep apnea",
    F: "None of the above",
    G: "Other",
  } as const;

  type HealthConditionKey = keyof typeof healthConditions;

  function handleOptionClick(selectedOption: ConditionType) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.conditions;
        return newValue;
      });

    if (selectedOption === "None of the above") {
      setSelectedConditions([selectedOption]);
      dispatch({ type: SET_CONDITIONS, payload: selectedOption });
      setTimeout(() => handleOkClick(), 600);
      return;
    }

    if (selectedOption === "Other") {
      setShowOtherInput(!showOtherInput);
      if (!showOtherInput) {
        const newConditions = [...selectedConditions, selectedOption];
        setSelectedConditions(newConditions);
        dispatch({ type: SET_CONDITIONS, payload: newConditions.join(", ") });
      } else {
        const newConditions = selectedConditions.filter(
          (c) => c !== selectedOption && c !== otherCondition
        );
        setSelectedConditions(newConditions);
        dispatch({ type: SET_CONDITIONS, payload: newConditions.join(", ") });
        setOtherCondition("");
      }
      return;
    }

    if (selectedConditions.includes("None of the above")) {
      const newConditions = selectedConditions.filter(
        (c) => c !== "None of the above"
      );
      setSelectedConditions(newConditions);
      dispatch({ type: REMOVE_CONDITION, payload: "None of the above" });
    }

    if (selectedConditions.includes("Other")) {
      const newConditions = selectedConditions.filter((c) => c !== "Other");
      setSelectedConditions(newConditions);
      dispatch({ type: REMOVE_CONDITION, payload: "Other" });
    }

    const isAlreadySelected = selectedConditions.includes(selectedOption);
    if (isAlreadySelected) {
      const newConditions = selectedConditions.filter(
        (c) => c !== selectedOption
      );
      setSelectedConditions(newConditions);
      dispatch({ type: REMOVE_CONDITION, payload: selectedOption });
    } else {
      const newConditions = [...selectedConditions, selectedOption];
      setSelectedConditions(newConditions);
      dispatch({ type: SET_CONDITIONS, payload: selectedOption });
    }

    // Only disqualify for Type 1 Diabetes
    if (selectedOption === "Type 1 Diabetes" && !isAlreadySelected) {
      setShowDisqualifier(true);
      return;
    }

    // Remove auto-proceed logic to allow multiple selections
    // if (!isAlreadySelected && selectedConditions.length >= 0) {
    //   setTimeout(() => handleOkClick(), 600);
    // }
  }

  const handleOtherInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;
    setOtherCondition(value);

    // Update conditions in state when other input changes
    if (value) {
      const newConditions = selectedConditions
        .filter((c) => c !== otherCondition)
        .concat(value);
      setSelectedConditions(newConditions);
      dispatch({ type: SET_CONDITIONS, payload: newConditions.join(", ") });
    } else {
      const newConditions = selectedConditions.filter(
        (c) => c !== otherCondition
      );
      setSelectedConditions(newConditions);
      dispatch({ type: SET_CONDITIONS, payload: newConditions.join(", ") });
    }
  };

  if (showDisqualifier) {
    return (
      <DisqualifierScreen
        title="Important Health Information"
        message="Thank you for taking the assessment. Based on your responses, we noticed that you have Type 1 Diabetes. For your safety, we're unable to recommend this medication, as managing Type 1 Diabetes requires specialized care and consideration."
        recommendation="We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you."
        note="Your health and well-being are our top priority!"
      />
    );
  }

  return (
    <>
      <QuestionNumHeading questionNum={9}>
        Do You Have Any of These Health Conditions? 🏥
      </QuestionNumHeading>
      <QuestionBoxPara>Just to keep things safe and sound! ❤️</QuestionBoxPara>
      <span className={styles["choose-num"]}>Select all that apply</span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(healthConditions) as HealthConditionKey[]).map(
            (key) => {
              const option = healthConditions[key];
              const isSelected = selectedConditions.includes(option);

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

      {showOtherInput && (
        <QuestionInputText
          placeholder="Type your condition here..."
          value={otherCondition}
          onChange={handleOtherInputChange}
        />
      )}

      {errorMsg && <Error message={errorMsg} />}

      {selectedConditions.length > 0 &&
        !selectedConditions.includes("None of the above") &&
        (!showOtherInput || otherCondition) &&
        !errorMsg && (
          <BtnContainer
            className={classNames(styles["btn-container"], styles["ok"])}
            showPressEnter={true}
            onClick={handleOkClick}
          >
            OK{" "}
            <Image
              src="/check-small.svg"
              alt="check small"
              width={34}
              height={34}
            />
          </BtnContainer>
        )}
    </>
  );
}
