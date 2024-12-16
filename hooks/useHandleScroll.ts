import { useSharedStates } from "@/contexts";
import { useEffect, useRef } from "react";

export function useHandleScroll() {
  const timerIdRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { questionNum, setQuestionNum, handleOkClick, setErrorMsg } =
    useSharedStates();

  useEffect(() => {
    function handleScroll(event: WheelEvent) {
      clearTimeout(timerIdRef.current);

      timerIdRef.current = setTimeout(() => {
        if (event.deltaY > 0) {
          handleOkClick();
        } else if (event.deltaY <= -1 && questionNum.now > 0) {
          setErrorMsg({});
          setQuestionNum((prevValue) => ({
            prev: prevValue.now,
            now: prevValue.now - 1,
          }));
        }
      }, 32);
    }

    document.addEventListener("wheel", handleScroll);

    return function () {
      document.removeEventListener("wheel", handleScroll);
    };
  }, [questionNum.now, setQuestionNum, handleOkClick, setErrorMsg]);
}
