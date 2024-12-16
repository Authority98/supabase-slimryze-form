import { useQuestions, useSharedStates } from "@/contexts";
import { useEffect } from "react";

export function useHandleKeypress() {
  const { questionNum, setErrorMsg, handleQuestionNumUpdate, setQuestionNum } =
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

  useEffect(() => {
    // Helper function for validation checks
    const validateForward = () => {
      if (now + 1 === 2 && firstName === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          firstName: "Please fill this in",
        }));
        return false;
      } else if (now + 1 === 3 && role === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          role: "Please select at least one symptom",
        }));
        return false;
      } else if (now + 1 === 4 && weightHistory === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          weightHistory: "Please tell us about your weight loss journey",
        }));
        return false;
      } else if (now + 1 === 5 && email === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          email: "Please fill this in",
        }));
        return false;
      } else if (now + 1 === 6 && industry === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          industry: "Please select your age range",
        }));
        return false;
      } else if (now + 1 === 7 && weight === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          weight: "Please select your current weight range",
        }));
        return false;
      } else if (now + 1 === 8 && weightGoals === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          weightGoals: "Please select your weight loss goal",
        }));
        return false;
      } else if (now + 1 === 9 && medications.length === 0) {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          medications: "Please select at least one option",
        }));
        return false;
      } else if (now + 1 === 10 && conditions.length === 0) {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          conditions: "Please select at least one option",
        }));
        return false;
      } else if (now + 1 === 11 && thyroidHistory === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          thyroidHistory: "Please tell us about your family history",
        }));
        return false;
      } else if (now + 1 === 12 && pregnancyStatus === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          pregnancyStatus: "Please tell us about your pregnancy status",
        }));
        return false;
      } else if (now + 1 === 13 && readiness === "") {
        setErrorMsg((prevValue) => ({
          ...prevValue,
          readiness: "Please tell us when you'd like to start",
        }));
        return false;
      }
      return true;
    };

    function handleKeypress(event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
        if (validateForward()) {
          handleQuestionNumUpdate();
        }
      }
    }

    function handleArrowKeys(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (validateForward()) {
          handleQuestionNumUpdate();
        }
      } else if (event.key === "ArrowUp" && now > 0) {
        event.preventDefault();
        setErrorMsg({});
        setQuestionNum((prevValue) => ({
          prev: prevValue.now,
          now: prevValue.now - 1,
        }));
      }
    }

    document.addEventListener("keypress", handleKeypress);
    document.addEventListener("keydown", handleArrowKeys);

    return function () {
      document.removeEventListener("keypress", handleKeypress);
      document.removeEventListener("keydown", handleArrowKeys);
    };
  }, [
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
    now,
    handleQuestionNumUpdate,
    setQuestionNum,
    setErrorMsg,
  ]);
}
