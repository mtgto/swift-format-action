#!/bin/bash -eu
arguments=(lint)
if [ -n "${INPUT_CONFIGURATION_FILE:-}" ]; then
  arguments+=(--configuration "${INPUT_CONFIGURATION_FILE}")
fi
if [ "${INPUT_ALL_FILES:-}" != "false" ]; then
  arguments+=(--recursive .)
else
  # TODO: Collect changed files
  arguments+=(--recursive .)
fi
swift-format "${arguments[@]}"
