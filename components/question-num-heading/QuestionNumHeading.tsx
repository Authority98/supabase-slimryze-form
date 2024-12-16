import { ReactNode } from "react";
import styles from "./QuestionNumHeading.module.css";
import Image from "next/image";
import classNames from "classnames";
import { QuestionBoxHeading } from "../index";

type QuestionNumHeadingProps = {
  readonly children: ReactNode;
  readonly questionNum: number;
};

export function QuestionNumHeading({
  children,
  questionNum,
}: QuestionNumHeadingProps): JSX.Element {
  return (
    <QuestionBoxHeading
      className={classNames(styles["question-box__heading"], styles["num"])}
    >
      <span>
        {questionNum}
        <Image
          src="/right-arrow.svg"
          alt="right arrow"
          width={16}
          height={16}
        />
      </span>
      {children}
    </QuestionBoxHeading>
  );
}
