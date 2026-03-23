#!/bin/bash
# Setup Docsify QA Dashboard from template
# Usage: bash .cursor/qa-docsify-template/setup-docsify.sh <output_dir> <project_name> <project_slug> <branch> <date> <stack>
# Example: bash .cursor/qa-docsify-template/setup-docsify.sh qa-output "JLR MSS" "jlr-mss" "feature/my-branch" "2026-03-23" "Drupal 11 + Symfony 7.4 + React 19"

set -e

OUTPUT_DIR="${1:-qa-output}"
PROJECT_NAME="${2:-Project}"
PROJECT_SLUG="${3:-project}"
BRANCH="${4:-main}"
DATE="${5:-$(date +%Y-%m-%d)}"
STACK="${6:-Unknown}"
TEMPLATE_DIR="$(dirname "$0")"

mkdir -p "$OUTPUT_DIR/screenshots/desktop" \
         "$OUTPUT_DIR/screenshots/tablet" \
         "$OUTPUT_DIR/screenshots/mobile" \
         "$OUTPUT_DIR/videos"

TEMPLATE_FILES="index.html _coverpage.md _sidebar.md README.md media.md qa-functional-report.md qa-functional-checklist.md"

for file in $TEMPLATE_FILES; do
  if [ -f "$TEMPLATE_DIR/$file" ]; then
    sed \
      -e "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" \
      -e "s|{{PROJECT_SLUG}}|$PROJECT_SLUG|g" \
      -e "s|{{BRANCH}}|$BRANCH|g" \
      -e "s|{{DATE}}|$DATE|g" \
      -e "s|{{STACK}}|$STACK|g" \
      "$TEMPLATE_DIR/$file" > "$OUTPUT_DIR/$file"
  fi
done

echo "Docsify QA dashboard scaffolded in $OUTPUT_DIR/"
echo ""
echo "Files created from template:"
for file in $TEMPLATE_FILES; do
  [ -f "$OUTPUT_DIR/$file" ] && echo "  $OUTPUT_DIR/$file"
done
echo ""
echo "Directories created:"
echo "  $OUTPUT_DIR/screenshots/desktop/"
echo "  $OUTPUT_DIR/screenshots/tablet/"
echo "  $OUTPUT_DIR/screenshots/mobile/"
echo "  $OUTPUT_DIR/videos/"
echo ""
echo "Remaining {{PLACEHOLDERS}} in README.md, media.md, functional reports"
echo "are filled by the qa-merge-report agent with actual counts and content."
echo ""
echo "To serve: npx docsify-cli serve $OUTPUT_DIR --port 3333"
