swift-format-action
====

GitHub Action to run [apple/swift-format](https://github.com/apple/swift-format).

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
      - uses: actions/checkout@v6

      - uses: mtgto/swift-format-action@v1.1.0
        with:
          # Please comment out if you won't specify configuration file
          configuration_file: .swift-format
          # default is false
          all_files: false
          # default is -1 (infinity)
          max_warnings: -1
```

Warnings are reported as annotations on the pull request.
They are not treated as failures unless you set `max_warnings` (for example `max_warnings: 0`).

<img src="docs/images/lint-annotations.png" alt="Lint warnings shown as annotations in the Files changed tab of a pull request" width="800">

See [mtgto/example-swift-format-action#1](https://github.com/mtgto/example-swift-format-action/pull/1) for a live example.

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
      - uses: actions/checkout@v6
      - uses: mtgto/swift-format-action@v1.1.0
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

`auto_correct` only rewrites the files in the working tree (`swift-format format --in-place`).
It does not commit or push the result, so add a step after it to use the changes.
For example, show the diff:

```yaml
      - run: git diff
```

```diff
--- a/Sources/Example/Greeter.swift
+++ b/Sources/Example/Greeter.swift
@@ -1,14 +1,14 @@
 struct Greeter {
-    var name: String
-    var greeting = "Hello"
+  var name: String
+  var greeting = "Hello"
 
-    func greet() -> String {
-        let message = "\(greeting), \(name)!"
-        return message
-    }
+  func greet() -> String {
+    let message = "\(greeting), \(name)!"
+    return message
+  }
 }
```

See [mtgto/example-swift-format-action](https://github.com/mtgto/example-swift-format-action) for the workflows used in these examples.

## License

MIT License
