# Changelog

## [1.0.17] - 2024-01-09

### Added

- Added subtitle field to questions table in database
- Added subtitle input field in form creation/editing interface
- Added subtitle display in form preview
- Added keyboard navigation (up/down arrows) for question navigation
- Added navigation indicator at bottom left of form
- Added progress line at top of form that animates with question progress
- Added smooth animations for question transitions
- Added support for dragging and reordering questions in form creation
- Added validation for required fields and minimum options
- Added error messages display for form validation
- Added automatic progress tracking in form preview

### Changed

- Removed popup for form creation in favor of full-page interface
- Updated form preview styling to match frontend exactly:
  - Increased size of radio buttons and checkboxes (from 6px to 8px)
  - Updated colors to use #00C48F for selected state
  - Added proper hover states and transitions
  - Improved spacing and alignment
  - Updated input field width for better usability
  - Adjusted OK button size for better proportions
- Adjusted logo size and positioning (140px × 37px)
- Improved question transition animations (reduced to 300ms)
- Updated form creation UI elements to match frontend styling
- Enhanced form preview layout with centered questions
- Updated success and disqualified pages with consistent logo placement
- Improved mobile responsiveness and layout consistency

### Fixed

- Fixed database schema to properly support question types
- Fixed question type constraint in database
- Fixed logo display on success/disqualified pages
- Fixed form submission handling
- Fixed animation timing for smoother transitions
- Fixed question transition animations on navigation
- Fixed form validation for choice questions
- Fixed error handling in form submission
- Fixed layout issues in form preview
- Fixed Supabase authentication and database access

### Technical

- Implemented proper database migrations using Supabase CLI
- Added TypeScript types for form and question interfaces
- Improved state management for form creation
- Enhanced error handling and validation
- Added proper authentication checks
- Implemented proper database constraints and relationships

## [1.0.16] - 2024-01-09

### Changed

- Updated all references from "GLP-1s" to "SlimRyze" for consistent branding
- Updated medication interference message in Question #8

## [1.0.15] - 2024-01-09

### Changed

- Updated all disqualifier messages to follow a consistent, caring format
- Fixed question numbering in EmailInput component from #5 to #4
- Updated disqualifier messages for medications, age restriction, Type 1 Diabetes, thyroid cancer, kidney disease, and pregnancy
- Standardized message format to include "Thank you for taking the assessment" and "Your health and well-being are our top priority!"

## [1.0.14] - 2024-01-09

### Changed

- Updated success screen final message to "Get ready to transform with SlimRyze!"
- Removed sparkle emoji from final message for cleaner look

## [1.0.13] - 2024-01-09

### Changed

- Updated success screen with new congratulatory message
- Added prequalification status and success rate information
- Updated text about personalized plan and provider consultation
- Maintained emojis and button functionality

## [1.0.12] - 2024-01-09

### Changed

- Updated Question #12 to pregnancy question with new text
- Added disqualifier for pregnancy, breastfeeding, or planning pregnancy
- Updated disqualifier messages for pregnancy-related concerns
- Maintained emoji and Yes/No options

## [1.0.11] - 2024-01-09

### Changed

- Updated Question #11 to "Have you been diagnosed with kidney disease?"
- Added disqualifier for kidney disease diagnosis
- Updated disqualifier messages for kidney disease
- Maintained emoji and Yes/No options

## [1.0.10] - 2024-01-09

### Changed

- Updated Question #10 text to "Have you been diagnosed with thyroid cancer?"
- Updated disqualifier message to reflect personal diagnosis rather than family history
- Maintained emojis and disqualification for "Yes" answer

## [1.0.9] - 2024-01-09

### Changed

- Removed all medication disqualifiers from Question #8
- All medication options can now be selected without triggering disqualification
- Maintained multiple selection functionality and "Other" option

## [1.0.8] - 2024-01-09

### Fixed

- Fixed auto-proceed behavior to properly allow multiple health condition selections
- Users can now select multiple conditions before clicking OK to proceed

## [1.0.7] - 2024-01-09

### Changed

- Updated health conditions question (Question #9) to only disqualify for Type 1 Diabetes
- Updated list of health conditions to include Type 2 Diabetes, High blood pressure, High cholesterol, and Sleep apnea
- Added "Other" option with text input field for health conditions
- Improved disqualifier message for Type 1 Diabetes
- Added OK button with check mark for health conditions selection

## [1.0.6] - 2024-01-09

### Fixed

- Fixed OK button briefly appearing when selecting "None of the above" option

## [1.0.5] - 2024-01-09

### Added

- Restored emojis to medication question heading and description
- Added back explanatory text about GLP-1s interference

## [1.0.4] - 2024-01-09

### Changed

- Removed "(disqualifier)" text from medication options for cleaner UI

## [1.0.3] - 2024-01-09

### Fixed

- Fixed ReferenceError related to selectedMedications state
- Improved state management for medication selections
- Added proper synchronization between local and global state
- Fixed "Other" option handling with proper state updates

## [1.0.2] - 2024-01-09

### Added

- Text field input for "Other" medication option
- OK button with check mark icon for confirming selections
- Automatic state management for other medication input

## [1.0.1] - 2024-01-09

### Changed

- Updated medication question text and options
- Added new medication types: Metformin and Antidepressants
- Added "Other" option to medication selection
- Added "(disqualifier)" text to relevant medication options
- Removed blood-thinners and beta-blockers from options
- Updated disqualifier messages for new medication types

## [1.0.0] - 2024-01-09

### Added

- Extended disqualifier screen functionality to all medications in Question 8
- Added new medication types: corticosteroids and beta-blockers to disqualifier options
- Added corresponding messages and recommendations for each medication type

### Changed

- Updated `DisqualifierScreen.tsx` to include new medication types and messages
- Modified `MedicationsInput.tsx` to handle disqualification for all medication types
- Improved medication selection logic to show appropriate disqualifier screens

### Technical Details

- Added new types to `MedicationType`: "corticosteroids" and "beta-blockers"
- Updated state management in `MedicationsInput.tsx` to handle new medication types
- Implemented switch statement for better medication type handling
- Maintained consistent message format across all medication types
