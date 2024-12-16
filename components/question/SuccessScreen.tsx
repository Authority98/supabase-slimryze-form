import { BtnContainer } from "../btn-container/BtnContainer";
import { QuestionBoxHeading } from "../question-box-heading/QuestionBoxHeading";
import { QuestionBoxPara } from "../question-box-para/QuestionBoxPara";
import classNames from "classnames";
import styles from "./Question.module.css";
import { useSharedStates } from "@/contexts";

export function SuccessScreen(): JSX.Element {
  const { setQuestionNum } = useSharedStates();

  function handleNextSteps() {
    window.location.href = "https://slimryze.com/";
  }

  function handleStartOver() {
    // Reset to the first question
    setQuestionNum({ prev: null, now: 0 });
  }

  return (
    <div className={styles["disqualifier"]}>
      <QuestionBoxHeading className={styles["disqualifier-heading"]}>
        Thank You for Completing Your Assessment! 🎉
      </QuestionBoxHeading>
      <QuestionBoxPara>
        We&apos;ve received all your information and are excited to help you on
        your wellness journey.
      </QuestionBoxPara>
      <QuestionBoxPara>
        Our team will review your responses and prepare a personalized plan
        tailored to your needs and goals.
      </QuestionBoxPara>
      <span className={styles["choose-num"]}>
        Get ready to transform your life with SlimRyze! ✨
      </span>
      <div
        className={classNames(
          styles["disqualifier-button"],
          styles["button-group"]
        )}
      >
        <BtnContainer
          className={classNames(styles["btn-container"], styles["restart"])}
          showPressEnter={false}
          onClick={handleNextSteps}
        >
          Continue to next steps
        </BtnContainer>
        <BtnContainer
          className={classNames(styles["btn-container"], styles["restart"])}
          showPressEnter={false}
          onClick={handleStartOver}
        >
          Start Over
        </BtnContainer>
      </div>
    </div>
  );
}
