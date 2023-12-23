2. Install Cypress and other project dependencies:
```bash
npm install
```

### Running the tests

To open the Cypress Test Runner, which provides you with a visual interface to run your tests:

```bash
npx cypress open
```

If you prefer to run the tests in the command line and get output in the terminal use:

```bash
npx cypress run
```

## Test Scenarios

The following test scenarios are covered:

- Testing minimum input values on "Taotlen üksi" tab.
- Testing for empty "Monthly Income" field to trigger a validation error.
- Testing for empty "Total Balance Existing Loans" field to trigger a validation error.
- Testing each option in the "Dependants Number" dropdown.
- Ensuring numeric input on "Total Monthly Obligations" field.
- Testing slider functionality for loan period selection.
- Preventing Cross-Site Scripting (XSS) attacks through input fields.
- Preventing SQL Injection through input fields.

## Built With

- [Cypress](https://www.cypress.io/) - The JavaScript End to End Testing Framework


## Authors

- **Anton Buketov** - [KotBegemotEST]([https://github.com/YourGitHubUsername](https://github.com/KotBegemotEST/CypressCoopTest))
