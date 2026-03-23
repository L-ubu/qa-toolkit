#!/bin/bash
# QA Toolkit — Quick install (no npm required)
# Usage: bash install.sh [target_dir]
# Copies skills, rules, and Docsify template into .cursor/ of the target project.

set -e

TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CURSOR_DIR="$TARGET/.cursor"

echo ""
echo "  QA Toolkit — Installing into $CURSOR_DIR/"
echo ""

# Skills
for skill in qa-run qa-frontend qa-backend qa-e2e qa-merge-report; do
  mkdir -p "$CURSOR_DIR/skills/$skill"
  cp "$SCRIPT_DIR/skills/$skill/SKILL.md" "$CURSOR_DIR/skills/$skill/SKILL.md"
  echo "  + .cursor/skills/$skill/SKILL.md"
done

# Rules
mkdir -p "$CURSOR_DIR/rules"
cp "$SCRIPT_DIR/rules/qa-report-format.mdc" "$CURSOR_DIR/rules/qa-report-format.mdc"
echo "  + .cursor/rules/qa-report-format.mdc"

# Docsify template
mkdir -p "$CURSOR_DIR/qa-docsify-template"
cp -r "$SCRIPT_DIR/docsify-template/"* "$CURSOR_DIR/qa-docsify-template/"
chmod +x "$CURSOR_DIR/qa-docsify-template/setup-docsify.sh" 2>/dev/null || true
echo "  + .cursor/qa-docsify-template/"

echo ""
echo "  Done! Your project now has QA skills and templates."
echo "  Run /qa in Cursor to start a QA analysis."
echo ""
