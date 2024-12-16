/// <reference lib="dom" />
import { ReactNode } from "react";
import styles from "./DropdownSelect.module.css";
import classNames from "classnames";

type DropdownSelectProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export function DropdownSelect({
  children,
  className,
}: DropdownSelectProps): React.ReactElement {
  return (
    <div className={classNames(styles["dropdown-select"], className)}>
      {children}
    </div>
  );
}
