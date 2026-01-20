# Compliance Rules

This file contains the compliance and code quality rules for this repository.

## 1. Repository and Service Classes Must Follow Naming Conventions

**Objective:** Ensure consistency and discoverability by requiring repository classes to use 'Prisma<Entity>Repository' pattern and service classes to use '<Entity>Service' pattern, with filenames matching class names exactly in PascalCase

**Success Criteria:** Repository files are named 'Prisma<Entity>Repository.ts' with matching exported class names (e.g., PrismaAppRepository), and service files are named '<Entity>Service.ts' with matching class names (e.g., MembershipService)

**Failure Criteria:** Repository or service files use generic names like 'app.ts', use dot-suffixes like '.service.ts' or '.repository.ts', or have filename/class name mismatches

---

## 2. Prevent Circular Dependencies Between Core Packages

**Objective:** Maintain clear architectural boundaries and prevent circular dependencies by enforcing import restrictions between core packages (lib, app-store, features, trpc)

**Success Criteria:** The lib package does not import from app-store, features, or trpc; app-store does not import from features or trpc; features does not import from trpc; and trpc does not import from apps/web

**Failure Criteria:** Code contains imports that violate the dependency hierarchy, such as lib importing from features, app-store importing from trpc, or any other restricted cross-package imports

---

## 3. Use Biome for Code Formatting with Standardized Configuration

**Objective:** Ensure consistent code formatting across the entire codebase by using Biome with specific formatting rules for line width, indentation, quotes, and semicolons

**Success Criteria:** All TypeScript/JavaScript files use 110 character line width, 2-space indentation, LF line endings, double quotes for JSX, always include semicolons, use ES5 trailing commas, and always use arrow function parentheses

**Failure Criteria:** Code files deviate from the standard formatting rules, such as using single quotes in JSX, omitting semicolons, using different indentation widths, or exceeding line width limits

---

## 4. Default Exports Allowed Only in Next.js Page and Layout Files

**Objective:** Enforce named exports throughout the codebase for better refactoring and tree-shaking, while allowing default exports only where Next.js requires them (page.tsx and layout.tsx files)

**Success Criteria:** Files use named exports (export const, export function, export class) except for files matching patterns 'apps/web/app/**/page.tsx', 'apps/web/app/**/layout.tsx', and 'apps/web/app/pages/**/*.tsx' which may use default exports

**Failure Criteria:** Non-page/layout files use default exports, or page/layout files fail to export the required default component

---

## 5. Schema and Handler Files Must Be Separated with Type-Safe Patterns

**Objective:** Maintain separation of concerns and type safety by requiring schema definitions in separate '.schema.ts' files with both Zod schema and TypeScript type exports, while handlers in '.handler.ts' files use these typed schemas

**Success Criteria:** Schema files export both a TypeScript type (T<Operation>InputSchema) and a corresponding Zod schema (Z<Operation>InputSchema: z.ZodType<T<Operation>InputSchema>), and handler files import and use these typed schemas for validation

**Failure Criteria:** Schema and handler logic are mixed in the same file, schema files lack either TypeScript types or Zod schemas, or handler files perform validation without using the defined schemas

---

## 6. Lint Staged Files Before Commit with Error-on-Warnings Enforcement

**Objective:** Ensure code quality by running Biome linting on staged files before commits and treating warnings as errors unless explicitly skipped via SKIP_WARNINGS environment variable

**Success Criteria:** Pre-commit hook runs 'biome lint --error-on-warnings' on staged TypeScript/JavaScript files, 'biome format' on JSON files, and 'prisma format' on schema.prisma, and all checks pass before commit is allowed

**Failure Criteria:** Commits are made with linting warnings or formatting issues, staged files are not checked before commit, or the pre-commit hook is bypassed without proper justification

---

## 7. Environment Variables Must Not Be Accessed Directly in Non-Configuration Code

**Objective:** Prevent runtime errors and improve testability by avoiding direct process.env access in business logic and instead using centralized configuration modules or environment-specific checks

**Success Criteria:** Direct process.env access is limited to configuration files, environment detection utilities (isENVProd, isENVDev), and build-time configuration, while business logic receives environment values through dependency injection or configuration objects

**Failure Criteria:** Business logic, handlers, or service classes directly access process.env properties instead of using configuration abstractions or injected values

---

## 8. All Tests Must Use Vitest Framework and UTC Timezone

**Objective:** Ensure consistent test execution and prevent timezone-related bugs by standardizing on Vitest as the test framework and enforcing UTC timezone for all test runs

**Success Criteria:** Test files use Vitest syntax (vi.mock, vi.fn, describe, it, expect), test commands set TZ=UTC environment variable, and tests do not depend on local timezone settings

**Failure Criteria:** Tests use Jest-specific APIs, test commands omit TZ=UTC setting, or tests fail when run in different timezones

---

## 9. React Components Must Use react-hook-form with Zod Schema Validation

**Objective:** Ensure consistent form handling and validation by requiring React Hook Form with Zod resolver for all form components, providing type-safe validation and error handling

**Success Criteria:** Form components use useForm hook with zodResolver, define Zod schemas for form validation, use Controller or register for form fields, and properly handle validation errors with error messages

**Failure Criteria:** Form components implement custom validation logic without react-hook-form, lack Zod schema validation, or fail to properly display validation errors to users

---

## 10. Custom Error Classes Must Use Hierarchical Structure with Typed Codes

**Objective:** Enable robust error handling and debugging by requiring custom error classes that extend base Error classes with typed error codes, HTTP status codes, and structured error information

**Success Criteria:** Error classes extend from base error types (HttpError, CalendarAppError, ErrorWithCode), include typed error codes for categorization, provide statusCode for HTTP errors, and include relevant context (URL, method, cause)

**Failure Criteria:** Code throws generic Error objects, lacks error categorization, omits HTTP status codes for API errors, or fails to include sufficient debugging context

---
