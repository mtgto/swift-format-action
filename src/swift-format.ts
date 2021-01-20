import * as path from "path";

export type Alert = {
  readonly path: string;
  readonly line: number;
  readonly col: number;
  readonly message: string;
};

export type LintResult = {
  readonly warnings: Alert[];
  readonly errors: Alert[];
};

export const parseOutput = (cwd: string, output: string): LintResult => {
  let warnings: Alert[] = [];
  let errors: Alert[] = [];

  output.split("\n").forEach((line) => {
    if (line === "") {
      return;
    }
    const words = line.split(" ");
    const [filePath, lineString, colString] = words[0].split(":");
    const file = path.isAbsolute(filePath)
      ? path.relative(cwd, filePath)
      : filePath;
    const isWarning = words[1] === "warning:";
    const isError = words[1] === "error:";
    const message = words.slice(2).join(" ");
    if (isWarning) {
      warnings.push({
        path: file,
        line: Number(lineString),
        col: Number(colString),
        message,
      });
    } else if (isError) {
      errors.push({
        path: file,
        line: Number(lineString),
        col: Number(colString),
        message,
      });
    } else {
      throw new Error(`Fail to parse output of swift-format: "${line}"`);
    }
  });
  return { warnings, errors };
};
