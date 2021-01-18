import * as core from "@actions/core";
import { execFile, spawn } from "child_process";
import { promisify } from "util";

const getInputString = (name: string, defaultValue: string): string => {
  const value = core.getInput(name);
  if (value === "") {
    return defaultValue;
  }
  return value;
};

const getInputBoolean = (name: string, defaultValue: boolean): boolean => {
  const stringValue = getInputString(name, String(defaultValue));
  if (stringValue.match(/^y|Y|yes|Yes|true|True|on|On|ON$/)) {
    return true;
  } else if (stringValue.match(/^n|N|no|No|false|False|no|No|NO$/)) {
    return false;
  }
  throw Error(`${stringValue} is not a valid boolean value`);
};

const getInputNumber = (name: string, defaultValue: number): number => {
  const stringValue = getInputString(name, String(defaultValue));
  const value = Number.parseInt(stringValue);
  if (value === NaN) {
    throw Error(`${stringValue} is not a valid number value`);
  }
  return value;
};

const executeCommand = (
  command: string,
  args: ReadonlyArray<string> = []
): Promise<{ stdout: string; stderr: string; code: number }> => {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    const process = spawn(command, args);
    process.stdout.on("data", (data) => (stdout += data));
    process.stderr.on("data", (data) => (stderr += data));
    process.on("close", (code) => {
      resolve({ stdout, stderr, code: code ?? core.ExitCode.Failure });
    });
  });
};

const configurationFile = getInputString("configuration_file", "");
const allFiles = getInputBoolean("all_files", false);
const autoCorrect = getInputBoolean("auto_correct", false);
const maxWarnings = getInputNumber("max_warnings", -1);

const run = async () => {
  await executeCommand("git", ["version"]).then((result) =>
    console.log(result)
  );
  await executeCommand("ls", ["-l"]).then((result) => console.log(result));
  await executeCommand("./swift-format", ["--version"]).then((result) =>
    console.log(result)
  );
};

run();
