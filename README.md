# gakumas_calc

MVP for recommending six support cards that maximize general training score.

## Architecture

- `src/data`: JSON-based card, stage, and policy data
- `src/data/schemas`: JSON schema drafts for validating future datasets
- `src/domain/models`: Core TypeScript domain types
- `src/domain/scoring`: Pure scoring functions
- `src/domain/optimization`: Candidate pruning and deck search
- `src/components`: Minimal UI for input and results
- `src/app`: Next.js App Router entry point

## Notes

- Exam assumptions live in policy JSON, not inside card logic.
- Current scoring is approximate by design.
- `scoringPreset.default.json` is included as a separate data artifact for future policy composition.
- TODO comments mark future simulator and data-loading extension points.
