# TypeScript Code Style Guide

- **Strict Mode:** Always use `strict: true` in `tsconfig.json`.
- **Types:** Explicitly define types for function parameters and return values. Avoid `any`.
- **Interfaces vs Types:** Prefer `interface` for object shapes. Use `type` for unions and intersections.
- **Naming:** `PascalCase` for types/interfaces/classes, `camelCase` for variables/functions.
- **Exports:** Prefer named exports over default exports.
- **Null Checks:** Use optional chaining (`?.`) and nullish coalescing (`??`).