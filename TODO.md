# TODO

## LabDetails.jsx fix
- [x] Inspect existing `Frontend/src/pages/LabDetails.jsx` and identify syntax/runtime issues.
- [ ] Implement corrected screenshot handling in `LabDetails.jsx`:
  - [ ] Fix broken JSX: currently `onClick` contains an invalid inline function definition.
  - [ ] Reuse the existing `takeScreenshot` function instead of redefining inside JSX.
  - [ ] Wire `loadingScreenshot` to UI (disable button / show loader) and ensure proper state updates.
  - [ ] Ensure `takeScreenshot` is declared with proper indentation and uses `setLoadingScreenshot`.
- [ ] Run frontend build/lint (if available) to confirm no syntax errors.

