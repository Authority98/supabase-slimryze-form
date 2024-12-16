import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { questrialFont } from "@/utils";
import { MainContent, ProgressBar } from "@/components";
import classNames from "classnames";
import { SharedStatesProvider, useQuestions } from "@/contexts";
import type { ReactElement } from "react";

export default function Home(): ReactElement {
  const { percent } = useQuestions();

  return (
    <>
      <Head>
        <title>SlimRyze</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SlimRyze - Transform Your Life Today!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <ProgressBar width={percent} />
        <Image
          src="/slimryze-logo.webp"
          alt="SlimRyze logo"
          width={160}
          height={40}
          quality={100}
          priority
        />
      </header>
      <main className={classNames(styles.main, questrialFont.className)}>
        <SharedStatesProvider>
          <MainContent />
        </SharedStatesProvider>
      </main>
    </>
  );
}
