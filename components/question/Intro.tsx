import { useSharedStates } from "@/contexts";
import { BtnContainer, QuestionBoxHeading, QuestionBoxPara } from "../index";

export function Intro(): JSX.Element {
  const { handleOkClick } = useSharedStates();

  return (
    <>
      <QuestionBoxHeading>Transform Your Life Today! ✨</QuestionBoxHeading>
      <QuestionBoxPara>
        We&apos;ve designed this personalized questionnaire to get to know you
        better and tailor your SlimRyze experience. Answer a few quick questions
        to help us understand your needs, challenges, and goals.
      </QuestionBoxPara>
      <BtnContainer showPressEnter={true} onClick={handleOkClick}>
        Let&apos;s Begin
      </BtnContainer>
    </>
  );
}
