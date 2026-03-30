#!/usr/bin/env bash
set -euo pipefail

# Detect changed files and emit module flags for GitHub Actions.
# Usage:
#   ./scripts/ci/changed-modules.sh [base_ref] [head_ref]
# Examples:
#   ./scripts/ci/changed-modules.sh origin/main HEAD
#   ./scripts/ci/changed-modules.sh v1.2.0 HEAD

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

BASE_REF="${1:-}"
HEAD_REF="${2:-HEAD}"

all_zero_sha='0000000000000000000000000000000000000000'

resolve_range() {
  if [[ -n "$BASE_REF" ]]; then
    printf '%s...%s' "$BASE_REF" "$HEAD_REF"
    return
  fi

  if [[ -n "${GITHUB_BASE_REF:-}" ]]; then
    # For pull requests, compare against the PR base branch.
    git fetch --no-tags --depth=1 origin "${GITHUB_BASE_REF}" >/dev/null 2>&1 || true
    printf 'origin/%s...%s' "${GITHUB_BASE_REF}" "$HEAD_REF"
    return
  fi

  if [[ -n "${GITHUB_EVENT_BEFORE:-}" && "${GITHUB_EVENT_BEFORE}" != "$all_zero_sha" ]]; then
    printf '%s..%s' "${GITHUB_EVENT_BEFORE}" "${GITHUB_SHA:-$HEAD_REF}"
    return
  fi

  if git rev-parse --verify HEAD~1 >/dev/null 2>&1; then
    printf 'HEAD~1..%s' "$HEAD_REF"
    return
  fi

  printf '%s..%s' "$HEAD_REF" "$HEAD_REF"
}

DIFF_RANGE="$(resolve_range)"
CHANGED_FILES="$(git diff --name-only "$DIFF_RANGE" || true)"

has_match() {
  local pattern="$1"
  if [[ -z "$CHANGED_FILES" ]]; then
    return 1
  fi
  grep -Eq "$pattern" <<<"$CHANGED_FILES"
}

client_changed=false
server_changed=false
docker_changed=false
workflow_changed=false
docs_only=true

if has_match '^client/'; then
  client_changed=true
fi

if has_match '^server/'; then
  server_changed=true
fi

if has_match '(^|/)Dockerfile$|^docker-compose\.ya?ml$|^render\.ya?ml$'; then
  docker_changed=true
fi

if has_match '^\.github/workflows/'; then
  workflow_changed=true
fi

# Mark docs-only false when at least one non-doc/non-meta file changes.
if has_match '^(client/|server/|\.github/workflows/|docker-compose\.ya?ml$|render\.ya?ml$|[^/]+\.(sh|js|jsx|ts|tsx|json|yaml|yml|mjs|cjs))'; then
  docs_only=false
fi

any_app_changed=false
if [[ "$client_changed" == true || "$server_changed" == true ]]; then
  any_app_changed=true
fi

echo "Diff range: $DIFF_RANGE"
echo "Changed files:"
if [[ -n "$CHANGED_FILES" ]]; then
  echo "$CHANGED_FILES"
else
  echo "(none)"
fi

echo "client_changed=$client_changed"
echo "server_changed=$server_changed"
echo "any_app_changed=$any_app_changed"
echo "docker_changed=$docker_changed"
echo "workflow_changed=$workflow_changed"
echo "docs_only=$docs_only"

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  {
    echo "client_changed=$client_changed"
    echo "server_changed=$server_changed"
    echo "any_app_changed=$any_app_changed"
    echo "docker_changed=$docker_changed"
    echo "workflow_changed=$workflow_changed"
    echo "docs_only=$docs_only"
  } >>"$GITHUB_OUTPUT"
fi
