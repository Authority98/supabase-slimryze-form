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
import { useState } from "react";

// Define action types since they're missing from reducers
const SET_CONDITIONS = "SET_CONDITIONS";
const REMOVE_CONDITION = "REMOVE_CONDITION";

type ConditionType =
  | "Type 1 Diabetes"
  | "Pancreatitis"
  | "Gallbladder disease"
  | "Severe gastrointestinal disorders"
  | "None of the above";

type DisqualifierType = "type1-diabetes" | "pancreatitis" | "gi-disorders";

// HealthConditionsInput Component
export function HealthConditionsInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { conditions } = state;
  const errorMsg = error.conditions ?? "";
  const [showDisqualifier, setShowDisqualifier] = useState(false);
  const [disqualifierType, setDisqualifierType] =
    useState<DisqualifierType>("type1-diabetes");

  const healthConditions = {
    A: "Type 1 Diabetes",
    B: "Pancreatitis",
    C: "Gallbladder disease",
    D: "Severe gastrointestinal disorders",
    E: "None of the above",
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
      dispatch({ type: SET_CONDITIONS, payload: selectedOption });
      setTimeout(() => handleOkClick(), 600);
      return;
    }

    if (conditions.includes("None of the above")) {
      dispatch({ type: REMOVE_CONDITION, payload: "None of the above" });
    }

    const isAlreadySelected = conditions.includes(selectedOption);
    if (isAlreadySelected) {
      dispatch({ type: REMOVE_CONDITION, payload: selectedOption });
    } else {
      dispatch({ type: SET_CONDITIONS, payload: selectedOption });
    }

    // Check for disqualifying conditions
    if (selectedOption === "Type 1 Diabetes" && !isAlreadySelected) {
      setDisqualifierType("type1-diabetes");
      setShowDisqualifier(true);
      return;
    }

    if (selectedOption === "Pancreatitis" && !isAlreadySelected) {
      setDisqualifierType("pancreatitis");
      setShowDisqualifier(true);
      return;
    }

    if (
      selectedOption === "Severe gastrointestinal disorders" &&
      !isAlreadySelected
    ) {
      setDisqualifierType("gi-disorders");
      setShowDisqualifier(true);
      return;
    }

    // Auto proceed if at least one condition is selected
    if (!isAlreadySelected && conditions.length >= 0) {
      setTimeout(() => handleOkClick(), 600);
    }
  }

  if (showDisqualifier) {
    const disqualifierMessages = {
      "type1-diabetes": {
        title: "Important Health Information",
        message:
          "We notice you have Type 1 Diabetes. For your safety, we need to take extra precautions.",
        recommendation:
          "We recommend consulting with your healthcare provider before starting any weight loss medication, as Type 1 Diabetes requires special consideration.",
        note: "Your health and safety are our top priority!",
      },
      pancreatitis: {
        title: "Important Health Information",
        message:
          "We notice you have a history of pancreatitis. For your safety, we need to take extra precautions.",
        recommendation:
          "We recommend consulting with your healthcare provider before starting any weight loss medication, as pancreatitis requires special consideration.",
        note: "Your health and safety are our top priority!",
      },
      "gi-disorders": {
        title: "Important Health Information",
        message:
          "We notice you have severe gastrointestinal disorders. For your safety, we need to take extra precautions.",
        recommendation:
          "We recommend consulting with your healthcare provider before starting any weight loss medication, as your condition requires special consideration.",
        note: "Your health and safety are our top priority!",
      },
    };

    const message = disqualifierMessages[disqualifierType];

    return (
      <DisqualifierScreen
        title={message.title}
        message={message.message}
        recommendation={message.recommendation}
        note={message.note}
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
              const isSelected = conditions.includes(option);

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
