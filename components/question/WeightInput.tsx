import {
  Error,
  DropdownSelect,
  DropdownSelectOption,
  QuestionNumHeading,
  QuestionBoxPara,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import { useSharedStates } from "@/contexts";
import { useQuestions } from "@/contexts";
import { SET_WEIGHT } from "@/reducers";

export function WeightInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();
  const { weight } = state;
  const errorMsg = error.weight ?? "";

  const weightRanges = {
    A: "Under 150 lbs",
    B: "150-200 lbs",
    C: "200-250 lbs",
    D: "250-300 lbs",
    E: "Over 300 lbs",
  } as const;

  type WeightKey = keyof typeof weightRanges;
  type WeightValue = (typeof weightRanges)[WeightKey];

  function handleOptionClick(selectedOption: WeightValue) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.weight;
        return newValue;
      });

    dispatch({ type: SET_WEIGHT, payload: selectedOption });
    setTimeout(() => handleOkClick(), 600);
  }

  return (
    <>
      <QuestionNumHeading questionNum={6}>
        What&apos;s your current weight range? 🏋️
      </QuestionNumHeading>
      <QuestionBoxPara>Select one option</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        This helps us tailor your program
      </span>

      <DropdownSelect className={styles["role-dropdown"]}>
        <div>
          {(Object.keys(weightRanges) as WeightKey[]).map((key) => {
            const option = weightRanges[key];
            const isSelected = option === weight;

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
