import {
  getInputString,
  getInputBoolean,
  getInputNumber,
  executeCommand,
} from "./util";
import { ExitCode } from "@actions/core";
import { lsFiles } from "./git";
import { exit } from "process";
import { tmpdir } from "os";
import * as path from "path";

const configurationFile = getInputString("configuration_file", "");
const allFiles = getInputBoolean("all_files", false);
const autoCorrect = getInputBoolean("auto_correct", false);
const maxWarnings = getInputNumber("max_warnings", -1);

const run = async () => {
  try {
    // setup swift-format
    const swiftFormat = path.join(tmpdir(), "swift-format");
    await executeCommand("sh", [
      "-c",
      `wget -q -O - "https://docs.google.com/uc?export=download&id=1Pq0P41fVYnFfOarwNTh-EQOevBbVbqYQ" | tar zxf - -C ${tmpdir()} --strip-components 1 swift-format-5.3/swift-format`,
      //`cat swift-format-5.3.tar.xz | tar zxf - -C ${tmpdir()} --strip-components 1 swift-format-5.3/swift-format`,
    ]);
    await executeCommand(swiftFormat, ["--version"]);
    exit(1);
    if (allFiles) {
      const files = await lsFiles("*.swift");
    }
    await executeCommand("git", ["version"]).then((result) =>
      console.log(result)
    );
    // 'https://docs.google.com/uc?export=download&id=1Pq0P41fVYnFfOarwNTh-EQOevBbVbqYQ'
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
