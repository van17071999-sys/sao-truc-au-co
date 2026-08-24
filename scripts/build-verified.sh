#!/usr/bin/env bash
set -euo pipefail

if command -v vinext >/dev/null 2>&1; then
  vinext build
elif [[ -x "./node_modules/.bin/vinext" ]]; then
  ./node_modules/.bin/vinext build
else
  npx vinext build
fi

