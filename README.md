swift-format-action
====

GitHub Action to run [apple/swift-format](https://github.com/apple/swift-format).

NOTE: This repository includes the executable binary of the `swift-format` which distributed under Apache License 2.0.
See `LICENSES/LICENSE.txt`.

# GitHub Action Workflow Examples

## Lint only

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
        with:
          # Full git history is needed to get a proper list of changed files
          fetch-depth: 0
      - name: Lint
        uses: mtgto/swift-format-action@main
        with:
          # Please comment out if you won't specify configuration file
          configuration_file: .swift-format
          # default is false
          all_files: false
          # default is -1 (infinity)
          max_warnings: -1
```

## Format code automatically

```yaml
on:
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Auto Correct
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
        with:
          # Full git history is needed to get a proper list of changed files
          fetch-depth: 0
      - name: Lint
        uses: mtgto/swift-format-action@main
        with:
          # Please comment out if you won't specify configuration file
          configuration_file: .swift-format
          # default is false
          all_files: false
          # default is false
          auto_correct: true
          # default is -1 (infinity)
          max_warnings: -1
```

## License

MIT License
