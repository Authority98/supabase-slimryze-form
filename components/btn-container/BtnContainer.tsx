import React, { ReactNode } from "react";
import styles from "./BtnContainer.module.css";
import classNames from "classnames";

type BtnContainerProps = {
  readonly children: ReactNode;
  readonly showPressEnter?: boolean;
  readonly className?: string;
  readonly onClick?: () => void;
};

export function BtnContainer({
  children,
  showPressEnter = false,
  className,
  onClick,
}: BtnContainerProps): React.ReactElement {
  return (
    <div className={classNames(styles["btn-container"], className)}>
      <button onClick={onClick}>{children}</button>
      {showPressEnter && (
        <span>
          press <strong>Enter ↵</strong>
        </span>
      )}
    </div>
  );
}
