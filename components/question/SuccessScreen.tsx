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
        CONGRATULATIONS! YOU&apos;RE PREQUALIFIED! 🎉
      </QuestionBoxHeading>
      <QuestionBoxPara>
        You&apos;re one step closer to your weight loss journey. Please note
        that while you haven&apos;t been officially qualified by a physician
        yet, 95% of people who reach this stage successfully qualify.
      </QuestionBoxPara>
      <QuestionBoxPara>
        Our team will review your responses and create a personalized plan
        tailored to your unique needs and goals, which will be finalized during
        your consultation with a provider.
      </QuestionBoxPara>
      <span className={styles["choose-num"]}>
        Get ready to transform with SlimRyze!
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
