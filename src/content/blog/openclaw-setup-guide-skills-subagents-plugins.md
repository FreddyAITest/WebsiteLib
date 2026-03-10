# Complete OpenClaw Setup Guide: Essential Skills, Subagents & Plugins (2026)

**Published:** March 10, 2026  
**Reading Time:** 22 minutes  
**Category:** AI Automation, OpenClaw, Developer Tools  
**Tags:** openclaw, AI-agents, skills, subagents, plugins, automation, setup-guide, developer-tools

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What Is OpenClaw?](#what-is-openclaw)
3. [Essential Skills to Install](#essential-skills-to-install)
4. [Subagent Configuration & Management](#subagent-configuration--management)
5. [Must-Have Plugins](#must-have-plugins)
6. [Step-by-Step Installation Guide](#step-by-step-installation-guide)
7. [Configuration Files Explained](#configuration-files-explained)
8. [Workspace Structure Overview](#workspace-structure-overview)
9. [Common Setup Mistakes](#common-setup-mistakes)
10. [Verification Checklist](#verification-checklist)
11. [Troubleshooting](#troubleshooting)

---

## Executive Summary

OpenClaw transforms your AI assistant from a **reactive chatbot** into a **proactive automation platform** that works across your entire digital workflow. With skills, subagents, and plugins, you can automate everything from GitHub issue triage to weather monitoring, security audits, and continuous self-improvement.

**Key Capabilities:**
- ✅ **Skills**: Modular, self-contained packages that provide specialized workflows and domain expertise
- ✅ **Subagents**: Parallel AI workers spawned for specific tasks with isolated contexts
- ✅ **Plugins**: Channel integrations (Discord, Telegram, WhatsApp), browser control, canvas/nodes, memory persistence
- ✅ **Cronjobs**: Scheduled tasks that run automatically at specified times or intervals
- ✅ **Workspace-based**: Configuration files injected into every session for consistent behavior

**Quick Stats:**
- **Setup Time**: 15-30 minutes for complete setup
- **Skills Available**: 50+ pre-built skills in the official repository
- **Plugin Ecosystem**: Growing library of channel, browser, and node integrations
- **Cost**: Free and open-source (no API fees for core functionality)

**What You'll Learn:**
This guide covers everything from installing your first skills to configuring subagents, setting up plugins, and avoiding common pitfalls. Complete with working CLI commands, config file examples, and a verification checklist.

---

## What Is OpenClaw?

OpenClaw is an **AI automation platform** that extends your AI assistant with modular skills, parallel subagents, and integrations to external services. Think of it as an operating system for AI agents—providing structure, tooling, and persistence that raw LLMs lack.

### Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      OpenClaw Gateway                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Skills     │  │  Subagents   │  │      Plugins         │  │
│  │  (modular    │  │  (parallel   │  │  (Discord, Telegram, │  │
│  │  workflows)  │  │   workers)   │  │   Browser, Canvas)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                │                      │               │
│         └────────────────┼──────────────────────┘               │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Workspace                              │   │
│  │  AGENTS.md │ SOUL.md │ IDENTITY.md │ TOOLS.md │ memory/  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Cronjobs   │  │   Memory     │  │   Browser Control    │  │
│  │  (scheduled  │  │  (persistent │  │  (web automation,    │  │
│  │   tasks)     │  │   context)   │  │   tab control)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### How It Works

1. **Gateway Daemon**: Runs continuously, managing skills, subagents, and plugins
2. **Workspace Injection**: Configuration files (AGENTS.md, SOUL.md, etc.) loaded into every session
3. **Skill Triggering**: Skills auto-load when their description matches the user request
4. **Subagent Spawning**: Parallel AI workers created for complex or long-running tasks
5. **Plugin Integration**: External services (chat apps, browsers, nodes) controlled via unified API

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Modularity** | Skills are self-contained—install only what you need |
| **Parallelism** | Subagents run concurrently, handling multiple tasks at once |
| **Persistence** | Workspace files survive session restarts, maintaining context |
| **Automation** | Cronjobs run tasks on schedule without manual triggering |
| **Integration** | Plugins connect to Discord, Telegram, WhatsApp, browsers, and more |

---

## Essential Skills to Install

Skills are the building blocks of OpenClaw functionality. Each skill provides specialized workflows, tool integrations, and domain expertise. Here are the must-have skills for new users.

### Coding Subagents

These skills enable automated code work, GitHub operations, and skill creation.

#### 1. **gh-issues** 🐙

**Purpose**: Automatically fetch GitHub issues, spawn sub-agents to implement fixes, and open PRs.

**When to Use**:
- Triage open issues in your repositories
- Auto-fix bugs with parallel sub-agents
- Monitor PR reviews and address comments

**Installation**:
```bash
# Skill is pre-installed in OpenClaw
# Configure your GitHub token in ~/.openclaw/openclaw.json
```

**Usage Examples**:
```bash
# Fetch and fix all bug-labeled issues
/gh-issues owner/repo --label bug --limit 5

# Watch mode: continuously poll for new issues
/gh-issues owner/repo --watch --interval 5

# Review-only mode: check PRs for review comments
/gh-issues owner/repo --reviews-only

# Cron mode: fire-and-forget subagent spawning
/gh-issues owner/repo --cron --model glm-5
```

**Key Features**:
- Parallel sub-agent spawning (up to 8 concurrent)
- Fork mode support for contributing to upstream repos
- Watch mode for continuous monitoring
- Cron mode for scheduled issue triage
- Review comment handler for PR feedback

**Configuration**:
```json
{
  "skills": {
    "entries": {
      "gh-issues": {
        "apiKey": "ghp_YourGitHubTokenHere"
      }
    }
  }
}
```

---

#### 2. **github** 🔧

**Purpose**: General GitHub operations via the `gh` CLI (issues, PRs, CI runs, code review).

**When to Use**:
- Check PR status or CI runs
- Create/comment on issues
- List and filter PRs or issues
- View workflow run logs

**Installation**:
```bash
# Install GitHub CLI
brew install gh  # macOS
sudo apt install gh  # Linux

# Authenticate
gh auth login
```

**Usage Examples**:
```bash
# List open PRs
gh pr list --repo owner/repo

# Check CI status
gh pr checks 55 --repo owner/repo

# Create issue
gh issue create --title "Bug: something broken" --body "Details..."

# View failed run logs
gh run view <run-id> --repo owner/repo --log-failed
```

**Key Commands**:
| Command | Purpose |
|---------|---------|
| `gh pr list` | List pull requests |
| `gh pr checks` | Check CI status |
| `gh issue create` | Create new issue |
| `gh run list` | List workflow runs |
| `gh api` | Direct GitHub API queries |

---

#### 3. **skill-creator** ✍️

**Purpose**: Create, edit, improve, or audit AgentSkills. Use when authoring new skills or refining existing ones.

**When to Use**:
- Creating a new skill from scratch
- Improving or restructuring an existing skill
- Auditing skill directories against the AgentSkills spec
- Moving files to `references/` or `scripts/`

**Installation**:
```bash
# Pre-installed in OpenClaw
# Access via skill-creator workflow
```

**Usage Examples**:
```bash
# Initialize a new skill
scripts/init_skill.py my-skill --path skills/public --resources scripts,references

# Package a skill for distribution
scripts/package_skill.py skills/my-skill

# Validate and package with output directory
scripts/package_skill.py skills/my-skill ./dist
```

**Skill Structure**:
```
my-skill/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/          - Executable code
    ├── references/       - Documentation
    └── assets/           - Output files (templates, images)
```

**Best Practices**:
- Keep SKILL.md under 500 lines (use references files for details)
- Use progressive disclosure: metadata → SKILL.md → references
- Test scripts before including them
- Follow naming conventions: lowercase, hyphens, verb-led

---

### General/Operational Subagents

These skills handle everyday tasks, monitoring, and continuous improvement.

#### 4. **weather** 🌤️

**Purpose**: Get current weather and forecasts via wttr.in or Open-Meteo (no API key needed).

**When to Use**:
- User asks about weather or temperature
- Travel planning weather checks
- "Will it rain today?" queries

**Installation**:
```bash
# Pre-installed, requires only curl
# No API key needed
```

**Usage Examples**:
```bash
# Current weather (one-line summary)
curl "wttr.in/London?format=3"

# Detailed current conditions
curl "wttr.in/London?0"

# 3-day forecast
curl "wttr.in/London?format=v2"

# Custom format: location, condition, temp, wind, humidity
curl "wttr.in/London?format=%l:+%c+%t+%w+%h"
```

**Format Codes**:
| Code | Meaning |
|------|---------|
| `%c` | Weather condition emoji |
| `%t` | Temperature |
| `%f` | "Feels like" temperature |
| `%w` | Wind speed/direction |
| `%h` | Humidity |
| `%p` | Precipitation chance |
| `%l` | Location name |

---

#### 5. **healthcheck** 🛡️

**Purpose**: Host security hardening and risk-tolerance configuration for OpenClaw deployments.

**When to Use**:
- Security audits on OpenClaw host machines
- Firewall/SSH/update hardening
- Risk posture assessment
- Scheduling periodic security checks

**Installation**:
```bash
# Pre-installed in OpenClaw
# Run with state-of-the-art model recommended
```

**Usage Examples**:
```bash
# Run security audit (read-only)
openclaw security audit

# Deep audit with more checks
openclaw security audit --deep

# Apply OpenClaw safe defaults
openclaw security audit --fix

# Check version status
openclaw update status

# Schedule periodic audits (requires approval)
openclaw cron add --name healthcheck:security-audit --cron "0 2 * * *"
```

**Workflow**:
1. **Model self-check**: Recommends switching to state-of-the-art model if needed
2. **Context establishment**: Infers OS, privilege level, access path, network exposure
3. **Security audits**: Runs `openclaw security audit` with various flags
4. **Risk tolerance**: User selects profile (Balanced, Hardened, Developer, Custom)
5. **Remediation plan**: Step-by-step hardening with exact commands
6. **Execution**: Guided, step-by-step approvals for each change
7. **Verification**: Re-checks firewall, ports, remote access
8. **Scheduling**: Optional periodic audits via cronjobs

**Risk Profiles**:
| Profile | Description | Best For |
|---------|-------------|----------|
| **Home/Workstation Balanced** | Firewall on, remote access restricted to LAN/tailnet | Most users |
| **VPS Hardened** | Deny-by-default inbound, minimal ports, key-only SSH | Production servers |
| **Developer Convenience** | More local services allowed, explicit warnings | Development machines |
| **Custom** | User-defined constraints | Specialized setups |

---

#### 6. **self-improvement** 📈

**Purpose**: Captures learnings, errors, and corrections to enable continuous improvement.

**When to Use**:
- Command or operation fails unexpectedly
- User corrects you ("No, that's wrong...")
- User requests a capability that doesn't exist
- External API or tool fails
- Knowledge is outdated or incorrect
- Better approach discovered for recurring task

**Installation**:
```bash
# Via ClawHub (recommended)
clawhub install self-improvement

# Manual installation
git clone https://github.com/peterskoett/self-improving-agent.git \
  ~/.openclaw/skills/self-improving-agent

# Create learning files
mkdir -p ~/.openclaw/workspace/.learnings
```

**Learning Files**:
- `LEARNINGS.md` — Corrections, knowledge gaps, best practices
- `ERRORS.md` — Command failures, exceptions
- `FEATURE_REQUESTS.md` — User-requested capabilities

**Logging Format**:
```markdown
## [LRN-20250115-001] category

**Logged**: 2025-01-15T10:30:00Z
**Priority**: high
**Status**: pending
**Area**: backend

### Summary
One-line description of what was learned

### Details
Full context: what happened, what was wrong, what's correct

### Suggested Action
Specific fix or improvement to make

### Metadata
- Source: conversation | error | user_feedback
- Related Files: path/to/file.ext
- Tags: tag1, tag2
- Pattern-Key: simplify.dead_code (optional)
- See Also: LRN-20250110-001 (if related)
```

**Promotion Workflow**:
When learnings prove broadly applicable, promote to workspace files:

| Learning Type | Promote To | Example |
|---------------|------------|---------|
| Behavioral patterns | `SOUL.md` | "Be concise, avoid disclaimers" |
| Workflow improvements | `AGENTS.md` | "Spawn sub-agents for long tasks" |
| Tool gotchas | `TOOLS.md` | "Git push needs auth configured first" |

---

### Communication Skills

These skills handle messaging, notifications, and scheduled tasks.

#### 7. **message** 💬

**Purpose**: Send messages and channel actions via plugins (Discord, Telegram, WhatsApp, etc.).

**When to Use**:
- Send notifications to chat channels
- Create polls in communities
- React to messages
- Manage threads and topics

**Usage Examples**:
```bash
# Send message to Telegram channel
message action=send channel=telegram target=-1002381931352 \
  message="✅ Task completed successfully"

# Create poll in Discord
message action=poll channel=discord target=channel-id \
  pollQuestion="Which feature should we build next?" \
  pollOption=["Feature A","Feature B","Feature C"] \
  pollDurationHours=24

# React to message
message action=react channel=telegram messageId=12345 emoji="👍"
```

**Supported Actions**:
| Action | Purpose |
|--------|---------|
| `send` | Send text/media messages |
| `poll` | Create and vote in polls |
| `react` | Add/remove emoji reactions |
| `edit` | Edit existing messages |
| `delete` | Delete messages |
| `topic-create` | Create Discord threads/topics |

---

#### 8. **Cronjobs** ⏰

**Purpose**: Schedule AI tasks to run automatically at specified times or intervals.

**When to Use**:
- Daily reports at 8:00 AM UTC
- Weekly summaries on Monday 9:00 AM
- Periodic monitoring and health checks
- Scheduled data collection or content generation

**Schedule Types**:
| Type | Format | Use Case |
|------|--------|----------|
| **One-shot** | `at 2026-03-10T09:00:00Z` | Run once at specific time |
| **Recurring** | `every 1h` | Run every hour |
| **Cron expression** | `0 2 * * *` | Complex schedules (daily at 2 AM) |

**Usage Examples**:
```bash
# Daily report at 8 AM UTC
openclaw cron add --name daily-report \
  --cron "0 8 * * *" \
  --payload '{"type":"systemEvent","action":"report"}'

# Health check every 6 hours
openclaw cron add --name healthcheck \
  --every 6h \
  --payload '{"type":"systemEvent","action":"healthcheck"}'

# List all jobs
openclaw cron list

# Edit existing job
openclaw cron edit <job-id> --cron "0 9 * * 1"
```

**Payload Types**:
- `systemEvent`: Triggers main session with full context
- `agentTurn`: Runs in isolated session (background task)

**Delivery Options**:
- `announce`: Post result to chat channel
- `webhook`: POST to external URL
- `none`: Internal-only execution (no output)

---

## Subagent Configuration & Management

Subagents are parallel AI workers spawned for specific tasks. They run with isolated contexts and can operate concurrently.

### How to Spawn Coding Subagents

Coding subagents handle code-related tasks like fixing GitHub issues, refactoring, or implementing features.

#### Spawning via gh-issues Skill

The `gh-issues` skill automatically spawns sub-agents for each issue:

```bash
# Spawn sub-agents for all bug-labeled issues
/gh-issues owner/repo --label bug --limit 5 --yes

# Each issue spawns a sub-agent with:
# - runTimeoutSeconds: 3600 (60 minutes)
# - cleanup: "keep" (preserve transcripts)
# - model: glm-5 (if specified via --model)
```

#### Manual Subagent Spawning

For custom coding tasks, spawn subagents directly:

```bash
# Spawn a coding subagent via sessions_spawn
subagents action=steer target=<session-id> \
  message="Fix the null pointer issue in parser.py"
```

**Subagent Task Prompt Template**:
```
You are a focused code-fix agent. Your task is to fix a specific issue.

<config>
Repository: {repo}
Branch: {branch}
Issue: #{number}
Timeout: 60 minutes
</config>

<instructions>
1. ANALYZE — Search codebase for relevant files
2. IMPLEMENT — Make minimal, focused fix
3. TEST — Run existing tests
4. COMMIT — Stage and commit changes
5. PUSH — Push branch to remote
6. PR — Create pull request via GitHub API
7. REPORT — Send back summary with PR URL
</instructions>
```

---

### How to Spawn General Task Subagents

General task subagents handle non-coding work like research, data collection, or content generation.

#### Spawning via Custom Prompts

```bash
# Spawn subagent for research task
subagents action=steer target=<session-id> \
  message="Research competitor pricing for SaaS tools"
```

**Configuration Options**:
| Option | Purpose | Default |
|--------|---------|---------|
| `runTimeoutSeconds` | Max runtime before timeout | 3600 (60 min) |
| `cleanup` | Keep or remove transcript | "keep" |
| `model` | Override model for subagent | Session default |
| `thinking` | Enable reasoning mode | off |

---

### Best Practices for Subagent Management

#### 1. **Concurrency Limits**

- Default: 8 concurrent subagents (`subagents.maxConcurrent: 8`)
- For heavy workloads: Reduce to 4-6 to avoid resource contention
- Monitor active subagents: `subagents action=list`

#### 2. **Timeout Handling**

- Set appropriate timeouts based on task complexity:
  - Code fixes: 60 minutes
  - Research tasks: 30 minutes
  - Data collection: 45 minutes
- Handle timeouts gracefully:
  ```
  "#{N} — Timed out (task may be too complex for auto-completion)"
  ```

#### 3. **Checkpoint Tracking**

For long-running subagents (>4 hours):
- Require checkpoints saved to workspace
- Alert if running without checkpoint
- Use `process` tool to monitor progress

#### 4. **Context Hygiene**

Between poll cycles or task batches:
- Retain only essential state (processed items, tracked PRs)
- Discard transient data (issue bodies, comment text, transcripts)
- Keep cumulative results for reporting

#### 5. **Claim-Based Tracking**

Prevent duplicate processing with claims files:
```bash
# Claims file location
CLAIMS_FILE="/data/.clawdbot/gh-issues-claims.json"

# Auto-expire claims after 2 hours
# Prevents overlapping subagents on same task
```

#### 6. **Monitoring & Alerts**

Monitor subagent health:
```bash
# List active subagents
subagents action=list

# Kill stuck subagent
subagents action=kill target=<session-id>

# Check recent sessions
sessions_list --recentMinutes 60
```

**Alert Triggers**:
- Subagent crashes without restart
- Task running >4 hours without checkpoint
- No tasks completed in 24 hours
- API quota >80% used

---

## Must-Have Plugins

Plugins extend OpenClaw's capabilities to external services and devices.

### Channel Plugins

Connect your AI to chat platforms for notifications and community management.

#### 1. **Discord Plugin**

**Purpose**: Send messages, create polls, manage threads in Discord servers.

**Setup**:
```bash
# Configure Discord bot token in ~/.openclaw/openclaw.json
{
  "plugins": {
    "discord": {
      "botToken": "YourBotToken",
      "guildId": "ServerID"
    }
  }
}
```

**Usage**:
```bash
# Send message to channel
message action=send channel=discord target=channel-id \
  message="Daily report ready"

# Create poll
message action=poll channel=discord target=channel-id \
  pollQuestion="Feature priority?" \
  pollOption=["Performance","UX","Features"]
```

---

#### 2. **Telegram Plugin**

**Purpose**: Send notifications to Telegram channels and groups.

**Setup**:
```bash
# Configure Telegram bot token
{
  "plugins": {
    "telegram": {
      "botToken": "YourBotToken",
      "channels": ["-1002381931352"]
    }
  }
}
```

**Usage**:
```bash
# Send to channel
message action=send channel=telegram target=-1002381931352 \
  message="✅ PR Created: owner/repo#42\n\n{pr_url}"

# Send with media
message action=send channel=telegram target=channel-id \
  media="/path/to/image.png" caption="Screenshot"
```

---

#### 3. **WhatsApp Plugin** (via wacli)

**Purpose**: Send messages to WhatsApp contacts or groups.

**Setup**:
```bash
# Install wacli
npm install -g wacli

# Authenticate
wacli login
```

**Usage**:
```bash
# Send message
message action=send channel=whatsapp target=phone-number \
  message="Task completed"
```

---

### Browser Control Plugin

Automate web interactions, form submissions, and data extraction.

#### Browser Tool Capabilities

**Profiles**:
- `chrome`: Chrome extension relay (your existing Chrome tabs)
- `openclaw`: Isolated OpenClaw-managed browser

**Actions**:
| Action | Purpose |
|--------|---------|
| `status` | Check browser status |
| `start`/`stop` | Start/stop browser |
| `tabs` | List open tabs |
| `open` | Open URL in new tab |
| `snapshot` | Capture page structure (ARIA refs) |
| `act` | Perform UI actions (click, type, etc.) |
| `screenshot` | Capture full-page screenshot |

**Usage Examples**:
```bash
# Open URL in Chrome profile
browser action=open profile=chrome url="https://github.com"

# Take snapshot with ARIA refs
browser action=snapshot profile=chrome refs="aria"

# Click element by ref
browser action=act profile=chrome kind=click ref="e12"

# Type into input field
browser action=act profile=chrome kind=type ref="e15" text="search query"
```

**Chrome Extension Relay**:
- Requires user to click OpenClaw Browser Relay toolbar icon
- Badge must be ON for tab attachment
- Use `profile="chrome"` when extension is mentioned

---

### Canvas/Node Plugins

Control node canvases and paired devices for UI automation and monitoring.

#### Canvas Control

**Purpose**: Present, navigate, evaluate, or snapshot rendered UIs on node canvases.

**Usage**:
```bash
# Present canvas on node
canvas action=present node=node-name url="https://dashboard.example.com"

# Take snapshot
canvas action=snapshot node=node-name outputFormat=png

# Execute JavaScript
canvas action=eval node=node-name javaScript="document.title"
```

---

#### Node Control

**Purpose**: Discover and control paired nodes (cameras, screens, notifications, location).

**Actions**:
| Action | Purpose |
|--------|---------|
| `status` | Check node status |
| `describe` | Get node details |
| `camera_snap` | Take camera snapshot |
| `screen_record` | Record screen |
| `location_get` | Get device location |
| `notifications_list` | List notifications |
| `notify` | Send push notification |

**Usage Examples**:
```bash
# Take camera snapshot
nodes action=camera_snap node=iphone facing=front

# Record screen (30 seconds)
nodes action=screen_record node=iphone duration=30s

# Get location
nodes action=location_get node=iphone desiredAccuracy=precise

# Send notification
nodes action=notify node=iphone title="Task Complete" \
  body="Your report is ready" priority=active
```

---

### Memory & Persistence Plugins

Maintain context across sessions and enable long-term learning.

#### Session Logs

**Purpose**: Persist session transcripts and enable cross-session memory.

**Setup**:
```bash
# Pre-configured in OpenClaw
# Transcripts saved to ~/.openclaw/sessions/
```

**Usage**:
```bash
# View active sessions
sessions_list

# Read another session's history
sessions_history --session-id <id>

# Send message to another session
sessions_send --session-id <id> message="Learning: use pnpm not npm"
```

---

#### Self-Improvement Memory

**Purpose**: Capture learnings and promote to project memory.

**Workspace Files**:
```
~/.openclaw/workspace/
├── MEMORY.md          # Long-term memory (main session)
├── memory/            # Daily memory files
│   └── YYYY-MM-DD.md
└── .learnings/        # Learning logs
    ├── LEARNINGS.md
    ├── ERRORS.md
    └── FEATURE_REQUESTS.md
```

**Promotion Workflow**:
1. Log learning to `.learnings/LEARNINGS.md`
2. Review for broad applicability
3. Promote to `MEMORY.md`, `AGENTS.md`, or `SOUL.md`
4. Mark original as `**Status**: promoted`

---

## Step-by-Step Installation Guide

Follow this checklist to set up OpenClaw from scratch.

### Prerequisites

1. **Node.js**: v22.x or later
   ```bash
   node --version  # Should show v22.x
   ```

2. **Git**: For cloning repos and GitHub operations
   ```bash
   git --version
   ```

3. **curl**: Required by many skills
   ```bash
   curl --version
   ```

4. **GitHub CLI** (optional, for github skill)
   ```bash
   brew install gh  # macOS
   sudo apt install gh  # Linux
   gh auth login
   ```

---

### Step 1: Install OpenClaw

```bash
# Install via npm
npm install -g openclaw

# Verify installation
openclaw --version

# Run initial setup wizard
openclaw wizard
```

---

### Step 2: Configure Authentication

Edit `~/.openclaw/openclaw.json`:

```json
{
  "auth": {
    "profiles": {
      "google:default": {
        "provider": "google",
        "mode": "api_key"
      }
    }
  },
  "skills": {
    "entries": {
      "gh-issues": {
        "apiKey": "ghp_YourGitHubToken"
      }
    }
  },
  "plugins": {
    "telegram": {
      "botToken": "YourTelegramBotToken"
    },
    "discord": {
      "botToken": "YourDiscordBotToken"
    }
  }
}
```

**Get Tokens**:
- **GitHub**: https://github.com/settings/tokens (classic token with `repo` scope)
- **Telegram**: Create bot via @BotFather, copy token
- **Discord**: Create app at https://discord.com/developers, add bot

---

### Step 3: Install Essential Skills

```bash
# Most skills pre-installed, verify with:
openclaw skills list

# Install additional skills via ClawHub
clawhub install self-improvement
clawhub install weather
clawhub install healthcheck
```

**Verify Installation**:
```bash
# Check skill directory
ls -la /usr/lib/node_modules/openclaw/skills/

# Test skill invocation
# Ask: "What's the weather in London?"
```

---

### Step 4: Set Up Workspace

```bash
# Create workspace directory
mkdir -p ~/.openclaw/workspace/oversight

# Create configuration files
cd ~/.openclaw/workspace/oversight

# Initialize identity
cat > IDENTITY.md << 'EOF'
# IDENTITY.md - Who Am I?

- **Name:** Strategic Oversight Bot
- **Creature:** AI agent
- **Vibe:** Direct, data-driven, proactive
- **Emoji:** 🤖
- **Avatar:** avatars/openclaw.png
EOF

# Create AGENTS.md
cat > AGENTS.md << 'EOF'
# Strategic Oversight Bot - Instructions

## 🎯 Your Role

You are the **Strategic Oversight Bot** for AI Insights.

## Core Responsibilities

1. Monitor all active work streams and subagents
2. Track task completion and progress
3. Report daily/weekly summaries
4. Alert on blockers, delays, or failures
5. Ensure quality control before announcements
EOF

# Create SOUL.md
cat > SOUL.md << 'EOF'
# SOUL.md - Strategic Oversight Bot

## Core Truths

**Be proactive, not reactive.** Don't wait to be asked - monitor, detect, alert.

**Data over opinions.** Back up every claim with metrics, logs, or evidence.

**Catch issues early.** Better to false-alarm than miss a critical failure.
EOF

# Create TOOLS.md
cat > TOOLS.md << 'EOF'
# TOOLS.md - Local Notes

## SSH

- home-server → 192.168.1.100, user: admin

## TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
EOF

# Create learning directories
mkdir -p .learnings
touch .learnings/LEARNINGS.md .learnings/ERRORS.md .learnings/FEATURE_REQUESTS.md
```

---

### Step 5: Configure Plugins

Edit `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "telegram": {
      "botToken": "BOT_TOKEN_HERE",
      "channels": ["-1002381931352"]
    },
    "discord": {
      "botToken": "BOT_TOKEN_HERE",
      "guildId": "GUILD_ID_HERE"
    },
    "browser": {
      "profile": "chrome",
      "extensionRelay": true
    }
  }
}
```

**Restart Gateway**:
```bash
openclaw gateway restart
```

---

### Step 6: Set Up Cronjobs

```bash
# Daily report at 8 AM UTC
openclaw cron add --name daily-report \
  --cron "0 8 * * *" \
  --payload '{"type":"systemEvent","action":"report"}' \
  --delivery announce

# Health check every 6 hours
openclaw cron add --name healthcheck \
  --every 6h \
  --payload '{"type":"systemEvent","action":"healthcheck"}'

# List all jobs
openclaw cron list
```

---

### Step 7: Verify Setup

```bash
# Check gateway status
openclaw gateway status

# List installed skills
openclaw skills list

# Test message plugin
message action=send channel=telegram target=-1002381931352 \
  message="✅ OpenClaw setup complete"

# Run security audit
openclaw security audit

# Check version
openclaw update status
```

---

## Configuration Files Explained

OpenClaw uses workspace files to inject context into every session.

### AGENTS.md

**Purpose**: Multi-agent workflows, delegation patterns, team coordination.

**Contents**:
- Agent roles and responsibilities
- Task tracking procedures
- Reporting templates
- Alert triggers and escalation paths
- Quality control checkpoints

**Example**:
```markdown
# Strategic Oversight Bot - Instructions

## 🎯 Your Role

You are the **Strategic Oversight Bot**.

## Core Responsibilities

1. Monitor active subagents
2. Track task completion
3. Report daily/weekly summaries
4. Alert on blockers

## 🚨 Alert Triggers

Send immediate alert when:
- Subagent crashes without restart
- Task running >4 hours without checkpoint
- Publishing workflow fails
```

---

### SOUL.md

**Purpose**: Behavioral guidelines, personality, principles, communication style.

**Contents**:
- Core truths and mantras
- Communication style guidelines
- What to care about (✅ vs ❌)
- Decision-making principles

**Example**:
```markdown
# SOUL.md - Strategic Oversight Bot

## Core Truths

**Be proactive, not reactive.** Don't wait to be asked.

**Data over opinions.** Back up claims with metrics.

## Your Mantra

> "Monitor everything. Alert on exceptions. Report on patterns."

## Communication Style

- **Concise** - Bullet points over paragraphs
- **Metrics** - Numbers over adjectives
- **Actionable** - Every alert includes next steps
```

---

### IDENTITY.md

**Purpose**: Define agent identity, name, creature type, vibe, emoji, avatar.

**Contents**:
- Name (chosen by agent)
- Creature (AI, robot, familiar, etc.)
- Vibe (sharp, warm, chaotic, calm)
- Emoji (signature)
- Avatar (file path or URL)

**Example**:
```markdown
# IDENTITY.md - Who Am I?

- **Name:** Strategic Oversight Bot
- **Creature:** AI agent
- **Vibe:** Direct, data-driven, proactive
- **Emoji:** 🤖
- **Avatar:** avatars/openclaw.png
```

---

### TOOLS.md

**Purpose**: Environment-specific notes, device nicknames, preferred configurations.

**Contents**:
- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames

**Example**:
```markdown
# TOOLS.md - Local Notes

## Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

## SSH

- home-server → 192.168.1.100, user: admin

## TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

---

### MEMORY.md

**Purpose**: Long-term memory for main session (persistent context).

**Contents**:
- Project facts and conventions
- Workflow improvements
- Tool gotchas
- Behavioral patterns

**Structure**:
```markdown
# Memory

## 2026-03-10

### Learnings
- Use pnpm not npm for this project
- BigQuery tables: revenue, billing, api_usage

### Decisions
- Risk posture: Home/Workstation Balanced
- Scheduled daily reports at 8 AM UTC
```

---

## Workspace Structure Overview

```
~/.openclaw/workspace/oversight/
├── AGENTS.md              # Multi-agent workflows
├── SOUL.md                # Behavioral guidelines
├── IDENTITY.md            # Agent identity
├── TOOLS.md               # Environment-specific notes
├── MEMORY.md              # Long-term memory
├── USER.md                # About your human
├── .openclaw/             # OpenClaw config directory
│   └── cron/              # Cronjob persistence
│       └── task-persistence.json
├── .learnings/            # Self-improvement logs
│   ├── LEARNINGS.md
│   ├── ERRORS.md
│   └── FEATURE_REQUESTS.md
├── memory/                # Daily memory files
│   └── YYYY-MM-DD.md
├── skills/                # Custom skills
│   └── custom-skill/
│       └── SKILL.md
└── src/                   # Source files (if applicable)
    └── content/
        └── blog/
            └── posts.md
```

**Key Directories**:
| Directory | Purpose |
|-----------|---------|
| `.openclaw/cron/` | Cronjob persistence and checkpoints |
| `.learnings/` | Self-improvement log files |
| `memory/` | Daily memory snapshots |
| `skills/` | Custom skills created by user |

**Key Files**:
| File | Purpose |
|------|---------|
| `AGENTS.md` | Multi-agent workflows and delegation |
| `SOUL.md` | Behavioral guidelines and principles |
| `IDENTITY.md` | Agent identity and persona |
| `TOOLS.md` | Environment-specific configuration |
| `MEMORY.md` | Long-term memory (main session) |
| `USER.md` | Information about your human |

---

## Common Setup Mistakes

Avoid these pitfalls when setting up OpenClaw.

### 1. **Missing API Keys**

**Symptom**: Skills fail with authentication errors.

**Fix**:
```json
{
  "skills": {
    "entries": {
      "gh-issues": {
        "apiKey": "ghp_YourToken"
      }
    }
  }
}
```

**Verification**:
```bash
echo $GH_TOKEN  # Should show token
curl -H "Authorization: Bearer $GH_TOKEN" https://api.github.com/user
```

---

### 2. **Incorrect Skill Paths**

**Symptom**: Skills not loading or triggering.

**Fix**: Ensure skills are in correct directory:
```bash
# System skills
ls /usr/lib/node_modules/openclaw/skills/

# Custom skills
ls ~/.openclaw/skills/

# Workspace skills
ls ~/.openclaw/workspace/skills/
```

---

### 3. **Gateway Not Running**

**Symptom**: Commands fail, plugins don't work.

**Fix**:
```bash
# Check status
openclaw gateway status

# Start if stopped
openclaw gateway start

# Restart if needed
openclaw gateway restart
```

---

### 4. **Plugin Misconfiguration**

**Symptom**: Messages not sending, browser not connecting.

**Fix**: Verify plugin config in `~/.openclaw/openclaw.json`:
```json
{
  "plugins": {
    "telegram": {
      "botToken": "VALID_TOKEN",
      "channels": ["-1002381931352"]
    }
  }
}
```

**Test**:
```bash
message action=send channel=telegram target=-1002381931352 \
  message="Test message"
```

---

### 5. **Cronjob Not Persisting**

**Symptom**: Jobs lost after Gateway restart.

**Cause**: Manual editing of `jobs.json` while Gateway runs.

**Fix**: Use CLI commands only:
```bash
# Don't edit ~/.openclaw/cron/jobs.json manually
# Use CLI instead:
openclaw cron add ...
openclaw cron edit <id> ...
openclaw cron delete <id>
```

---

### 6. **Subagent Timeout Without Checkpoint**

**Symptom**: Long tasks fail, no progress saved.

**Fix**: For tasks >4 hours:
- Require checkpoint saves
- Set appropriate timeouts
- Monitor with `process` tool
- Alert if running without checkpoint

---

### 7. **Workspace Files Missing**

**Symptom**: Agent behavior inconsistent across sessions.

**Fix**: Ensure all config files exist:
```bash
cd ~/.openclaw/workspace/oversight
ls -la AGENTS.md SOUL.md IDENTITY.md TOOLS.md MEMORY.md
```

Create missing files:
```bash
touch AGENTS.md SOUL.md IDENTITY.md TOOLS.md
```

---

### 8. **Browser Extension Not Attached**

**Symptom**: Browser commands fail, tabs not accessible.

**Fix**:
1. Install OpenClaw Browser Relay extension in Chrome
2. Navigate to target tab
3. Click extension toolbar icon (badge must turn ON)
4. Use `profile="chrome"` in browser commands

---

## Verification Checklist

After setup, verify everything works:

### ✅ Gateway Status
```bash
openclaw gateway status
# Should show: ✅ Active
```

### ✅ Skills Installed
```bash
openclaw skills list
# Should show: gh-issues, github, skill-creator, weather, healthcheck, self-improvement
```

### ✅ API Keys Configured
```bash
# GitHub
echo $GH_TOKEN  # Should show token (first 10 chars)

# Test API call
curl -s -H "Authorization: Bearer $GH_TOKEN" https://api.github.com/user | jq '.login'
```

### ✅ Plugins Working
```bash
# Telegram
message action=send channel=telegram target=-1002381931352 \
  message="✅ Setup verification"

# Discord
message action=send channel=discord target=channel-id \
  message="✅ Setup verification"
```

### ✅ Workspace Files Present
```bash
cd ~/.openclaw/workspace/oversight
ls -la AGENTS.md SOUL.md IDENTITY.md TOOLS.md MEMORY.md USER.md
# All files should exist
```

### ✅ Learning Directories Created
```bash
ls -la ~/.openclaw/workspace/.learnings/
# Should show: LEARNINGS.md, ERRORS.md, FEATURE_REQUESTS.md
```

### ✅ Cronjobs Scheduled
```bash
openclaw cron list
# Should show: daily-report, healthcheck (if configured)
```

### ✅ Subagents Can Spawn
```bash
# Test spawn (will create test session)
subagents action=list
# Should show active sessions
```

### ✅ Browser Control Ready
```bash
browser action=status
# Should show browser status
```

### ✅ Security Audit Passed
```bash
openclaw security audit
# Should complete without critical issues
```

---

## Troubleshooting

### Problem: Skills Not Triggering

**Symptoms**:
- Skill commands don't work
- "Unknown command" errors

**Solutions**:
1. Verify skill is installed:
   ```bash
   ls /usr/lib/node_modules/openclaw/skills/skill-name/
   ```

2. Check skill description matches trigger:
   ```bash
   cat /usr/lib/node_modules/openclaw/skills/skill-name/SKILL.md | head -10
   ```

3. Restart Gateway:
   ```bash
   openclaw gateway restart
   ```

4. Test invocation:
   ```bash
   # Ask: "Use the weather skill"
   ```

---

### Problem: Subagents Not Spawning

**Symptoms**:
- `sessions_spawn` fails
- No subagent appears in `subagents list`

**Solutions**:
1. Check concurrent limit:
   ```bash
   # Default: 8 concurrent
   # Reduce if resource-constrained
   ```

2. Verify model availability:
   ```bash
   # Check configured models in openclaw.json
   ```

3. Check timeout settings:
   ```bash
   # Ensure runTimeoutSeconds is appropriate
   # 60 minutes for code fixes, 30 for research
   ```

4. Review logs:
   ```bash
   cat /tmp/openclaw/openclaw-*.log | tail -50
   ```

---

### Problem: Plugins Not Sending Messages

**Symptoms**:
- `message` tool fails
- "Channel not found" errors

**Solutions**:
1. Verify bot token:
   ```json
   {
     "plugins": {
       "telegram": {
         "botToken": "VALID_TOKEN"
       }
     }
   }
   ```

2. Check channel ID format:
   - Telegram: `-1002381931352` (includes leading -100)
   - Discord: numeric channel ID

3. Test bot connectivity:
   ```bash
   curl "https://api.telegram.org/botTOKEN/getMe"
   ```

4. Restart Gateway:
   ```bash
   openclaw gateway restart
   ```

---

### Problem: Browser Commands Fail

**Symptoms**:
- "No tab attached" errors
- Browser actions timeout

**Solutions**:
1. Verify Chrome extension installed
2. Click extension icon on target tab (badge ON)
3. Use correct profile:
   ```bash
   # For Chrome extension relay
   browser action=... profile="chrome"
   ```

4. Check browser status:
   ```bash
   browser action=status
   ```

5. Restart browser:
   ```bash
   browser action=stop
   browser action=start profile=chrome
   ```

---

### Problem: Cronjobs Not Running

**Symptoms**:
- Jobs not executing at scheduled times
- "No jobs found" after restart

**Solutions**:
1. Verify jobs persisted:
   ```bash
   cat ~/.openclaw/cron/jobs.json | jq '.'
   ```

2. Check Gateway running:
   ```bash
   openclaw gateway status
   ```

3. Verify cron syntax:
   ```bash
   # Test cron expression
   # Use https://crontab.guru for validation
   ```

4. Check delivery configuration:
   ```bash
   openclaw cron list --json
   ```

5. Review Gateway logs:
   ```bash
   tail -f /tmp/openclaw/openclaw-*.log
   ```

---

### Problem: Workspace Files Not Loading

**Symptoms**:
- Agent forgets context between sessions
- Configuration not applied

**Solutions**:
1. Verify file locations:
   ```bash
   ls -la ~/.openclaw/workspace/oversight/
   ```

2. Check file permissions:
   ```bash
   chmod 644 ~/.openclaw/workspace/oversight/*.md
   ```

3. Validate file format:
   ```bash
   # Ensure markdown is valid
   cat AGENTS.md | head -20
   ```

4. Restart session:
   ```bash
   # End current session, start new one
   ```

---

### Problem: Self-Improvement Not Logging

**Symptoms**:
- Learnings not saved
- `.learnings/` directory missing

**Solutions**:
1. Create directory:
   ```bash
   mkdir -p ~/.openclaw/workspace/.learnings
   ```

2. Create log files:
   ```bash
   touch .learnings/LEARNINGS.md .learnings/ERRORS.md .learnings/FEATURE_REQUESTS.md
   ```

3. Test logging:
   ```bash
   # Manually add entry to LEARNINGS.md
   ```

4. Verify skill loaded:
   ```bash
   # Ask: "Log this to learnings"
   ```

---

## Quick Setup Checklist

Copy this checklist and tick off each item:

```markdown
## OpenClaw Setup Checklist

### Prerequisites
- [ ] Node.js v22.x installed
- [ ] Git configured
- [ ] curl available
- [ ] GitHub CLI installed (optional)

### Installation
- [ ] OpenClaw installed: `npm install -g openclaw`
- [ ] Setup wizard run: `openclaw wizard`
- [ ] Gateway started: `openclaw gateway start`

### Configuration
- [ ] GitHub token configured in `~/.openclaw/openclaw.json`
- [ ] Telegram bot token added (if using)
- [ ] Discord bot token added (if using)
- [ ] Browser extension installed (if using)

### Skills
- [ ] gh-issues skill configured
- [ ] github skill tested
- [ ] skill-creator available
- [ ] weather skill tested
- [ ] healthcheck skill available
- [ ] self-improvement learning files created

### Workspace
- [ ] Workspace directory created
- [ ] AGENTS.md created
- [ ] SOUL.md created
- [ ] IDENTITY.md created
- [ ] TOOLS.md created
- [ ] MEMORY.md created
- [ ] USER.md created
- [ ] .learnings/ directory with log files

### Plugins
- [ ] Telegram plugin tested
- [ ] Discord plugin tested (if using)
- [ ] Browser control working (if using)

### Automation
- [ ] Daily report cronjob scheduled
- [ ] Health check cronjob scheduled
- [ ] Security audit scheduled (optional)

### Verification
- [ ] Gateway status: ✅ Active
- [ ] Skills list: All essential skills shown
- [ ] Test message sent successfully
- [ ] Security audit passed
- [ ] Subagents can spawn
- [ ] Browser control ready (if using)

### Documentation
- [ ] Workspace structure documented
- [ ] Configuration files explained
- [ ] Troubleshooting guide bookmarked
```

---

## Conclusion

OpenClaw transforms your AI assistant into a **proactive automation platform** with modular skills, parallel subagents, and powerful integrations. By following this guide, you've set up:

✅ **Essential Skills**: gh-issues, github, skill-creator, weather, healthcheck, self-improvement  
✅ **Subagent Management**: Parallel workers for coding and general tasks  
✅ **Plugins**: Discord, Telegram, WhatsApp, browser control, canvas/nodes  
✅ **Cronjobs**: Scheduled automation for reports and health checks  
✅ **Workspace Configuration**: AGENTS.md, SOUL.md, IDENTITY.md, TOOLS.md, MEMORY.md  
✅ **Verification**: Complete checklist to ensure everything works  

**Next Steps**:
1. Customize your workspace files (AGENTS.md, SOUL.md) to match your workflow
2. Install additional skills from the official repository
3. Set up more cronjobs for your specific use cases
4. Join the OpenClaw community for tips and skill sharing

**Resources**:
- Official Documentation: https://openclaw.dev/docs
- Skill Repository: https://github.com/openclaw/skills
- Community Forum: https://discord.gg/openclaw
- ClawHub Skill Registry: `clawhub search`

---

**Happy Automating!** 🤖
