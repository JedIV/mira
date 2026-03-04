# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vite-based React frontend for the Mira demo dashboard. Main application code lives in `src/`. Use `src/pages/` for route-level screens, `src/components/` for reusable UI, `src/layouts/` for shared shells, `src/data/` for mock datasets, and `src/utils/` for helpers. Static assets that are bundled belong in `src/assets/`; public files such as `public/favicon.svg` are served as-is. Build output is generated in `dist/` and should not be edited manually.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Use `npm run dev` to start the local Vite server (default: `http://localhost:5173`). Run `npm run build` to create a production bundle in `dist/`. Use `npm run preview` to serve the built bundle locally for a final check. `npm start` serves `dist/` with `serve` and is the production-style entrypoint used for deployment.

## Coding Style & Naming Conventions
Follow the existing codebase style: 2-space indentation, ES modules, and React function components. Name components and page files in PascalCase (`AgentDetail.jsx`), utilities and data modules in camelCase (`formatters.js`, `platforms.js`), and keep component folders grouped by feature (`components/common`, `components/navigation`, `components/charts`). Prefer relative imports that stay within `src/`. Tailwind CSS is available; keep utility usage readable and avoid mixing unrelated layout and state logic in large page files.

## Testing Guidelines
There is currently no automated test suite or `npm test` script. Until one is added, verify changes by running `npm run dev` during development and `npm run build` before opening a pull request. For UI work, manually check affected routes, navigation flows, and charts. If you add tests later, keep them next to the code they cover using `*.test.jsx` or `*.spec.jsx`.

## Commit & Pull Request Guidelines
Recent commits use short, plain-language summaries such as `updating links` and `fixing behavior screen`. Keep commit messages brief, specific, and focused on one change. Pull requests should include a short description, note any affected screens or routes, link related issues when available, and include screenshots for visible UI changes. Confirm the production build passes before requesting review.

## Configuration Notes
Core project configuration is in `vite.config.js`, `tailwind.config.js`, and `postcss.config.js`. This project uses mock data only, so avoid introducing secrets or environment-specific values unless deployment requirements change.
