import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase, Form, Question } from "../../../utils/supabase";
import { withAuth } from "../../../utils/withAuth";
import { Button } from "../../../components/ui/button";
import { Plus, Loader2, X, ChevronDown } from "lucide-react";

type QuestionInput = {
  id?: string;
  question_text: string;
  subtitle?: string;
  question_type: "text" | "single_choice" | "multiple_choice" | "disqualifier";
  is_required: boolean;
  options?: string[];
};

type Props = {
  form: Form;
  questions: Question[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const formId = params?.id as string;

  // Fetch form data
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("*")
    .eq("id", formId)
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
    .eq("form_id", formId)
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

function EditFormPage({ form, questions: initialQuestions }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(form.title);
  const [hasDisqualifier, setHasDisqualifier] = useState(form.has_disqualifier);
  const [questions, setQuestions] = useState<QuestionInput[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const [newOptionText, setNewOptionText] = useState<string>("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null
  );
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".question-type-dropdown")) {
        setShowQuestionTypes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addQuestion = (type: QuestionInput["question_type"]) => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        subtitle: "",
        question_type: type,
        is_required: true,
        options:
          type === "single_choice" || type === "multiple_choice"
            ? []
            : undefined,
      },
    ]);
    setActiveQuestionIndex(questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionInput>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(null);
    }
  };

  const addOption = (questionIndex: number) => {
    if (!newOptionText.trim()) return;

    const question = questions[questionIndex];
    const currentOptions = question.options || [];

    updateQuestion(questionIndex, {
      options: [...currentOptions, newOptionText.trim()],
    });

    setNewOptionText("");
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = (question.options || []).filter(
      (_, i) => i !== optionIndex
    );
    updateQuestion(questionIndex, { options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update form
      const { error: formError } = await supabase
        .from("forms")
        .update({
          title,
          has_disqualifier: hasDisqualifier,
        })
        .eq("id", form.id);

      if (formError) throw formError;

      // Delete existing questions
      const { error: deleteError } = await supabase
        .from("questions")
        .delete()
        .eq("form_id", form.id);

      if (deleteError) throw deleteError;

      // Insert new questions
      const { error: questionsError } = await supabase.from("questions").insert(
        questions.map((q, index) => ({
          form_id: form.id,
          question_text: q.question_text,
          subtitle: q.subtitle || null,
          question_type: q.question_type,
          is_required: q.is_required,
          options: q.options || null,
          question_order: index,
        }))
      );

      if (questionsError) throw questionsError;

      router.push("/admin");
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Failed to update form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black admin-page">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-2xl font-medium text-white mb-4">
              Form Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-4 text-xl bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter form title"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={hasDisqualifier}
                onChange={(e) => setHasDisqualifier(e.target.checked)}
                className="w-6 h-6 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-xl font-medium text-white">
                Enable Disqualifier Screen
              </span>
            </label>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-800 pb-6">
              <h3 className="text-2xl font-medium text-white">Questions</h3>
              <div className="flex space-x-4">
                <div className="relative question-type-dropdown">
                  <Button
                    type="button"
                    onClick={() => setShowQuestionTypes(!showQuestionTypes)}
                    variant="outline"
                    className="text-lg h-12 px-6"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    Add Question
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transition-transform ${
                        showQuestionTypes ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  {showQuestionTypes && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                      <button
                        type="button"
                        onClick={() => {
                          addQuestion("text");
                          setShowQuestionTypes(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-700"
                      >
                        Text Input
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addQuestion("single_choice");
                          setShowQuestionTypes(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-700"
                      >
                        Single Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addQuestion("multiple_choice");
                          setShowQuestionTypes(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-700"
                      >
                        Multiple Choice
                      </button>
                      {hasDisqualifier && (
                        <button
                          type="button"
                          onClick={() => {
                            addQuestion("disqualifier");
                            setShowQuestionTypes(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-700"
                        >
                          Disqualifier
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-xl font-medium text-white mb-3">
                        Question {index + 1} (
                        {question.question_type.replace("_", " ")})
                      </label>
                      <input
                        type="text"
                        value={question.question_text}
                        onChange={(e) =>
                          updateQuestion(index, {
                            question_text: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 text-xl bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your question"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xl font-medium text-white mb-3">
                        Subtitle (optional)
                      </label>
                      <input
                        type="text"
                        value={question.subtitle || ""}
                        onChange={(e) =>
                          updateQuestion(index, { subtitle: e.target.value })
                        }
                        className="w-full px-6 py-4 text-xl bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter a subtitle or helper text"
                      />
                    </div>

                    {(question.question_type === "single_choice" ||
                      question.question_type === "multiple_choice") && (
                      <div className="space-y-4">
                        <label className="block text-xl font-medium text-white mb-3">
                          Options
                        </label>
                        <div className="space-y-3">
                          {question.options?.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-3"
                            >
                              <div
                                className={`w-6 h-6 ${
                                  question.question_type === "single_choice"
                                    ? "rounded-full"
                                    : "rounded"
                                } border-2 border-gray-600 flex items-center justify-center`}
                              >
                                {question.question_type === "single_choice" ? (
                                  <div className="w-3 h-3 rounded-full bg-gray-600" />
                                ) : (
                                  <svg
                                    className="w-4 h-4 text-gray-600"
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
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [
                                    ...(question.options || []),
                                  ];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(index, {
                                    options: newOptions,
                                  });
                                }}
                                className="flex-1 px-4 py-2 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(index, optionIndex)}
                                className="p-2 text-gray-400 hover:text-gray-300"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6" />
                            <input
                              type="text"
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addOption(index);
                                }
                              }}
                              className="flex-1 px-4 py-2 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Add new option (press Enter)"
                            />
                            <button
                              type="button"
                              onClick={() => addOption(index)}
                              className="p-2 text-gray-400 hover:text-gray-300"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <label className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={question.is_required}
                        onChange={(e) =>
                          updateQuestion(index, {
                            is_required: e.target.checked,
                          })
                        }
                        className="w-6 h-6 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-lg text-white">Required</span>
                    </label>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xl">
                  No questions added yet. Click the button above to add one.
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
              className="text-lg h-12 px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-lg h-12 px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditFormPage);
