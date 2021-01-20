import { executeCommand } from "./util";
import { ExitCode } from "@actions/core";

export const lsFiles = async (filePattern: string): Promise<string[]> => {
  const result = await executeCommand("git", ["ls-files", "-z", filePattern]);
  return splitNull(result.stdout);
};

export const compareFiles = async (baseRef: string): Promise<string[]> => {
  const result = await executeCommand("git", [
    "diff",
    "-z",
    `origin/${baseRef}`,
    "HEAD",
    "--diff-filter=AM",
    "--name-only",
    "--",
    "*.swift",
  ]);
  return splitNull(result.stdout);
};

export const diffFiles = async (): Promise<string[]> => {
  const result = await executeCommand("git", [
    "diff",
    "-z",
    "HEAD^",
    "--diff-filter=AM",
    "--name-only",
    "--",
    "*.swift",
  ]);
  return splitNull(result.stdout);
};

const splitNull = (s: string) => s.split("\0").filter((s) => s.length > 0);
