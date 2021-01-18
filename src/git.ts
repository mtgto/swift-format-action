import { executeCommand } from "./util";
import * as core from "@actions/core";

export const lsFiles = async (filePattern: string): Promise<string[]> => {
  const result = await executeCommand("git", ["ls-files", "-z", filePattern]);
  if (result.code !== core.ExitCode.Success) {
    throw Error(`git returns non-zero code: ${result.code}`);
  }
  return result.stdout.split("\0").filter((s) => s.length > 0);
};
