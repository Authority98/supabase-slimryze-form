import Image from "next/image";
import styles from "./NavigationIndicator.module.css";
import { ReactElement, KeyboardEvent, MouseEvent } from "react";
import { useSharedStates } from "@/contexts";
import { useQuestions } from "@/contexts";

export function NavigationIndicator(): ReactElement {
  const { questionNum, setErrorMsg, setQuestionNum, handleQuestionNumUpdate } =
    useSharedStates();
  const { now } = questionNum;
  const { state } = useQuestions();
  const {
    firstName,
    email,
    role,
    industry,
    weight,
    weightGoals,
    weightHistory,
    medications,
    conditions,
    thyroidHistory,
    pregnancyStatus,
    readiness,
  } = state;

  // Validation function similar to useHandleKeypress
  const validateForward = () => {
    if (now + 1 === 2 && firstName === "") {
      setErrorMsg({ firstName: "Please fill this in" });
      return false;
    } else if (now + 1 === 3 && role === "") {
      setErrorMsg({ role: "Please select at least one symptom" });
      return false;
    } else if (now + 1 === 4 && weightHistory === "") {
      setErrorMsg({
        weightHistory: "Please tell us about your weight loss journey",
      });
      return false;
    } else if (now + 1 === 5 && email === "") {
      setErrorMsg({ email: "Please fill this in" });
      return false;
    } else if (now + 1 === 6 && industry === "") {
      setErrorMsg({ industry: "Please select your age range" });
      return false;
    } else if (now + 1 === 7 && weight === "") {
      setErrorMsg({ weight: "Please select your current weight range" });
      return false;
    } else if (now + 1 === 8 && weightGoals === "") {
      setErrorMsg({ weightGoals: "Please select your weight loss goal" });
      return false;
    } else if (now + 1 === 9 && medications.length === 0) {
      setErrorMsg({ medications: "Please select at least one option" });
      return false;
    } else if (now + 1 === 10 && conditions.length === 0) {
      setErrorMsg({ conditions: "Please select at least one option" });
      return false;
    } else if (now + 1 === 11 && thyroidHistory === "") {
      setErrorMsg({
        thyroidHistory: "Please tell us about your family history",
      });
      return false;
    } else if (now + 1 === 12 && pregnancyStatus === "") {
      setErrorMsg({
        pregnancyStatus: "Please tell us about your pregnancy status",
      });
      return false;
    } else if (now + 1 === 13 && readiness === "") {
      setErrorMsg({ readiness: "Please tell us when you'd like to start" });
      return false;
    }
    return true;
  };

  const handleNavigation = (
    direction: "up" | "down",
    e?: MouseEvent<HTMLDivElement>
  ) => {
    e?.preventDefault();

    if (direction === "up" && now > 0) {
      setErrorMsg({});
      setQuestionNum((prev) => ({
        prev: prev.now,
        now: prev.now - 1,
      }));
    } else if (direction === "down") {
      if (validateForward()) {
        handleQuestionNumUpdate();
      }
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    direction: "up" | "down"
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation(direction);
    }
  };

  return (
    <div
      className={styles.container}
      role="navigation"
      aria-label="Form navigation"
    >
      <div
        className={styles.arrow}
        role="button"
        tabIndex={0}
        aria-label="Go to previous question"
        onClick={(e) => handleNavigation("up", e)}
        onKeyDown={(e) => handleKeyDown(e, "up")}
      >
        <Image
          src="/arrow-up.svg"
          alt="Navigate up"
          width={24}
          height={24}
          priority
        />
      </div>
      <div
        className={styles.arrow}
        role="button"
        tabIndex={0}
        aria-label="Go to next question"
        onClick={(e) => handleNavigation("down", e)}
        onKeyDown={(e) => handleKeyDown(e, "down")}
      >
        <Image
          src="/arrow-down.svg"
          alt="Navigate down"
          width={24}
          height={24}
          priority
        />
      </div>
    </div>
  );
}
