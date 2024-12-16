import { ReactNode } from "react";
import styles from "./DropdownSelectOption.module.css";
import classNames from "classnames";

type DropdownSelectOptionProps = {
  readonly children: ReactNode;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

export function DropdownSelectOption({
  children,
  isSelected,
  onClick,
  className,
}: DropdownSelectOptionProps): React.ReactElement {
  return (
    <button
      className={classNames(
        styles["dropdown-select__option"],
        {
          [styles["selected"]]: isSelected,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
