var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS((exports2) => {
  "use strict";
  Object.defineProperty(exports2, "__esModule", {value: true});
  function toCommandValue(input) {
    if (input === null || input === void 0) {
      return "";
    } else if (typeof input === "string" || input instanceof String) {
      return input;
    }
    return JSON.stringify(input);
  }
  exports2.toCommandValue = toCommandValue;
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var os = __importStar(require("os"));
  var utils_1 = require_utils();
  function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
  }
  exports2.issueCommand = issueCommand;
  function issue(name, message = "") {
    issueCommand(name, {}, message);
  }
  exports2.issue = issue;
  var CMD_STRING = "::";
  var Command = class {
    constructor(command, properties, message) {
      if (!command) {
        command = "missing.command";
      }
      this.command = command;
      this.properties = properties;
      this.message = message;
    }
    toString() {
      let cmdStr = CMD_STRING + this.command;
      if (this.properties && Object.keys(this.properties).length > 0) {
        cmdStr += " ";
        let first = true;
        for (const key in this.properties) {
          if (this.properties.hasOwnProperty(key)) {
            const val = this.properties[key];
            if (val) {
              if (first) {
                first = false;
              } else {
                cmdStr += ",";
              }
              cmdStr += `${key}=${escapeProperty(val)}`;
            }
          }
        }
      }
      cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
      return cmdStr;
    }
  };
  function escapeData(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  }
  function escapeProperty(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS((exports2) => {
  "use strict";
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var fs = __importStar(require("fs"));
  var os = __importStar(require("os"));
  var utils_1 = require_utils();
  function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
      throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
      encoding: "utf8"
    });
  }
  exports2.issueCommand = issueCommand;
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS((exports2) => {
  "use strict";
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports2 && exports2.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var command_1 = require_command();
  var file_command_1 = require_file_command();
  var utils_1 = require_utils();
  var os = __importStar(require("os"));
  var path = __importStar(require("path"));
  var ExitCode4;
  (function(ExitCode5) {
    ExitCode5[ExitCode5["Success"] = 0] = "Success";
    ExitCode5[ExitCode5["Failure"] = 1] = "Failure";
  })(ExitCode4 = exports2.ExitCode || (exports2.ExitCode = {}));
  function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env["GITHUB_ENV"] || "";
    if (filePath) {
      const delimiter = "_GitHubActionsFileCommandDelimeter_";
      const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
      file_command_1.issueCommand("ENV", commandValue);
    } else {
      command_1.issueCommand("set-env", {name}, convertedVal);
    }
  }
  exports2.exportVariable = exportVariable;
  function setSecret(secret) {
    command_1.issueCommand("add-mask", {}, secret);
  }
  exports2.setSecret = setSecret;
  function addPath(inputPath) {
    const filePath = process.env["GITHUB_PATH"] || "";
    if (filePath) {
      file_command_1.issueCommand("PATH", inputPath);
    } else {
      command_1.issueCommand("add-path", {}, inputPath);
    }
    process.env["PATH"] = `${inputPath}${path.delimiter}${process.env["PATH"]}`;
  }
  exports2.addPath = addPath;
  function getInput2(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
    if (options && options.required && !val) {
      throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
  }
  exports2.getInput = getInput2;
  function setOutput(name, value) {
    command_1.issueCommand("set-output", {name}, value);
  }
  exports2.setOutput = setOutput;
  function setCommandEcho(enabled) {
    command_1.issue("echo", enabled ? "on" : "off");
  }
  exports2.setCommandEcho = setCommandEcho;
  function setFailed(message) {
    process.exitCode = ExitCode4.Failure;
    error(message);
  }
  exports2.setFailed = setFailed;
  function isDebug() {
    return process.env["RUNNER_DEBUG"] === "1";
  }
  exports2.isDebug = isDebug;
  function debug(message) {
    command_1.issueCommand("debug", {}, message);
  }
  exports2.debug = debug;
  function error(message) {
    command_1.issue("error", message instanceof Error ? message.toString() : message);
  }
  exports2.error = error;
  function warning(message) {
    command_1.issue("warning", message instanceof Error ? message.toString() : message);
  }
  exports2.warning = warning;
  function info(message) {
    process.stdout.write(message + os.EOL);
  }
  exports2.info = info;
  function startGroup(name) {
    command_1.issue("group", name);
  }
  exports2.startGroup = startGroup;
  function endGroup() {
    command_1.issue("endgroup");
  }
  exports2.endGroup = endGroup;
  function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      startGroup(name);
      let result;
      try {
        result = yield fn();
      } finally {
        endGroup();
      }
      return result;
    });
  }
  exports2.group = group;
  function saveState(name, value) {
    command_1.issueCommand("save-state", {name}, value);
  }
  exports2.saveState = saveState;
  function getState(name) {
    return process.env[`STATE_${name}`] || "";
  }
  exports2.getState = getState;
});

// src/util.ts
var core = __toModule(require_core());
var import_child_process = __toModule(require("child_process"));
var getInputString = (name, defaultValue) => {
  const value = core.getInput(name);
  if (value === "") {
    return defaultValue;
  }
  return value;
};
var getInputBoolean = (name, defaultValue) => {
  const stringValue = getInputString(name, String(defaultValue));
  if (stringValue.match(/^y|Y|yes|Yes|true|True|on|On|ON$/)) {
    return true;
  } else if (stringValue.match(/^n|N|no|No|false|False|no|No|NO$/)) {
    return false;
  }
  throw Error(`${stringValue} is not a valid boolean value`);
};
var getInputNumber = (name, defaultValue) => {
  const stringValue = getInputString(name, String(defaultValue));
  const value = Number.parseInt(stringValue);
  if (isNaN(value)) {
    throw Error(`${stringValue} is not a valid number value`);
  }
  return value;
};
var executeCommand = (command, args = []) => {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    const process2 = import_child_process.spawn(command, args);
    process2.stdout.on("data", (data) => stdout += data);
    process2.stderr.on("data", (data) => stderr += data);
    process2.on("close", (code) => {
      resolve({stdout, stderr, code: code != null ? code : core.ExitCode.Failure});
    });
  });
};

// src/index.ts
var import_core2 = __toModule(require_core());

// src/git.ts
var import_core = __toModule(require_core());
var lsFiles = async (filePattern) => {
  const result = await executeCommand("git", ["ls-files", "-z", filePattern]);
  if (result.code !== import_core.ExitCode.Success) {
    throw Error(`git returns non-zero code: ${result.code}`);
  }
  return result.stdout.split("\0").filter((s) => s.length > 0);
};

// src/index.ts
var import_process = __toModule(require("process"));
var configurationFile = getInputString("configuration_file", "");
var allFiles = getInputBoolean("all_files", false);
var autoCorrect = getInputBoolean("auto_correct", false);
var maxWarnings = getInputNumber("max_warnings", -1);
var run = async () => {
  try {
    if (allFiles) {
      const files = await lsFiles("*.swift");
    }
    await executeCommand("git", ["version"]).then((result) => console.log(result));
    await executeCommand("swift-format", []).then((result) => console.log(result));
    await executeCommand("./swift-format", ["--version"]).then((result) => console.log(result));
  } catch (error) {
    console.error(`Unhandled error ${error}`);
    import_process.exit(import_core2.ExitCode.Failure);
  }
};
run();
