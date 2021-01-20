import * as core from "@actions/core";
import { exec } from "@actions/exec";
import { Transform, Writable } from "stream";

export const getInputString = (name: string, defaultValue: string): string => {
  const value = core.getInput(name);
  if (value === "") {
    return defaultValue;
  }
  return value;
};

export const getInputBoolean = (
  name: string,
  defaultValue: boolean,
): boolean => {
  const stringValue = getInputString(name, String(defaultValue));
  if (stringValue.match(/^y|Y|yes|Yes|true|True|on|On|ON$/)) {
    return true;
  } else if (stringValue.match(/^n|N|no|No|false|False|no|No|NO$/)) {
    return false;
  }
  throw Error(`${stringValue} is not a valid boolean value`);
};

export const getInputNumber = (name: string, defaultValue: number): number => {
  const stringValue = getInputString(name, String(defaultValue));
  const value = Number.parseInt(stringValue);
  if (isNaN(value)) {
    throw Error(`${stringValue} is not a valid number value`);
  }
  return value;
};

export const executeCommand = async (
  command: string,
  args: string[] = [],
): Promise<{ stdout: string; stderr: string; code: number }> => {
  let stdout: string = "";
  let stderr: string = "";
  const code = await exec(command, args, {
    listeners: {
      stdout: (data: Buffer) => {
        stdout += data.toString();
      },
      stderr: (data: Buffer) => {
        stderr += data.toString();
      },
    },
  });
  return { stdout, stderr, code };
};
