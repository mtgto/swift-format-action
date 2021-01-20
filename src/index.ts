import {
  executeCommand,
  getInputBoolean,
  getInputNumber,
  getInputString,
} from "./util";
import {
  ExitCode,
  warning as printWarning,
  error as printError,
} from "@actions/core";
import { compareFiles, diffFiles, lsFiles } from "./git";
import { exit } from "process";
import { tmpdir } from "os";
import * as path from "path";
import { parseOutput } from "./swift-format";

const configurationFile = getInputString("configuration_file", "");
const allFiles = getInputBoolean("all_files", false);
const autoCorrect = getInputBoolean("auto_correct", false);
const maxWarnings = getInputNumber("max_warnings", -1);
const githubBaseRef = process.env.GITHUB_BASE_REF ?? "";

const run = async () => {
  try {
    // Download swift-format from author's Google Drive
    const swiftFormat = path.join(tmpdir(), "swift-format");
    await executeCommand("sh", [
      "-c",
      `wget -q -O - "https://docs.google.com/uc?export=download&id=1Pq0P41fVYnFfOarwNTh-EQOevBbVbqYQ" | tar zxf - -C ${tmpdir()} --strip-components 1 swift-format-5.3/swift-format`,
      //`cat swift-format-5.3.tar.xz | tar zxf - -C ${tmpdir()} --strip-components 1 swift-format-5.3/swift-format`,
    ]);

    let args: string[] = [];
    if (autoCorrect) {
      args.push("format", "--in-place");
    } else {
      args.push("lint");
    }
    if (configurationFile.length > 0) {
      args.push("--configuration", configurationFile);
    }
    // collect swift files
    let sources: string[];
    if (allFiles) {
      sources = await lsFiles("*.swift");
    } else if (githubBaseRef.length > 0) {
      // pull request
      await executeCommand("git", [
        "fetch",
        "--depth",
        "1",
        "origin",
        githubBaseRef,
      ]);
      sources = await compareFiles(githubBaseRef);
    } else {
      sources = await diffFiles();
    }

    if (sources.length === 0) {
      exit;
    }
    const result = await executeCommand(swiftFormat, args.concat(sources));
    const lintResult = parseOutput(
      process.env.GITHUB_WORKSPACE ?? "",
      result.stderr
    );
    lintResult.errors.forEach((alert) => {
      printError(
        `file=${alert.path},line=${alert.line},col=${alert.col}::${alert.message}`
      );
    });
    lintResult.warnings.forEach((alert) => {
      printWarning(
        `file=${alert.path},line=${alert.line},col=${alert.col}::${alert.message}`
      );
    });

    if (maxWarnings !== -1 && lintResult.warnings.length > maxWarnings) {
      exit(ExitCode.Failure);
    }
  } catch (error) {
    console.error(`Unhandled error ${error}`);
    exit(ExitCode.Failure);
  }
};

run();
