#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

const PKG_ROOT = path.resolve(__dirname, '..');
const CWD = process.cwd();

const SKILLS = ['qa-run', 'qa-frontend', 'qa-backend', 'qa-e2e', 'qa-merge-report'];

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function init() {
  const cursorDir = path.join(CWD, '.cursor');
  fs.mkdirSync(cursorDir, { recursive: true });

  console.log('\n  QA Toolkit — Installing into .cursor/\n');

  // Copy skills
  for (const skill of SKILLS) {
    const src = path.join(PKG_ROOT, 'skills', skill);
    const dest = path.join(cursorDir, 'skills', skill);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(path.join(src, 'SKILL.md'), path.join(dest, 'SKILL.md'));
    console.log(`  + .cursor/skills/${skill}/SKILL.md`);
  }

  // Copy rules
  const rulesDir = path.join(cursorDir, 'rules');
  fs.mkdirSync(rulesDir, { recursive: true });
  fs.copyFileSync(
    path.join(PKG_ROOT, 'rules', 'qa-report-format.mdc'),
    path.join(rulesDir, 'qa-report-format.mdc')
  );
  console.log('  + .cursor/rules/qa-report-format.mdc');

  // Copy docsify template
  const templateSrc = path.join(PKG_ROOT, 'docsify-template');
  const templateDest = path.join(cursorDir, 'qa-docsify-template');
  copyDir(templateSrc, templateDest);
  // Make setup script executable
  const setupScript = path.join(templateDest, 'setup-docsify.sh');
  if (fs.existsSync(setupScript)) {
    fs.chmodSync(setupScript, '755');
  }
  console.log('  + .cursor/qa-docsify-template/');

  console.log('\n  Done! Your project now has QA skills and templates.');
  console.log('  Run /qa in Cursor to start a QA analysis.\n');
}

function serve(port) {
  const outputDir = path.join(CWD, 'qa-output');
  if (!fs.existsSync(outputDir)) {
    console.error('\n  No qa-output/ directory found. Run a QA analysis first.\n');
    process.exit(1);
  }

  console.log(`\n  Serving QA dashboard at http://localhost:${port}\n`);
  const child = spawn('npx', ['docsify-cli', 'serve', outputDir, '--port', String(port)], {
    stdio: 'inherit',
    shell: true
  });
  child.on('error', () => {
    console.error('  Failed to start docsify. Install it: npm i -g docsify-cli');
  });
}

function share(port) {
  console.log(`\n  Creating public tunnel to localhost:${port}...\n`);
  const child = spawn('npx', ['cloudflared', 'tunnel', '--url', `http://localhost:${port}`], {
    stdio: 'inherit',
    shell: true
  });
  child.on('error', () => {
    console.error('  Failed to start cloudflared tunnel.');
  });
}

function scaffold(projectName, branch) {
  const slug = (projectName || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const date = new Date().toISOString().split('T')[0];
  const templateScript = path.join(CWD, '.cursor', 'qa-docsify-template', 'setup-docsify.sh');

  if (!fs.existsSync(templateScript)) {
    console.error('\n  No .cursor/qa-docsify-template/ found. Run `qa-toolkit init` first.\n');
    process.exit(1);
  }

  execSync(`bash "${templateScript}" qa-output "${projectName || 'Project'}" "${slug}" "${branch || 'main'}" "${date}" "Unknown"`, {
    stdio: 'inherit',
    cwd: CWD
  });
}

function help() {
  console.log(`
  qa-toolkit — AI-powered QA toolkit

  Commands:
    init                    Install QA skills, rules, and templates into .cursor/
    scaffold [name] [branch] Create qa-output/ directory from template
    serve [port]            Serve the Docsify QA dashboard (default: 3333)
    share [port]            Create a public Cloudflare tunnel (default: 3333)
    help                    Show this help

  Examples:
    npx qa-toolkit-ai init
    npx qa-toolkit-ai scaffold "My Project" "feature/branch"
    npx qa-toolkit-ai serve
    npx qa-toolkit-ai serve 4000
    npx qa-toolkit-ai share
  `);
}

switch (command) {
  case 'init':
    init();
    break;
  case 'scaffold':
    scaffold(args[1], args[2]);
    break;
  case 'serve':
    serve(args[1] || 3333);
    break;
  case 'share':
    share(args[1] || 3333);
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    help();
    break;
  default:
    console.error(`  Unknown command: ${command}`);
    help();
    process.exit(1);
}
