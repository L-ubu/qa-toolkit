# QA Toolkit

AI-powered QA toolkit that runs automated quality analysis on your codebase and produces a browsable dashboard with findings, screenshots, and videos.

```
     ___    _     _____           _ _    _ _
    / _ \  / \   |_   _|__   ___ | | | _(_) |_
   | | | |/ _ \    | |/ _ \ / _ \| | |/ / | __|
   | |_| / ___ \   | | (_) | (_) | |   <| | |_
    \__\_\_/   \_\  |_|\___/ \___/|_|_|\_\_|\__|
```

## What it does

- Runs **3 parallel QA agents** (Frontend, Backend, E2E) that analyze your codebase
- Produces a **Docsify dashboard** with all findings, organized and filterable
- Splits findings into **Functional** (for PM/client) and **Technical** (for devs)
- Generates fix lists, Jira-ready tickets, Confluence checklists
- Captures **screenshots** at desktop/tablet/mobile and **E2E videos**
- Creates a **shareable public link** via Cloudflare tunnel

## Install

### Option A: npm (recommended)

```bash
npx @l-ubu/qa-toolkit init
```

This copies the QA skills, rules, and Docsify template into your project's `.cursor/` directory.

### Option B: Clone + install script

```bash
git clone https://github.com/L-ubu/qa-toolkit.git /tmp/qa-toolkit
bash /tmp/qa-toolkit/install.sh /path/to/your/project
```

### Option C: GitHub template

Use this repo as a template and copy the contents into your project's `.cursor/`.

## Usage

### Run QA (in Cursor)

Open your project in Cursor and say:

```
/qa
```

Or be specific:

```
/qa-frontend
/qa-backend
/qa-e2e
```

The agent will:
1. Analyze your codebase (Frontend, Backend, E2E flows)
2. Generate reports with severity classification (P0–P3)
3. Build a Docsify dashboard in `qa-output/`
4. Serve it locally and create a shareable link

### CLI Commands

```bash
# Install QA skills into your project
npx @l-ubu/qa-toolkit init

# Scaffold a new qa-output/ from template
npx @l-ubu/qa-toolkit scaffold "My Project" "feature/branch"

# Serve the dashboard
npx @l-ubu/qa-toolkit serve          # default port 3333
npx @l-ubu/qa-toolkit serve 4000     # custom port

# Share via public tunnel
npx @l-ubu/qa-toolkit share
```

## What you get

### For the PM / Client

- **Functional Report** — plain-language descriptions of what users see and experience
- **Functional Checklist** — checkbox list sorted by feature area for budget decisions
- **Severity filter** — toggle P0/P1/P2/P3 visibility in the dashboard
- **PDF export** — one-click print to PDF

### For Developers

- **Full Technical Report** — code paths, file references, fix suggestions
- **Frontend / Backend / E2E Reports** — detailed per-area analysis
- **Fix List** — grouped by component (Frontend → JS/React → Backend)
- **Jira Tickets** — pre-formatted, ready to create via MCP or copy-paste

### Media Evidence

- **Screenshots** at desktop (1280px), tablet (768px), mobile (375px)
- **E2E videos** at all three viewports
- **Lightbox** for screenshot zoom, inline video playback

## Project structure

```
qa-toolkit/
├── bin/cli.js                    # CLI tool (init, serve, share, scaffold)
├── skills/
│   ├── qa-run/SKILL.md           # Orchestrator — runs all agents
│   ├── qa-frontend/SKILL.md      # Frontend/UI analysis
│   ├── qa-backend/SKILL.md       # Backend/API analysis
│   ├── qa-e2e/SKILL.md           # E2E flow analysis
│   └── qa-merge-report/SKILL.md  # Merges findings, builds dashboard
├── rules/
│   └── qa-report-format.mdc      # Report format rules for Cursor
├── docsify-template/             # Reusable Docsify dashboard template
│   ├── index.html                # Themed dashboard with filter + PDF
│   ├── setup-docsify.sh          # Scaffold script
│   ├── README.md                 # Dashboard template
│   ├── _sidebar.md               # Navigation template
│   ├── media.md                  # Screenshots/videos template
│   ├── qa-functional-report.md   # Functional report template
│   └── qa-functional-checklist.md # Functional checklist template
├── install.sh                    # Standalone install script (no npm needed)
├── package.json
└── README.md
```

## Customisation

### Project-specific QA structure

Add a `.cursor/qa-reference/` directory with a markdown file describing your project's feature areas, test scenarios, and Confluence structure. The QA agents will use it to organise findings.

Example: `.cursor/qa-reference/my-project-structure.md`

### Docsify theme

Edit `.cursor/qa-docsify-template/index.html` to change colors, fonts, or add features. The template uses CSS custom properties for easy theming.

## License

MIT
