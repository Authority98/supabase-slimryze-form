import { ChangeEventHandler, forwardRef } from "react";
import styles from "./QuestionInputText.module.css";
import classNames from "classnames";

type QuestionInputTextProps = {
  readonly value: string;
  readonly onChange: ChangeEventHandler<HTMLInputElement>;
  readonly placeholder?: string;
  readonly type?: string;
  readonly className?: string;
};

export const QuestionInputText = forwardRef<
  HTMLInputElement,
  QuestionInputTextProps
>(function QuestionInputText(
  {
    value,
    onChange,
    placeholder,
    type = "text",
    className,
  }: QuestionInputTextProps,
  ref
): JSX.Element {
  return (
    <input
      ref={ref}
      type={type}
      className={classNames(styles["question-input__text"], className)}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
});
