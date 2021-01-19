import {
  getInputString,
  getInputBoolean,
  getInputNumber,
  executeCommand,
} from "./util";
import { ExitCode } from "@actions/core";
import { lsFiles } from "./git";
import { exit } from "process";

const configurationFile = getInputString("configuration_file", "");
const allFiles = getInputBoolean("all_files", false);
const autoCorrect = getInputBoolean("auto_correct", false);
const maxWarnings = getInputNumber("max_warnings", -1);

const run = async () => {
  try {
    if (allFiles) {
      const files = await lsFiles("*.swift");
    }
    await executeCommand("git", ["version"]).then((result) =>
      console.log(result)
    );
    await executeCommand("swift-format", []).then((result) =>
      console.log(result)
    );
    await executeCommand("./swift-format", ["--version"]).then((result) =>
      console.log(result)
    );
  } catch (error) {
    console.error(`Unhandled error ${error}`);
    exit(ExitCode.Failure);
  }
};

run();
