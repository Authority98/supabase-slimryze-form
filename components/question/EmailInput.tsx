import { useQuestions, useSharedStates } from "@/contexts";
import classNames from "classnames";
import {
  BtnContainer,
  Error,
  QuestionInputText,
  QuestionNumHeading,
  QuestionBoxPara,
} from "../index";
import Image from "next/image";
import styles from "./Question.module.css";
import type { ChangeEventHandler } from "react";
import { SET_EMAIL } from "@/reducers";

export function EmailInput(): JSX.Element {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();

  const errorMsg = error.email ?? "";
  const { email } = state;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    errorMsg &&
      setErrorMsg &&
      setErrorMsg((prevValue) => {
        delete prevValue.email;
        return prevValue;
      });

    dispatch({ type: SET_EMAIL, payload: event.target.value });
  };

  return (
    <>
      <QuestionNumHeading questionNum={4}>
        What&apos;s your email address? 📧
      </QuestionNumHeading>
      <QuestionBoxPara>Enter your email</QuestionBoxPara>
      <span className={styles["choose-num"]}>
        We&apos;ll send your personalized plan here
      </span>

      <QuestionInputText
        type="email"
        placeholder="name@example.com"
        value={email}
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
