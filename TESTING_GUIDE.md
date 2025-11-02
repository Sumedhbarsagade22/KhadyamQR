# Testing Guide for KhadyamQR

This guide covers all testing aspects of the KhadyamQR project, including unit tests, integration tests, and TestSprite integration.

## Test Stack

- **Framework**: Vitest
- **Mocking**: Vitest's built-in mocking
- **AI Testing**: TestSprite MCP integration
- **Coverage**: Built-in Vitest coverage

## Running Tests

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test -- --watch
```

### Run Tests with Coverage

```bash
pnpm test -- --coverage
```

### Run Specific Test File

```bash
pnpm test server/routes/admin.spec.ts
```

### Run Tests Matching Pattern

```bash
pnpm test -- --grep "restaurant"
```

## Test Structure

### Current Test Files

```
KhadyamQR/
├── client/
│   └── lib/
│       └── utils.spec.ts          # Utility function tests
├── server/
│   └── routes/
│       ├── admin.spec.ts          # Restaurant admin API tests
│       └── menu.spec.ts           # Menu item API tests
└── shared/
    └── api.spec.ts                # Shared types and constants tests
```

## Test Coverage

### Server Routes - Admin (`server/routes/admin.spec.ts`)

**Covered Endpoints:**
- ✅ `GET /api/restaurants` - List all restaurants
- ✅ `POST /api/restaurants` - Create restaurant (with/without logo)
- ✅ `POST /api/restaurants/qr` - Upload QR code
- ✅ `DELETE /api/restaurants/:id` - Delete restaurant
- ✅ `PATCH /api/restaurants/:id/status` - Toggle restaurant status
- ✅ `POST /api/restaurants/:id/login` - Create restaurant login

**Test Scenarios:**
- Valid requests with correct data
- Missing required parameters
- Invalid data types
- Database errors
- File upload (logo, QR code)
- Rollback on failure (auth user creation)

### Server Routes - Menu (`server/routes/menu.spec.ts`)

**Covered Endpoints:**
- ✅ `GET /api/restaurants/:restaurantId/menu-items` - List menu items
- ✅ `POST /api/restaurants/:restaurantId/menu-items` - Create menu item
- ✅ `DELETE /api/menu-items/:itemId` - Delete menu item
- ✅ `PATCH /api/menu-items/:itemId/availability` - Toggle availability

**Test Scenarios:**
- Menu item CRUD operations
- Image upload and deletion
- Category validation
- Price validation
- Availability toggling
- Restaurant validation
- Error handling

### Shared Types (`shared/api.spec.ts`)

**Covered:**
- ✅ MENU_CATEGORIES constant
- ✅ MenuCategory type
- ✅ Read-only enforcement
- ✅ Unique values validation

### Client Utils (`client/lib/utils.spec.ts`)

**Covered:**
- ✅ `cn()` function - Class name merging
- ✅ Conditional classes
- ✅ Tailwind class merging
- ✅ Object notation support

## Writing New Tests

### Unit Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Feature Name", () => {
  beforeEach(() => {
    // Reset state before each test
    vi.clearAllMocks();
  });

  it("should do something", () => {
    // Arrange
    const input = "test";
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe("expected");
  });
});
```

### API Route Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

vi.mock("../lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      // ... other methods
    })),
  },
}));

describe("API Route", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = { json: jsonMock, status: statusMock as any };
    vi.clearAllMocks();
  });

  it("should handle request", async () => {
    mockReq.body = { name: "test" };
    
    await myHandler(mockReq as Request, mockRes as Response, vi.fn());
    
    expect(jsonMock).toHaveBeenCalledWith(expectedData);
  });
});
```

## TestSprite Integration

### Using TestSprite for AI-Powered Testing

TestSprite is configured via MCP and can help with:

1. **Test Generation**: Generate additional test cases
2. **Edge Case Discovery**: Find scenarios you might have missed
3. **Test Analysis**: Analyze coverage gaps
4. **Debugging**: Help debug failing tests

### Example TestSprite Prompts

**Generate Tests:**
```
"Generate comprehensive tests for the PublicMenu component"
```

**Find Edge Cases:**
```
"What edge cases should I test for the QR code upload functionality?"
```

**Analyze Coverage:**
```
"Analyze test coverage for the menu item creation flow"
```

**Debug Failing Test:**
```
"This test is failing: [paste test]. Help me debug it."
```

## Best Practices

### 1. Test Organization

- Group related tests with `describe` blocks
- Use descriptive test names: "should [expected behavior] when [condition]"
- Keep tests focused on one behavior
- Use `beforeEach` for common setup

### 2. Mocking

- Mock external dependencies (Supabase, file system, etc.)
- Clear mocks between tests with `vi.clearAllMocks()`
- Mock at the module level for consistency
- Verify mock calls with `expect().toHaveBeenCalledWith()`

### 3. Assertions

- Use specific assertions (`toBe`, `toEqual`, `toContain`)
- Test both success and error cases
- Verify status codes for API routes
- Check error messages for clarity

### 4. Coverage Goals

- Aim for 80%+ code coverage
- Focus on critical paths first
- Don't test implementation details
- Test user-facing behavior

## Integration Testing

### Manual Integration Tests

While unit tests cover individual functions, integration tests verify the full flow:

1. **Restaurant Creation Flow**
   ```bash
   # Start dev server
   pnpm dev
   
   # Test in browser or with curl
   curl -X POST http://localhost:8080/api/restaurants \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Restaurant","slug":"test-restaurant"}'
   ```

2. **Menu Item Creation Flow**
   ```bash
   curl -X POST http://localhost:8080/api/restaurants/[ID]/menu-items \
     -H "Content-Type: application/json" \
     -d '{"name":"Burger","price":10.99,"category":"Main Course"}'
   ```

3. **QR Code Generation Flow**
   - Open admin page
   - Create restaurant
   - Click "Generate QR"
   - Verify QR code displays and saves

### E2E Testing (Future)

Consider adding Playwright or Cypress for full E2E tests:

```bash
# Install Playwright
pnpm add -D @playwright/test

# Example E2E test structure
tests/
  ├── e2e/
  │   ├── admin-flow.spec.ts
  │   ├── menu-management.spec.ts
  │   └── public-menu.spec.ts
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm typecheck
```

## Troubleshooting

### Tests Failing Locally

1. **Clear node_modules and reinstall**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **Check Vitest version**
   ```bash
   pnpm list vitest
   ```

3. **Run with verbose output**
   ```bash
   pnpm test -- --reporter=verbose
   ```

### Mock Issues

1. **Mock not working**: Ensure `vi.mock()` is at the top level
2. **Mock not resetting**: Add `vi.clearAllMocks()` to `beforeEach`
3. **Type errors**: Use `as ReturnType<typeof vi.fn>` for type safety

### Coverage Issues

1. **Low coverage**: Run with `--coverage` to see uncovered lines
2. **Exclude files**: Add to `vitest.config.ts`:
   ```typescript
   coverage: {
     exclude: ['**/*.spec.ts', '**/node_modules/**']
   }
   ```

## Next Steps

### Recommended Additional Tests

1. **Client Components**
   - `client/pages/Admin.tsx` - Admin page component
   - `client/pages/PublicMenu.tsx` - Public menu display
   - `client/components/ImagePreview.tsx` - Image preview modal

2. **Client Utilities**
   - `client/lib/supabase.ts` - Supabase client setup
   - `client/lib/auth.ts` - Authentication helpers

3. **Server Utilities**
   - `server/lib/supabase.ts` - Supabase admin client

4. **Integration Tests**
   - Full restaurant creation flow
   - Menu management flow
   - QR code generation and display
   - Public menu access

5. **E2E Tests**
   - User journey: Create restaurant → Add menu items → Generate QR → View public menu
   - Error handling flows
   - Image upload flows

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Vitest API Reference](https://vitest.dev/api/)
- [TestSprite Documentation](https://testsprite.com/docs)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Summary

You now have:
- ✅ 4 test files with 40+ test cases
- ✅ Comprehensive API route coverage
- ✅ Shared types validation
- ✅ Utility function tests
- ✅ TestSprite integration ready
- ✅ Testing documentation

Run `pnpm test` to execute all tests!
