#!/usr/bin/env bash
# Everything that should pass on every commit, in one command.
#
#   npm run check
#
# Deliberately does NOT include tools/preflight.mjs. That one fails by design
# until the business details are confirmed, so folding it in here would mean
# `check` is red for months and everyone learns to ignore it. It is the launch
# gate, run separately: npm run preflight
#
# Needs the dev server for the browser-driven checks. Starts one if the port is
# free and stops it again on the way out; uses an already-running one otherwise.
#
# tools/serve.mjs, not `python3 -m http.server`. The Python one sends no
# Content-Encoding, which is invisible to the audit but made the Core Web Vitals
# numbers wrong by about 5x on the critical path — it was timing 45KB of HTML
# that a real host serves in 11KB.

set -uo pipefail
cd "$(dirname "$0")/.."

PORT=8099
FAILED=0
STARTED_SERVER=0

step() {
  printf '\n\033[1m▸ %s\033[0m\n' "$1"
}

run() {
  local label="$1"; shift
  if "$@" > /tmp/check-out.txt 2>&1; then
    printf '  \033[32m✓\033[0m %s\n' "$label"
  else
    printf '  \033[31m✗\033[0m %s\n' "$label"
    sed 's/^/      /' /tmp/check-out.txt | tail -20
    FAILED=$((FAILED + 1))
  fi
}

step "Build"
run "37 pages written to dist/" node build.mjs

if ! curl -s -o /dev/null "http://127.0.0.1:$PORT/" 2>/dev/null; then
  node tools/serve.mjs --port "$PORT" >/dev/null 2>&1 &
  STARTED_SERVER=$!
  sleep 1.5
  trap 'kill $STARTED_SERVER 2>/dev/null' EXIT
fi

step "Rendered-page audit"
for w in 320 390 768 1440; do
  run "${w}px — overflow, truncation, contrast, keyboard, headings, schema, links, fragments" \
    node tools/audit.mjs --width "$w"
done

step "Accessibility beyond the audit"
# Both of these were once excluded because they failed. zoom passed from the
# pass that traced the 200%-text overflow to its two real causes, and targets
# passed the day it was written. A check that is allowed to stay red is a check
# everyone learns to skip, so they belong here now that they are green.
run "WCAG 1.4.4 — no overflow or clipping with text at 200%" node tools/zoom.mjs 390
run "WCAG 2.5.8 — every non-exempt tap target at least 24x24" node tools/targets.mjs 390
run "usable with JavaScript disabled" node tools/nojs.mjs 390

step "Prose"
run "no sentence repeated across pages, no page restating itself" node tools/prose.mjs

printf '\n'
if [ "$FAILED" -eq 0 ]; then
  printf '\033[32mAll checks passed.\033[0m\n'
  printf 'Before launch, also run: \033[1mnpm run preflight\033[0m (business claims) and \033[1mnpm run vitals\033[0m (Core Web Vitals).\n\n'
else
  printf '\033[31m%s check(s) failed.\033[0m\n\n' "$FAILED"
fi
exit "$FAILED"
