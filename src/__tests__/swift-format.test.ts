import { parseOutput } from "../swift-format";

test("collect swift files from git repository", () => {
  const output = [
    "/home/mtgto/swift-format-action/src/__tests__/testdata/Warning.swift:1:15: warning: [Spacing]: remove 9 spaces",
    "src/__tests__/git.test.ts:2:1: error: file contains invalid or unrecognized Swift syntax.",
    "",
  ].join("\n");
  expect(parseOutput("/home/mtgto/swift-format-action", output)).toEqual({
    errors: [
      {
        col: 1,
        line: 2,
        message: "file contains invalid or unrecognized Swift syntax.",
        path: "src/__tests__/git.test.ts",
      },
    ],
    warnings: [
      {
        col: 15,
        line: 1,
        message: "[Spacing]: remove 9 spaces",
        path: "src/__tests__/testdata/Warning.swift",
      },
    ],
  });
});
