import {
  BtnContainer,
  DropdownSelect,
  DropdownSelectOption,
  Error,
  QuestionInputText,
  QuestionNumHeading,
  QuestionBoxPara,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import Image from "next/image";
import { useQuestions, useSharedStates } from "@/contexts";
import { SET_ROLE } from "@/reducers";
import { ChangeEventHandler, useState } from "react";

export function SymptomsInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { dispatch } = useQuestions();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  const errorMsg = error.role ?? "";

  const symptoms = {
    A: "Low energy or fatigue",
    B: "Poor mental health or depression",
    C: "Joint pain or injury",
    D: "Difficulty sleeping or snoring",
    E: "Other",
  } as const;

  type SymptomKey = keyof typeof symptoms;
  type SymptomValue = (typeof symptoms)[SymptomKey];

  function handleOptionClick(symptom: SymptomValue) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.role;
        return newValue;
      });

    if (symptom === "Other") {
      setShowOtherInput(!showOtherInput);
      if (!showOtherInput) {
        const newSymptoms = [...selectedSymptoms, symptom];
        setSelectedSymptoms(newSymptoms);
        dispatch({ type: SET_ROLE, payload: newSymptoms.join(", ") });
      } else {
        const newSymptoms = selectedSymptoms.filter(
          (s) => s !== symptom && s !== otherSymptom
        );
        setSelectedSymptoms(newSymptoms);
        dispatch({ type: SET_ROLE, payload: newSymptoms.join(", ") });
        setOtherSymptom("");
      }
    } else {
      const isAlreadySelected = selectedSymptoms.includes(symptom);
      if (isAlreadySelected) {
        const newSymptoms = selectedSymptoms.filter((s) => s !== symptom);
        setSelectedSymptoms(newSymptoms);
        dispatch({ type: SET_ROLE, payload: newSymptoms.join(", ") });
      } else {
        const newSymptoms = [...selectedSymptoms, symptom];
        setSelectedSymptoms(newSymptoms);
        dispatch({ type: SET_ROLE, payload: newSymptoms.join(", ") });
      }
    }
  }

  const handleOtherInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;
    setOtherSymptom(value);

    // Update symptoms in state when other input changes
    if (value) {
      const newSymptoms = selectedSymptoms
        .filter((s) => s !== otherSymptom)
        .concat(value);
      dispatch({ type: SET_ROLE, payload: newSymptoms.join(", ") });
    } else {
      const newSymptoms = selectedSymptoms.filter((s) => s !== otherSymptom);
      dispatch({ type: SET_ROLE, payload: newSymptoms.join(", ") });
    }
  };

  return (
    <>
      <QuestionNumHeading questionNum={3}>
        What symptoms are you experiencing? 🤔
      </QuestionNumHeading>
      <QuestionBoxPara>Select all that apply</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us understand your needs better
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(symptoms) as SymptomKey[]).map((key) => {
            const symptom = symptoms[key];
            const isSelected = selectedSymptoms.includes(symptom);

            return (
              <DropdownSelectOption
                key={key}
                className={styles["role-option"]}
                onClick={() => handleOptionClick(symptom)}
                isSelected={isSelected}
              >
                <span
                  className={classNames({
                    [styles["selected"]]: isSelected,
                  })}
                >
                  {key}
                </span>
                {symptom}
              </DropdownSelectOption>
            );
          })}
        </div>
      </DropdownSelect>

      {showOtherInput && (
        <QuestionInputText
          placeholder="Type your symptom here..."
          value={otherSymptom}
          onChange={handleOtherInputChange}
        />
      )}

      {errorMsg && <Error message={errorMsg} />}

      {selectedSymptoms.length > 0 &&
        (!showOtherInput || otherSymptom) &&
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
