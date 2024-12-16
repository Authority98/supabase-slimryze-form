import { ReactNode } from "react";
import styles from "./QuestionBoxPara.module.css";

type QuestionBoxParaProps = {
  readonly children: ReactNode;
};

export function QuestionBoxPara({
  children,
}: QuestionBoxParaProps): JSX.Element {
  return <p className={styles["question-box__para"]}>{children}</p>;
}
