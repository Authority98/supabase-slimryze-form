import {
  Error,
  DropdownSelect,
  DropdownSelectOption,
  QuestionNumHeading,
  QuestionBoxPara,
  QuestionInputText,
  BtnContainer,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import { useSharedStates } from "@/contexts";
import { useQuestions } from "@/contexts";
import { SET_MEDICATIONS, REMOVE_MEDICATION } from "@/reducers";
import { useState, ChangeEventHandler } from "react";
import Image from "next/image";

type MedicationType =
  | "Insulin"
  | "Metformin"
  | "Antidepressants"
  | "Corticosteroids"
  | "None of the above"
  | "Other";

export function MedicationsInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const errorMsg = error.medications ?? "";
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherMedication, setOtherMedication] = useState("");
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  const medicationOptions = {
    A: "Insulin",
    B: "Metformin",
    C: "Antidepressants",
    D: "Corticosteroids",
    E: "None of the above",
    F: "Other",
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
      setSelectedMedications([selectedOption]);
      dispatch({ type: SET_MEDICATIONS, payload: selectedOption });
      setTimeout(() => handleOkClick(), 600);
      return;
    }

    if (selectedOption === "Other") {
      setShowOtherInput(!showOtherInput);
      if (!showOtherInput) {
        const newMedications = [...selectedMedications, selectedOption];
        setSelectedMedications(newMedications);
        dispatch({ type: SET_MEDICATIONS, payload: newMedications.join(", ") });
      } else {
        const newMedications = selectedMedications.filter(
          (m) => m !== selectedOption && m !== otherMedication
        );
        setSelectedMedications(newMedications);
        dispatch({ type: SET_MEDICATIONS, payload: newMedications.join(", ") });
        setOtherMedication("");
      }
      return;
    }

    if (selectedMedications.includes("None of the above")) {
      const newMedications = selectedMedications.filter(
        (m) => m !== "None of the above"
      );
      setSelectedMedications(newMedications);
      dispatch({ type: REMOVE_MEDICATION, payload: "None of the above" });
    }

    if (selectedMedications.includes("Other")) {
      const newMedications = selectedMedications.filter((m) => m !== "Other");
      setSelectedMedications(newMedications);
      dispatch({ type: REMOVE_MEDICATION, payload: "Other" });
    }

    const isAlreadySelected = selectedMedications.includes(selectedOption);
    if (isAlreadySelected) {
      const newMedications = selectedMedications.filter(
        (m) => m !== selectedOption
      );
      setSelectedMedications(newMedications);
      dispatch({ type: REMOVE_MEDICATION, payload: selectedOption });
    } else {
      const newMedications = [...selectedMedications, selectedOption];
      setSelectedMedications(newMedications);
      dispatch({ type: SET_MEDICATIONS, payload: selectedOption });
    }
  }

  const handleOtherInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;
    setOtherMedication(value);

    // Update medications in state when other input changes
    if (value) {
      const newMedications = selectedMedications
        .filter((m) => m !== otherMedication)
        .concat(value);
      setSelectedMedications(newMedications);
      dispatch({ type: SET_MEDICATIONS, payload: newMedications.join(", ") });
    } else {
      const newMedications = selectedMedications.filter(
        (m) => m !== otherMedication
      );
      setSelectedMedications(newMedications);
      dispatch({ type: SET_MEDICATIONS, payload: newMedications.join(", ") });
    }
  };

  return (
    <>
      <QuestionNumHeading questionNum={8}>
        Are you taking any of the following medications? 💊
      </QuestionNumHeading>
      <QuestionBoxPara>
        Some meds may interfere with SlimRyze 😬
      </QuestionBoxPara>
      <span className={styles["choose-num"]}>Select all that apply</span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(medicationOptions) as MedicationKey[]).map((key) => {
            const option = medicationOptions[key];
            const isSelected = selectedMedications.includes(option);

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

      {showOtherInput && (
        <QuestionInputText
          placeholder="Type your medication here..."
          value={otherMedication}
          onChange={handleOtherInputChange}
        />
      )}

      {errorMsg && <Error message={errorMsg} />}

      {selectedMedications.length > 0 &&
        !selectedMedications.includes("None of the above") &&
        (!showOtherInput || otherMedication) &&
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
