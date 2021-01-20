import { lsFiles } from "../git";

test("collect swift files from git repository", async () => {
  await expect(lsFiles("*.swift")).resolves.toEqual([
    "src/__tests__/testdata/Warning.swift",
    "src/__tests__/testdata/foo bar/Test.swift",
  ]);
});
