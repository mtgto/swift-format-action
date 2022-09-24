#!/bin/bash -u
if [ "${INPUT_AUTO_CORRECT:-}" = "true" ]; then
  auto_correct=1
  arguments=(format --in-place)
else
  auto_correct=0
  arguments=(lint)
fi

if [ -f "${INPUT_CONFIGURATION_FILE:-}" ]; then
  arguments+=(--configuration "${INPUT_CONFIGURATION_FILE}")
fi
if [ "${INPUT_ALL_FILES:-}" = "true" ]; then
  SOURCES=$(git ls-files "*.swift" | xargs)
elif [ -n "${GITHUB_BASE_REF:-}" ]; then
  # pull request
  git fetch --depth 1 origin "${GITHUB_BASE_REF}"
  SOURCES=$(git diff "origin/${GITHUB_BASE_REF}" HEAD --diff-filter=AM --name-only -- "*.swift" | xargs)
else
  SOURCES=$(git diff HEAD^ --diff-filter=AM --name-only -- "*.swift" | xargs)
fi
if [ -z "${SOURCES}" ]; then
  # No swift file is target.
  exit
fi
arguments+=($SOURCES)

# Treat warnings as error (exit code = 1)
OUTPUT=$(swift-format "${arguments[@]}" 2>&1)
RESULT=$?
IFS="\n"
if [ -n "${OUTPUT}" ]; then
  echo "${OUTPUT}" | awk -v pwd="${GITHUB_WORKSPACE}" -F: '{ sub(pwd"/","");print "::"substr($4,2)" file="$1",line="$2",col="$3"::"substr($5,2)$6}'
fi

if [ "${RESULT}" -ne 0 -o "${INPUT_MAX_WARNINGS:--1}" -eq -1 ]; then
  exit $RESULT
else
  WARNING_COUNT=$(echo -n "${OUTPUT}" | grep ': warning: ' | wc -l)
  if [ "${WARNING_COUNT}" -gt "${INPUT_MAX_WARNINGS:--1}" ]; then
    exit 1
  fi
fi
