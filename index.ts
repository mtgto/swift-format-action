import * as core from "@actions/core";

const getInputString = (name: string, defaultValue: string): string => {
  const value = core.getInput(name);
  if (value === "") {
    return defaultValue;
  }
  return value;
};

const getInputBool = (name: string, defaultValue: boolean): boolean => {
  const stringValue = getInputString(name, String(defaultValue));
  return false;
};

const configurationFile = getInputString("configuration_file", "");
console.log(`configurationFile = ${configurationFile}`);

console.log(`allFiles = ${getInputString("all_files", "")}`);
console.log(`autoCorrect = ${getInputString("auto_correct", "")}`);
console.log(`maxWarnings = ${getInputString("max_warnings", "")}`);
