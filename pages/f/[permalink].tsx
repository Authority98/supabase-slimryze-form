import { GetServerSideProps } from "next";
import { useState, useEffect, useRef } from "react";
import { supabase, Form, Question } from "../../utils/supabase";
import Image from "next/image";

type Props = {
  form: Form;
  questions: Question[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const permalink = params?.permalink as string;

  // Fetch form data
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("permalink", permalink)
    .single();

  if (formError || !form) {
    return {
      notFound: true,
    };
  }

  // Fetch questions
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("form_id", form.id)
    .order("question_order", { ascending: true });

  if (questionsError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      form,
      questions: questions || [],
    },
  };
};

export default function FormPage({ form, questions }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear error when changing questions or typing
    setError("");
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        if (!isAnswerValid()) {
          setError("Please answer this question");
          return;
        }
        if (isLastQuestion) {
          handleSubmit();
        } else {
          handleTransition();
        }
      }
      if (e.key === "ArrowUp") {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
      }
      // Handle number keys for choice questions
      if (
        currentQuestion.question_type === "single_choice" &&
        currentQuestion.options
      ) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num > 0 && num <= currentQuestion.options.length) {
          handleChoiceChange(currentQuestion.options[num - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, answers, isLastQuestion, currentQuestionIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  const handleChoiceChange = (value: string, isMultiple: boolean = false) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    if (isMultiple) {
      const currentAnswers = answers[currentQuestion.id]?.split(",") || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter((a) => a !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [currentQuestion.id]: newAnswers.join(",") });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.question_type) {
      case "single_choice":
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-4 cursor-pointer group"
                onClick={() => handleChoiceChange(option)}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-200 
                  ${
                    answers[currentQuestion.id] === option
                      ? "border-[#00C48F] bg-[#00C48F]"
                      : "border-gray-600 group-hover:border-gray-400"
                  }`}
                >
                  {answers[currentQuestion.id] === option && (
                    <div className="w-4 h-4 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-3xl text-white group-hover:text-gray-300 transition-colors duration-200">
                  {option}
                </span>
                <span className="ml-auto text-xl text-gray-500">
                  {index + 1}
                </span>
              </label>
            ))}
          </div>
        );

      case "multiple_choice":
        const selectedOptions = answers[currentQuestion.id]?.split(",") || [];
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-4 cursor-pointer group"
                onClick={() => handleChoiceChange(option, true)}
              >
                <div
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors duration-200 
                  ${
                    selectedOptions.includes(option)
                      ? "border-[#00C48F] bg-[#00C48F]"
                      : "border-gray-600 group-hover:border-gray-400"
                  }`}
                >
                  {selectedOptions.includes(option) && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-3xl text-white group-hover:text-gray-300 transition-colors duration-200">
                  {option}
                </span>
                <span className="ml-auto text-xl text-gray-500">
                  {index + 1}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div className="relative">
            <input
              type="text"
              value={answers[currentQuestion.id] || ""}
              onChange={handleInputChange}
              className="w-full bg-transparent text-5xl text-white border-b-2 border-gray-700 focus:border-[#00C48F] focus:outline-none pb-4 transition-colors placeholder-gray-600"
              placeholder="Type your answer here..."
              required={currentQuestion.is_required}
            />
          </div>
        );
    }
  };

  const isAnswerValid = () => {
    if (!currentQuestion.is_required) return true;

    const answer = answers[currentQuestion.id];
    if (!answer) return false;

    switch (currentQuestion.question_type) {
      case "multiple_choice":
        return answer.split(",").length > 0;
      case "single_choice":
      case "text":
      default:
        return answer.trim().length > 0;
    }
  };

  const handleNext = () => {
    if (currentQuestion.question_type === "disqualifier") {
      setIsDisqualified(true);
      return;
    }

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAnswerValid()) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("responses").insert([
        {
          form_id: form.id,
          answers,
          is_disqualified: isDisqualified,
        },
      ]);

      if (error) throw error;
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      // Remove existing animation classes
      contentRef.current.classList.remove(
        "question-slide-in",
        "question-slide-out"
      );
      // Force a reflow to restart the animation
      void contentRef.current.offsetWidth;
      // Add the slide-in animation
      contentRef.current.classList.add("question-slide-in");
    }
  }, [currentQuestionIndex]);

  const handleTransition = async () => {
    if (contentRef.current) {
      // Add slide-out animation
      contentRef.current.classList.add("question-slide-out");

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Move to next question or submit
      if (isLastQuestion) {
        await handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  if (isDisqualified) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div>
          <Image
            src="/slimryze-logo.webp"
            alt="Slimryze Logo"
            width={140}
            height={37}
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-2xl">
            <div className="w-full space-y-8 text-center">
              <h2 className="text-4xl font-bold text-white">
                Thank you for your interest
              </h2>
              <p className="text-xl text-gray-400">
                Unfortunately, we cannot proceed with your application at this
                time.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div>
          <Image
            src="/slimryze-logo.webp"
            alt="Slimryze Logo"
            width={140}
            height={37}
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-2xl">
            <div className="w-full space-y-8 text-center">
              <h2 className="text-4xl font-bold text-white">
                Thank you for completing the form
              </h2>
              <p className="text-xl text-gray-400">
                Your responses have been submitted successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      {hasStarted && (
        <div className="progress-line">
          <div
            className="progress-line-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      )}
      <div>
        <Image
          src="/slimryze-logo.webp"
          alt="Slimryze Logo"
          width={140}
          height={37}
          className="object-contain"
        />
      </div>
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-6xl">
          <div className="w-full space-y-4">
            <div className="flex items-start" ref={contentRef}>
              <div className="text-2xl opacity-50 text-white flex items-center mr-6">
                {currentQuestionIndex + 1} →
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-4xl font-light text-white leading-tight">
                  {currentQuestion.question_text}
                </h2>

                <p className="text-2xl text-gray-300">
                  {currentQuestion.subtitle ||
                    (currentQuestion.question_type === "multiple_choice"
                      ? "Select all that apply"
                      : currentQuestion.question_type === "single_choice"
                      ? "Select one option"
                      : "Type your answer")}
                </p>

                <div className="space-y-8">
                  {renderQuestionInput()}

                  <div className="relative space-y-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          if (!isAnswerValid()) {
                            setError("Please answer this question");
                            return;
                          }
                          handleTransition();
                        }}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center h-14 px-6 text-2xl font-medium text-white bg-[#00C48F] rounded-lg hover:bg-[#00B382] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-6 w-6 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <>
                            OK{" "}
                            <Image
                              src="/check-small.svg"
                              alt="check small"
                              width={34}
                              height={34}
                              className="ml-2"
                            />
                          </>
                        )}
                      </button>
                      <span className="text-gray-500 text-xl">
                        press Enter ↵
                      </span>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-indicator">
        <button
          className="nav-arrow"
          onClick={() =>
            currentQuestionIndex > 0 &&
            setCurrentQuestionIndex(currentQuestionIndex - 1)
          }
          disabled={currentQuestionIndex === 0}
          aria-label="Previous question"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19L12 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 10L12 5L17 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="nav-arrow"
          onClick={() => {
            if (!answers[currentQuestion.id]?.trim()) {
              setError("Please fill in this field");
              return;
            }
            if (isLastQuestion) {
              handleSubmit();
            } else {
              handleTransition();
            }
          }}
          disabled={isSubmitting}
          aria-label="Next question"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5L12 19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M17 14L12 19L7 14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
