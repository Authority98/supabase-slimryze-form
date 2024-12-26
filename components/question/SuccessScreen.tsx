import { useQuestions, useSharedStates } from "@/contexts";
import classNames from "classnames";
import { BtnContainer, QuestionBoxHeading, QuestionBoxPara } from "../index";
import styles from "./Question.module.css";
import { sendAssessmentEmail } from "@/services/email";
import { useEffect, useState } from "react";

export function SuccessScreen(): JSX.Element {
  const { setQuestionNum } = useSharedStates();
  const { state } = useQuestions();
  const [emailStatus, setEmailStatus] = useState<
    "sending" | "success" | "error"
  >("sending");

  useEffect(() => {
    // Send the assessment email when the success screen is shown
    const sendEmail = async () => {
      try {
        await sendAssessmentEmail(state);
        setEmailStatus("success");
      } catch (error) {
        console.error("Failed to send assessment email:", error);
        setEmailStatus("error");
      }
    };

    sendEmail();
  }, [state]);

  function handleNextSteps() {
    window.location.href = "https://slimryze.com/";
  }

  function handleStartOver() {
    // Reset to the first question
    setQuestionNum({ prev: null, now: 0 });
  }

  function handleRetryEmail() {
    setEmailStatus("sending");
    const sendEmail = async () => {
      try {
        await sendAssessmentEmail(state);
        setEmailStatus("success");
      } catch (error) {
        console.error("Failed to send assessment email:", error);
        setEmailStatus("error");
      }
    };
    sendEmail();
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

      {emailStatus === "sending" && (
        <span className={styles["choose-num"]}>
          Sending your assessment details...
        </span>
      )}

      {emailStatus === "success" && (
        <span className={styles["choose-num"]}>
          We&apos;ve sent your assessment details to {state.email}. Get ready to
          transform with SlimRyze!
        </span>
      )}

      {emailStatus === "error" && (
        <>
          <span
            className={styles["choose-num"]}
            style={{ color: "var(--error-text-color)" }}
          >
            There was an error sending your assessment details.
          </span>
          <BtnContainer
            className={classNames(styles["btn-container"], styles["restart"])}
            showPressEnter={false}
            onClick={handleRetryEmail}
          >
            Retry Sending Email
          </BtnContainer>
        </>
      )}

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
