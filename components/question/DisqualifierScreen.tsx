import { QuestionBoxHeading, QuestionBoxPara, BtnContainer } from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";

type MedicationType =
  | "insulin"
  | "metformin"
  | "antidepressants"
  | "corticosteroids";
type DisqualifierType = "age" | MedicationType;

type DisqualifierScreenProps = {
  title?: string;
  message?: string;
  recommendation?: string;
  note?: string;
  type?: DisqualifierType;
};

const MESSAGES = {
  insulin: {
    title: "Important Medical Information",
    message:
      "Thank you for taking the assessment. Based on your responses, we noticed that you are currently taking insulin. For your safety, we're unable to recommend this medication, as managing insulin therapy requires specialized care and consideration.",
    recommendation:
      "We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you.",
    note: "Your health and well-being are our top priority!",
  },
  metformin: {
    title: "Important Medical Information",
    message:
      "Thank you for taking the assessment. Based on your responses, we noticed that you are currently taking metformin. For your safety, we're unable to recommend this medication, as managing metformin therapy requires specialized care and consideration.",
    recommendation:
      "We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you.",
    note: "Your health and well-being are our top priority!",
  },
  antidepressants: {
    title: "Important Medical Information",
    message:
      "Thank you for taking the assessment. Based on your responses, we noticed that you are currently taking antidepressants. For your safety, we're unable to recommend this medication, as managing antidepressant therapy requires specialized care and consideration.",
    recommendation:
      "We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you.",
    note: "Your health and well-being are our top priority!",
  },
  corticosteroids: {
    title: "Important Medical Information",
    message:
      "Thank you for taking the assessment. Based on your responses, we noticed that you are currently taking corticosteroids. For your safety, we're unable to recommend this medication, as managing corticosteroid therapy requires specialized care and consideration.",
    recommendation:
      "We encourage you to consult with your healthcare provider to explore weight loss options that are safe and effective for you.",
    note: "Your health and well-being are our top priority!",
  },
  age: {
    title: "Important Information",
    message:
      "Thank you for taking the assessment. Based on your responses, we noticed that you are under 18 years old. For your safety, we're unable to recommend this medication, as our program is designed for individuals 18 and older.",
    recommendation:
      "We encourage you to consult with your healthcare provider to explore weight loss options that are safe and appropriate for your age group.",
    note: "Your health and well-being are our top priority!",
  },
};

export function DisqualifierScreen({
  title,
  message,
  recommendation,
  note,
  type = "age",
}: DisqualifierScreenProps): JSX.Element {
  function handleHomeClick() {
    window.location.href = "https://slimryze.com/";
  }

  const defaultContent = MESSAGES[type];

  return (
    <div className={styles["disqualifier"]}>
      <QuestionBoxHeading className={styles["disqualifier-heading"]}>
        {title || defaultContent.title} 🌟
      </QuestionBoxHeading>
      <QuestionBoxPara>{message || defaultContent.message}</QuestionBoxPara>
      {(recommendation || defaultContent.recommendation) && (
        <QuestionBoxPara>
          {recommendation || defaultContent.recommendation}
        </QuestionBoxPara>
      )}
      {(note || defaultContent.note) && (
        <span className={styles["choose-num"]}>
          {note || defaultContent.note}
        </span>
      )}
      <div className={styles["disqualifier-button"]}>
        <BtnContainer
          className={classNames(styles["btn-container"], styles["restart"])}
          showPressEnter={false}
          onClick={handleHomeClick}
        >
          Go back to homepage
        </BtnContainer>
      </div>
    </div>
  );
}
