import { QuestionBoxHeading, QuestionBoxPara, BtnContainer } from "../index";
import classNames from "classnames";
import styles from "./Question.module.css";

type MedicationType = "insulin" | "blood-thinners";
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
      "We appreciate your honesty about taking insulin. For your safety, we cannot proceed with GLP-1 medications at this time.",
    recommendation:
      "Since you're currently on insulin therapy, we recommend consulting with your healthcare provider about potential interactions with GLP-1 medications. They can help determine the best approach for your specific situation.",
    note: "Your safety is our top priority! 💙",
  },
  "blood-thinners": {
    title: "Important Medical Information",
    message:
      "We appreciate your honesty about taking blood thinners. For your safety, we cannot proceed with GLP-1 medications at this time.",
    recommendation:
      "Since you're on blood thinners (like Warfarin), we recommend consulting with your healthcare provider about potential interactions with GLP-1 medications. They can help determine if any adjustments would make GLP-1s a safe option for you.",
    note: "Your safety is our top priority! 💙",
  },
  age: {
    title: "We Appreciate Your Interest!",
    message:
      "Thank you for wanting to join SlimRyze. However, our program is currently designed for individuals 18 and older.",
    recommendation:
      "We recommend consulting with your parents and healthcare provider about appropriate wellness options for your age group.",
    note: "Please come back when you're 18!",
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
