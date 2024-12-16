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
import { SET_MEDICATIONS, REMOVE_MEDICATION } from "@/reducers";
import { useState } from "react";

type MedicationType =
  | "Insulin"
  | "Blood thinners (e.g., Warfarin)"
  | "Corticosteroids"
  | "Beta-blockers"
  | "None of the above";

export function MedicationsInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { medications } = state;
  const errorMsg = error.medications ?? "";
  const [showDisqualifier, setShowDisqualifier] = useState(false);
  const [disqualifierType, setDisqualifierType] = useState<
    "insulin" | "blood-thinners"
  >("insulin");

  const medicationOptions = {
    A: "Insulin",
    B: "Blood thinners (e.g., Warfarin)",
    C: "Corticosteroids",
    D: "Beta-blockers",
    E: "None of the above",
  } as const;

  type MedicationKey = keyof typeof medicationOptions;

  function handleOptionClick(selectedOption: MedicationType) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.medications;
        return newValue;
      });

    if (selectedOption === "None of the above") {
      dispatch({ type: SET_MEDICATIONS, payload: selectedOption });
      setTimeout(() => handleOkClick(), 600);
      return;
    }

    if (medications.includes("None of the above")) {
      dispatch({ type: REMOVE_MEDICATION, payload: "None of the above" });
    }

    const isAlreadySelected = medications.includes(selectedOption);
    if (isAlreadySelected) {
      dispatch({ type: REMOVE_MEDICATION, payload: selectedOption });
    } else {
      dispatch({ type: SET_MEDICATIONS, payload: selectedOption });
    }

    // Check for disqualifying medications
    if (selectedOption === "Insulin" && !isAlreadySelected) {
      setDisqualifierType("insulin");
      setShowDisqualifier(true);
      return;
    }

    if (
      selectedOption === "Blood thinners (e.g., Warfarin)" &&
      !isAlreadySelected
    ) {
      setDisqualifierType("blood-thinners");
      setShowDisqualifier(true);
      return;
    }

    // Auto proceed if at least one medication is selected
    if (!isAlreadySelected && medications.length >= 0) {
      setTimeout(() => handleOkClick(), 600);
    }
  }

  if (showDisqualifier) {
    return <DisqualifierScreen type={disqualifierType} />;
  }

  return (
    <>
      <QuestionNumHeading questionNum={8}>
        Are You Taking Any of These Medications? 💊
      </QuestionNumHeading>
      <QuestionBoxPara>Some meds may interfere with GLP-1s 😬</QuestionBoxPara>
      <span className={styles["choose-num"]}>Select all that apply</span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(medicationOptions) as MedicationKey[]).map((key) => {
            const option = medicationOptions[key];
            const isSelected = medications.includes(option);

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
