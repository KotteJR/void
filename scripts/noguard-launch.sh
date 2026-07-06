#!/usr/bin/env bash
# NoGuard launcher - runs the built dev version of the editor.
# This is used by the Desktop shortcut so you can open NoGuard with a double-click.
set -e

REPO_DIR="/home/kottejr/void"
export PATH="$HOME/.nvm/versions/node/v20.18.2/bin:$PATH"

cd "$REPO_DIR"

# Chrome sandbox needs root setuid, which we don't have in dev; disable it.
export ELECTRON_DISABLE_SANDBOX=1

exec ./scripts/code.sh --no-sandbox \
	--user-data-dir "$REPO_DIR/.tmp/user-data" \
	--extensions-dir "$REPO_DIR/.tmp/extensions" \
	"$@"
