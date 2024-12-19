# Changelog

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
