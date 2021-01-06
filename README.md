swift-format-action
====

# Example GitHub Action Workflow

## Lint only

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
        with:
          # Full git history is needed to get a proper list of changed files
          fetch-depth: 0
      - name: Lint
        uses: mtgto/swift-format-action
        with:
          configurationFile: .swift-format
          # default is false
          allFiles: true
```

## Commit & Push formatted code automatically

```yaml
```

# Environment variables

- LINTER_RULES_PATH
  - .swift-format or none

