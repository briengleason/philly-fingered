# Testing Guidelines

## Test-First Development

**All new features and changes must include tests.**

Before committing any changes:
1. ✅ Write tests for new functionality
2. ✅ Run tests to verify they pass
3. ✅ Ensure existing tests still pass
4. ✅ Only commit if all tests pass

## Automatic Test Execution

### Pre-commit Hook

A pre-commit hook automatically runs tests before each commit:
- ✅ If tests pass → commit proceeds
- ❌ If tests fail → commit is blocked

The hook uses `test/run-tests-sync.js` to run tests in Node.js.

### Running Tests Manually

**Option 1: Browser (Recommended for full testing)**
```bash
./test/run-tests.sh
```
Opens test page in browser with full DOM and Leaflet support.

**Option 2: Direct browser**
Open `test/run-tests-automated.html` in your browser.

**Option 3: Node.js (for pre-commit)**
```bash
node test/run-tests-sync.js
```

## Test Coverage

The test suite includes:

### Core Game Logic (25 tests)
- Distance calculations
- Score calculations  
- Location progression
- Game state management
- Edge cases
- Integration tests

### Share Functionality (17 tests)
- Emoji mapping
- Date formatting
- Message generation

### Map Rendering & Visibility (23 tests)
- Container existence and visibility
- Configuration validation
- Tile layer setup
- Map instance checks

**Total: 65+ tests**

## Writing New Tests

Add tests to `test/game-tests.js`:

```javascript
suite.test('Feature name: should do X', () => {
    // Test code
    suite.assertEquals(actual, expected, 'Message if fails');
    suite.assert(condition, 'Message if fails');
    suite.assertApprox(actual, expected, tolerance, 'Message if fails');
});
```

### Test Best Practices

1. **Test names should be descriptive**: `'Feature: expected behavior'`
2. **One assertion per logical check**: Don't combine unrelated checks
3. **Test edge cases**: Boundary values, empty inputs, nulls
4. **Skip DOM tests gracefully**: Check if elements exist before testing
5. **Mock external dependencies**: Use mock data for isolated tests

## Skipping Tests

Some tests skip in certain environments:

```javascript
suite.test('DOM test', () => {
    if (typeof document !== 'undefined') {
        // Actual test
    } else {
        suite.assert(true, 'Skipped in Node.js');
    }
});
```

## Test Results

- ✅ **Green checkmark**: Test passed
- ❌ **Red X**: Test failed (with error message)
- **Skipped**: Test not applicable in current environment

## Continuous Integration

Tests run automatically:
- Before every commit (pre-commit hook)
- Should be run in CI/CD pipeline (future)

## Troubleshooting

**Tests fail in pre-commit but pass in browser:**
- Node.js tests skip DOM-dependent tests
- Run full suite in browser: `./test/run-tests.sh`

**Pre-commit hook not running:**
```bash
chmod +x .git/hooks/pre-commit
```

**Need to skip tests temporarily (not recommended):**
```bash
git commit --no-verify
```

## Adding Tests for New Features

When adding a new feature:

1. **Add tests first** (TDD approach)
2. **Test the feature** (should fail initially)
3. **Implement the feature**
4. **Run tests** (should pass now)
5. **Commit** (pre-commit hook will verify)

Example workflow:
```bash
# 1. Add test
# Edit test/game-tests.js

# 2. Run tests (should fail)
node test/run-tests-sync.js

# 3. Implement feature
# Edit index.html

# 4. Run tests (should pass)
node test/run-tests-sync.js

# 5. Commit (pre-commit will run tests again)
git add .
git commit -m "Add new feature with tests"
```
