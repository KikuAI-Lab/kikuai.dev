# E2E Tests

This directory contains Playwright end-to-end tests for the KikuAI site.

## Test Files

- `home.spec.ts` - Tests for the home page (`/`)
- `projects.spec.ts` - Tests for the projects page (`/projects`)
- `about.spec.ts` - Tests for the about page (`/about`)

## Test Coverage

Each test file includes:

1. **Status Code Check**: Verifies the page returns 200 OK
2. **Content Verification**: Checks for key content blocks and headings
3. **Interactive Elements**: Tests clickable CTAs and links
4. **Console Errors**: Ensures no JavaScript errors in the console
5. **Accessibility**: Runs axe-core checks for serious/critical violations

## Running Tests

### Local Development

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run a specific test file
npx playwright test tests/home.spec.ts
```

### CI/CD

Tests run automatically on:
- Pull requests (when `kikuai-site/**` files change)
- Pushes to `main` branch (when `kikuai-site/**` files change)

Test reports are uploaded as artifacts in GitHub Actions.

## Accessibility Testing

Tests use `@axe-core/playwright` to check for:
- Serious accessibility violations
- Critical accessibility violations

Tests will fail if any serious or critical violations are found.

