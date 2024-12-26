-- Drop the existing constraint
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_question_type_check;

-- Add the new constraint with our question types
ALTER TABLE questions ADD CONSTRAINT questions_question_type_check 
  CHECK (question_type IN ('text', 'single_choice', 'multiple_choice', 'disqualifier'));
