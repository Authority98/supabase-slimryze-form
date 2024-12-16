import {
  BtnContainer,
  Error,
  QuestionInputText,
  QuestionNumHeading,
} from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";
import Image from "next/image";
import { ChangeEventHandler } from "react";
import { SET_FIRST_NAME } from "@/reducers";
import { useQuestions, useSharedStates } from "@/contexts";

export function FirstNameInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();

  const errorMsg = error.firstName ?? "";
  const { firstName } = state;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    errorMsg &&
      setErrorMsg &&
      setErrorMsg((prevValue) => {
        const newValue = { ...prevValue };
        delete newValue.firstName;
        return newValue;
      });

    dispatch({ type: SET_FIRST_NAME, payload: event.target.value });
  };

  return (
    <>
      <QuestionNumHeading questionNum={1}>
        Hey there! What should we call you? 👋
      </QuestionNumHeading>

      <QuestionInputText
        placeholder="Type your name here..."
        value={firstName}
        onChange={handleInputChange}
      />

      {errorMsg && <Error message={errorMsg} />}

      {errorMsg === "" && (
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
