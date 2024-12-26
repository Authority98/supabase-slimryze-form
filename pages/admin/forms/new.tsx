import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabase";
import { withAuth } from "../../../utils/withAuth";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../components/ui/button";
import {
  Plus,
  Loader2,
  X,
  ChevronDown,
  ArrowLeft,
  GripVertical,
  Settings,
  AlertCircle,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type QuestionInput = {
  id: string;
  question_text: string;
  subtitle?: string;
  question_type: "text" | "single_choice" | "multiple_choice" | "disqualifier";
  is_required: boolean;
  options?: string[];
};

function NewFormPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [hasDisqualifier, setHasDisqualifier] = useState(false);
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [newOptionText, setNewOptionText] = useState<string>("");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
    null
  );
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Generate unique ID for questions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Handle question reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const addQuestion = (type: QuestionInput["question_type"]) => {
    const newQuestion: QuestionInput = {
      id: generateId(),
      question_text: "",
      subtitle: "",
      question_type: type,
      is_required: true,
      options:
        type === "single_choice" || type === "multiple_choice" ? [] : undefined,
    };

    setQuestions([...questions, newQuestion]);
    setActiveQuestionIndex(questions.length);
    setShowQuestionTypes(false);
  };

  const updateQuestion = (index: number, updates: Partial<QuestionInput>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      setFormErrors(["At least one question is required"]);
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
    if (activeQuestionIndex === index) {
      setActiveQuestionIndex(null);
    }
  };

  const addOption = (questionIndex: number) => {
    if (!newOptionText.trim()) return;

    const question = questions[questionIndex];
    const currentOptions = question.options || [];

    if (currentOptions.length >= 10) {
      setFormErrors(["Maximum 10 options allowed per question"]);
      return;
    }

    updateQuestion(questionIndex, {
      options: [...currentOptions, newOptionText.trim()],
    });

    setNewOptionText("");
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    if ((question.options?.length || 0) <= 2) {
      setFormErrors(["At least 2 options are required for choice questions"]);
      return;
    }
    const newOptions = (question.options || []).filter(
      (_, i) => i !== optionIndex
    );
    updateQuestion(questionIndex, { options: newOptions });
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Form title is required");
    }

    if (questions.length === 0) {
      errors.push("At least one question is required");
    }

    questions.forEach((question, index) => {
      if (!question.question_text.trim()) {
        errors.push(`Question ${index + 1} text is required`);
      }

      if (
        (question.question_type === "single_choice" ||
          question.question_type === "multiple_choice") &&
        (!question.options || question.options.length < 2)
      ) {
        errors.push(`Question ${index + 1} requires at least 2 options`);
      }
    });

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Generate a unique permalink
      const permalink = `${title
        .toLowerCase()
        .replace(/\s+/g, "-")}-${Date.now()}`;

      // Create the form
      const { data: formData, error: formError } = await supabase
        .from("forms")
        .insert({
          title,
          has_disqualifier: hasDisqualifier,
          permalink,
          user_id: user?.id,
        })
        .select()
        .single();

      if (formError) throw formError;

      // Format questions data for insertion
      const questionsData = questions.map((q, index) => ({
        form_id: formData.id,
        question_text: q.question_text,
        subtitle: q.subtitle || null,
        question_type: q.question_type,
        is_required: q.is_required,
        options: q.options && q.options.length > 0 ? q.options : null,
        question_order: index,
      }));

      // Create the questions
      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsData);

      if (questionsError) throw questionsError;

      router.push("/admin");
    } catch (error: any) {
      console.error("Error creating form:", error);
      setFormErrors([
        error.message || "Failed to create form. Please try again.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold text-white mb-4">
            Create New Form
          </h1>
          <p className="text-xl text-gray-400">
            Design your form and add questions
          </p>
        </div>

        {formErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-red-500 mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside text-red-400 space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="max-w-3xl">
              <label className="block text-2xl font-medium text-white mb-4">
                Form Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 text-xl bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter a descriptive title for your form"
                required
              />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-medium text-white mb-2">
                  Form Settings
                </h2>
                <p className="text-gray-400">Configure your form's behavior</p>
              </div>
              <Settings className="w-6 h-6 text-gray-400" />
            </div>

            <label className="flex items-center space-x-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasDisqualifier}
                onChange={(e) => setHasDisqualifier(e.target.checked)}
                className="w-6 h-6 rounded border-gray-700 bg-gray-800 text-primary-500 focus:ring-primary-500"
              />
              <div>
                <span className="text-xl font-medium text-white group-hover:text-primary-500">
                  Enable Disqualifier Screen
                </span>
                <p className="text-gray-400 mt-1">
                  Show a special screen when certain conditions are met
                </p>
              </div>
            </label>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-medium text-white mb-2">
                  Questions
                </h2>
                <p className="text-gray-400">
                  Add and arrange your form questions
                </p>
              </div>
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
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 border border-gray-700">
                    <div className="p-3 border-b border-gray-700">
                      <h3 className="text-sm font-medium text-gray-400">
                        QUESTION TYPES
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => addQuestion("text")}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center"
                    >
                      <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center mr-3">
                        Aa
                      </span>
                      <div>
                        <div className="font-medium">Text Input</div>
                        <div className="text-sm text-gray-400">
                          Free form text response
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion("single_choice")}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center"
                    >
                      <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center mr-3">
                        ○
                      </span>
                      <div>
                        <div className="font-medium">Single Choice</div>
                        <div className="text-sm text-gray-400">
                          Select one option
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion("multiple_choice")}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center"
                    >
                      <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center mr-3">
                        ☐
                      </span>
                      <div>
                        <div className="font-medium">Multiple Choice</div>
                        <div className="text-sm text-gray-400">
                          Select multiple options
                        </div>
                      </div>
                    </button>
                    {hasDisqualifier && (
                      <button
                        type="button"
                        onClick={() => addQuestion("disqualifier")}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center"
                      >
                        <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center mr-3">
                          !
                        </span>
                        <div>
                          <div className="font-medium">Disqualifier</div>
                          <div className="text-sm text-gray-400">
                            Screen out respondents
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="questions"
                isDropDisabled={false}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
                type="DEFAULT"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-6"
                  >
                    {questions.map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative p-6 bg-gray-800/50 rounded-lg border border-gray-700 group"
                          >
                            <div
                              className="absolute left-4 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                              {...provided.dragHandleProps}
                            >
                              <GripVertical className="w-6 h-6 text-gray-500" />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <div className="space-y-5 pl-8">
                              <div className="flex items-center space-x-4">
                                <div className="bg-gray-700/50 px-3 py-1 rounded text-sm text-gray-400">
                                  {question.question_type.replace("_", " ")}
                                </div>
                                {question.is_required && (
                                  <div className="bg-primary-500/20 text-primary-500 px-3 py-1 rounded text-sm">
                                    Required
                                  </div>
                                )}
                              </div>

                              <div>
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
                                <input
                                  type="text"
                                  value={question.subtitle || ""}
                                  onChange={(e) =>
                                    updateQuestion(index, {
                                      subtitle: e.target.value,
                                    })
                                  }
                                  className="w-full px-6 py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                  placeholder="Add a subtitle or helper text (optional)"
                                />
                              </div>

                              {(question.question_type === "single_choice" ||
                                question.question_type ===
                                  "multiple_choice") && (
                                <div className="space-y-4">
                                  <label className="block text-lg font-medium text-white">
                                    Options
                                  </label>
                                  <div className="space-y-3">
                                    {question.options?.map(
                                      (option, optionIndex) => (
                                        <div
                                          key={optionIndex}
                                          className="flex items-center space-x-3"
                                        >
                                          <div
                                            className={`w-8 h-8 ${
                                              question.question_type ===
                                              "single_choice"
                                                ? "rounded-full"
                                                : "rounded-lg"
                                            } border-2 border-[#00C48F] bg-[#00C48F] flex items-center justify-center flex-shrink-0`}
                                          >
                                            {question.question_type ===
                                            "single_choice" ? (
                                              <div className="w-4 h-4 rounded-full bg-white" />
                                            ) : (
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
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [
                                                ...(question.options || []),
                                              ];
                                              newOptions[optionIndex] =
                                                e.target.value;
                                              updateQuestion(index, {
                                                options: newOptions,
                                              });
                                            }}
                                            className="flex-1 px-4 py-2 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder={`Option ${
                                              optionIndex + 1
                                            }`}
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeOption(index, optionIndex)
                                            }
                                            className="p-2 text-gray-400 hover:text-gray-300"
                                          >
                                            <X className="w-5 h-5" />
                                          </button>
                                        </div>
                                      )
                                    )}
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 flex-shrink-0" />
                                      <input
                                        type="text"
                                        value={newOptionText}
                                        onChange={(e) =>
                                          setNewOptionText(e.target.value)
                                        }
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

                              <label className="flex items-center space-x-4 cursor-pointer group">
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
                                <span className="text-lg text-white group-hover:text-primary-500">
                                  Required
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {questions.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  No questions yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Start by adding your first question
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuestionTypes(true)}
                  className="text-lg"
                >
                  Add Question
                </Button>
              </div>
            )}
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
                  Creating...
                </>
              ) : (
                "Create Form"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(NewFormPage);
