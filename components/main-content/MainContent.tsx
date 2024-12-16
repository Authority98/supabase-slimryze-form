import React from "react";
import { useSharedStates } from "@/contexts";
import { useHandleKeypress, useHandleScroll } from "@/hooks";
import { useEffect } from "react";
import { Question } from "../index";
import { NavigationIndicator } from "../navigation-indicator/NavigationIndicator";
import styles from "./MainContent.module.css";

export function MainContent(): React.ReactElement {
  const { questionNum, setShowIndustriesList } = useSharedStates();
  const { prev, now } = questionNum;

  useHandleKeypress();
  useHandleScroll();

  useEffect(() => {
    function handleClick() {
      setShowIndustriesList(false);
    }

    document.addEventListener("click", handleClick);

    return function () {
      document.removeEventListener("click", handleClick);
    };
  }, [setShowIndustriesList]);

  return (
    <section className={styles["main-content"]}>
      <div className={styles["main-content__container"]}>
        <Question
          type="intro"
          outView={now - 1 === 0 || now > 1}
          outViewSlide="up"
          inView={now === 0}
          inViewSlide={prev === 1 ? "down" : ""}
          isRendered={prev === null}
        />

        {[0, 2].includes(prev ?? -1) && [now - 1, now, now + 1].includes(1) && (
          <Question
            type="firstName"
            outView={[now - 1, now + 1].includes(1)}
            outViewSlide={now - 1 === 1 ? "up" : "down"}
            inView={now === 1}
            inViewSlide={prev === 2 ? "down" : "up"}
          />
        )}

        {[1, 3].includes(prev ?? 0) && [now - 1, now, now + 1].includes(2) && (
          <Question
            type="weightHistory"
            outView={[now - 1, now + 1].includes(2)}
            outViewSlide={now - 1 === 2 ? "up" : "down"}
            inView={now === 2}
            inViewSlide={prev === 3 ? "down" : "up"}
          />
        )}

        {[2, 4].includes(prev ?? 0) && [now - 1, now, now + 1].includes(3) && (
          <Question
            type="symptoms"
            outView={[now - 1, now + 1].includes(3)}
            outViewSlide={now - 1 === 3 ? "up" : "down"}
            inView={now === 3}
            inViewSlide={prev === 4 ? "down" : "up"}
          />
        )}

        {[3, 5].includes(prev ?? 0) && [now - 1, now, now + 1].includes(4) && (
          <Question
            type="email"
            outView={[now - 1, now + 1].includes(4)}
            outViewSlide={now - 1 === 4 ? "up" : "down"}
            inView={now === 4}
            inViewSlide={prev === 5 ? "down" : "up"}
          />
        )}

        {[4, 6].includes(prev ?? 0) && [now - 1, now, now + 1].includes(5) && (
          <Question
            type="industry"
            outView={[now - 1, now + 1].includes(5)}
            outViewSlide={now - 1 === 5 ? "up" : "down"}
            inView={now === 5}
            inViewSlide={prev === 6 ? "down" : "up"}
          />
        )}

        {[5, 7].includes(prev ?? 0) && [now - 1, now, now + 1].includes(6) && (
          <Question
            type="weight"
            outView={[now - 1, now + 1].includes(6)}
            outViewSlide={now - 1 === 6 ? "up" : "down"}
            inView={now === 6}
            inViewSlide={prev === 7 ? "down" : "up"}
          />
        )}

        {[6, 8].includes(prev ?? 0) && [now - 1, now, now + 1].includes(7) && (
          <Question
            type="weightGoals"
            outView={[now - 1, now + 1].includes(7)}
            outViewSlide={now - 1 === 7 ? "up" : "down"}
            inView={now === 7}
            inViewSlide={prev === 8 ? "down" : "up"}
          />
        )}

        {[7, 9].includes(prev ?? 0) && [now - 1, now, now + 1].includes(8) && (
          <Question
            type="medications"
            outView={[now - 1, now + 1].includes(8)}
            outViewSlide={now - 1 === 8 ? "up" : "down"}
            inView={now === 8}
            inViewSlide={prev === 9 ? "down" : "up"}
          />
        )}

        {[8, 10].includes(prev ?? 0) && [now - 1, now, now + 1].includes(9) && (
          <Question
            type="conditions"
            outView={[now - 1, now + 1].includes(9)}
            outViewSlide={now - 1 === 9 ? "up" : "down"}
            inView={now === 9}
            inViewSlide={prev === 10 ? "down" : "up"}
          />
        )}

        {[9, 11].includes(prev ?? 0) &&
          [now - 1, now, now + 1].includes(10) && (
            <Question
              type="thyroidCancer"
              outView={[now - 1, now + 1].includes(10)}
              outViewSlide={now - 1 === 10 ? "up" : "down"}
              inView={now === 10}
              inViewSlide={prev === 11 ? "down" : "up"}
            />
          )}

        {[10, 12].includes(prev ?? 0) &&
          [now - 1, now, now + 1].includes(11) && (
            <Question
              type="pregnancy"
              outView={[now - 1, now + 1].includes(11)}
              outViewSlide={now - 1 === 11 ? "up" : "down"}
              inView={now === 11}
              inViewSlide={prev === 12 ? "down" : "up"}
            />
          )}

        {[11, 13].includes(prev ?? 0) &&
          [now - 1, now, now + 1].includes(12) && (
            <Question
              type="readiness"
              outView={[now - 1, now + 1].includes(12)}
              outViewSlide={now - 1 === 12 ? "up" : "down"}
              inView={now === 12}
              inViewSlide={"up"}
            />
          )}

        {[12, 14].includes(prev ?? 0) &&
          [now - 1, now, now + 1].includes(13) && (
            <Question
              type="success"
              outView={[now - 1, now + 1].includes(13)}
              outViewSlide={now - 1 === 13 ? "up" : "down"}
              inView={now === 13}
              inViewSlide={"up"}
            />
          )}
      </div>
      <NavigationIndicator />
    </section>
  );
}
