/// <reference lib="dom" />
import styles from "./Error.module.css";
import Image from "next/image";

type ErrorProps = {
  readonly message: string;
};

export function Error({ message }: ErrorProps): React.ReactElement {
  return (
    <div className={styles["error"]}>
      <Image src="/error.svg" alt="error" width={18} height={18} />
      {message}
    </div>
  );
}
