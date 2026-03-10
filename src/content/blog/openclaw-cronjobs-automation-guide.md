# Automate Everything: How to Schedule AI Tasks with OpenClaw Cronjobs (2026 Guide)

**Published:** March 10, 2026  
**Reading Time:** 18 minutes  
**Category:** AI Automation, OpenClaw, Productivity  
**Tags:** openclaw, cronjobs, automation, AI-agents, scheduling, productivity

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What Are OpenClaw Cronjobs?](#what-are-openclaw-cronjobs)
3. [Why Cronjobs Matter for AI Automation](#why-cronjobs-matter-for-ai-automation)
4. [Key Use Cases & Real-World Examples](#key-use-cases--real-world-examples)
5. [Cron Schedule Formats Explained](#cron-schedule-formats-explained)
6. [Step-by-Step: Setting Up Your First Cronjob](#step-by-step-setting-up-your-first-cronjob)
7. [Payload Types: systemEvent vs agentTurn](#payload-types-systemevent-vs-agentturn)
8. [Advanced Configuration & Delivery Options](#advanced-configuration--delivery-options)
9. [Best Practices for Reliable Automation](#best-practices-for-reliable-automation)
10. [Common Pitfalls & Troubleshooting](#common-pitfalls--troubleshooting)
11. [Real-World Code Examples](#real-world-code-examples)
12. [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Executive Summary

OpenClaw's built-in cronjob system transforms your AI agent from a **reactive tool** into a **proactive partner** that works for you 24/7. Whether you need daily reports, automated monitoring, scheduled data collection, or periodic content generation, cronjobs handle it all—without requiring constant human intervention.

**Key Capabilities:**
- ✅ **Three schedule types**: One-shot (`at`), recurring intervals (`every`), and cron expressions (`cron`)
- ✅ **Two execution modes**: Main session (with full context) or isolated sessions (background tasks)
- ✅ **Flexible delivery**: Announce to chat, webhook POST, or internal-only execution
- ✅ **Persistent storage**: Jobs survive Gateway restarts, stored in `~/.openclaw/cron/jobs.json`
- ✅ **Smart retry logic**: Exponential backoff for transient errors, automatic disable on permanent failures
- ✅ **Model overrides**: Per-job model and thinking level configuration

**Quick Stats:**
- **Setup Time**: 5-10 minutes for basic jobs
- **Reliability**: 99%+ uptime with proper configuration
- **Scalability**: Run 10-100+ concurrent jobs depending on workload
- **Cost**: Free (included with OpenClaw, no additional API fees)

**What You'll Learn:**
This guide covers everything from your first "Hello World" cronjob to advanced multi-agent orchestration, complete with working code examples, troubleshooting strategies, and a quick-reference cheat sheet.

---

## What Are OpenClaw Cronjobs?

OpenClaw cronjobs are **scheduled tasks** that automatically trigger your AI agent at specified times or intervals. Think of them as alarms that wake up your AI and give it specific instructions—except instead of just making noise, the AI actually *does something useful*.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                          │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │ Cron Scheduler│─────▶│  Job Store   │─────▶│  Agent    │ │
│  │  (runs jobs) │      │ (jobs.json)  │      │  Execution│ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                                         │         │
│         ▼                                         ▼         │
│  ┌──────────────┐                         ┌───────────┐     │
│  │ Schedule     │                         │ Delivery  │     │
│  │ - at         │                         │ - announce│     │
│  │ - every      │                         │ - webhook │     │
│  │ - cron       │                         │ - none    │     │
│  └──────────────┘                         └───────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

**1. Job Store** (`~/.openclaw/cron/jobs.json`)
- Persists all scheduled jobs
- Survives Gateway restarts
- Managed via CLI or API (avoid manual editing while Gateway runs)

**2. Scheduler**
- Runs inside the Gateway process
- Checks for due jobs every few seconds
- Handles wake modes (immediate vs next heartbeat)

**3. Execution Engine**
- Runs jobs in main session or isolated sessions
- Applies model/thinking overrides
- Manages timeouts and retries

**4. Delivery System**
- Announces results to chat channels
- Posts to webhooks
- Suppresses duplicates

### Cron vs Heartbeat: When to Use Which

**Use Cronjobs When:**
- ✅ You need specific tasks at specific times
- ✅ Different tasks require different prompts/models
- ✅ You want isolated execution (no context pollution)
- ✅ Tasks should run even if main session is busy

**Use Heartbeat When:**
- ✅ You want a simple "check-in" every N minutes
- ✅ All tasks share the same context
- ✅ You prefer one unified prompt managing everything

**Pro Tip**: Many users run both—a heartbeat for general monitoring and cronjobs for specific scheduled tasks.

---

## Why Cronjobs Matter for AI Automation

### The Problem: Reactive AI is Limited

Without cronjobs, your AI agent only works when you explicitly ask it to. This means:
- ❌ Missed opportunities (no proactive monitoring)
- ❌ Forgotten tasks (daily reports don't write themselves)
- ❌ Inconsistent execution (you skip days when busy)
- ❌ No background processing (everything blocks your workflow)

### The Solution: Proactive Automation

Cronjobs enable your AI to:
- ✅ **Work while you sleep** - Overnight data collection, report generation
- ✅ **Never forget** - Scheduled tasks run reliably, every time
- ✅ **Multi-task** - Run background jobs while you work on other things
- ✅ **Scale operations** - Manage 10x more with the same effort

### Real Impact: Before & After

**Before Cronjobs:**
```
Monday 9:00 AM - You remember to check analytics
Monday 2:00 PM - You forget to send the daily summary
Tuesday - Vacation, no monitoring happens
Wednesday - Overwhelmed, skip the weekly report
```

**After Cronjobs:**
```
Monday 6:00 AM - Analytics report delivered automatically
Monday 5:00 PM - Daily summary posted to Slack
Tuesday - All monitoring continues while you're away
Wednesday - Weekly report ready before you ask
```

---

## Key Use Cases & Real-World Examples

### 1. Daily/Weekly Reports

**Use Case**: Automated status reports delivered to your team

**Example**: Daily analytics summary every morning at 7 AM

```bash
openclaw cron add \
  --name "Daily Analytics Report" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate a daily analytics report: 1) Pull yesterday's key metrics 2) Compare to previous week 3) Highlight anomalies 4) Format as markdown table 5) Post to #analytics channel" \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```

**Example**: Weekly executive summary every Monday at 9 AM

```bash
openclaw cron add \
  --name "Weekly Executive Summary" \
  --cron "0 9 * * 1" \
  --tz "Europe/Berlin" \
  --session isolated \
  --message "Create weekly executive summary covering: revenue, user growth, top issues, key wins. Keep it under 500 words. Use professional tone." \
  --announce \
  --channel telegram \
  --to "-1001234567890"
```

---

### 2. Automated Monitoring & Alerts

**Use Case**: Continuous system monitoring with alerting

**Example**: Hourly health check with alert on issues

```bash
openclaw cron add \
  --name "System Health Check" \
  --every 1h \
  --session isolated \
  --message "Check system health: 1) API response times 2) Error rates 3) Disk usage 4) Active connections. If ANY metric exceeds threshold, alert immediately with details." \
  --announce \
  --channel discord \
  --to "channel:9876543210" \
  --model "opus" \
  --thinking high
```

**Example**: Error log monitoring every 15 minutes

```bash
openclaw cron add \
  --name "Error Log Monitor" \
  --every 15m \
  --session isolated \
  --message "Scan error logs from last 15 minutes. Categorize errors by severity. If critical errors found, create detailed incident report with stack traces and affected services." \
  --announce \
  --channel slack \
  --to "channel:alerts"
```

---

### 3. Scheduled Data Collection

**Use Case**: Periodic data gathering for analysis

**Example**: Hourly price monitoring

```bash
openclaw cron add \
  --name "Competitor Price Tracker" \
  --every 1h \
  --session isolated \
  --light-context \
  --message "Scrape competitor prices for our top 20 products. Store in structured format. Flag any price changes >10%. Update pricing dashboard." \
  --delivery none
```

**Example**: Daily market research

```bash
openclaw cron add \
  --name "Daily Market Research" \
  --cron "0 8 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Research trending topics in our industry: 1) Search Google News 2) Check Reddit trends 3) Review Twitter hashtags 4) Summarize top 5 trends with links" \
  --announce \
  --channel last
```

---

### 4. Periodic Content Generation

**Use Case**: Automated content creation on schedule

**Example**: Daily social media posts

```bash
openclaw cron add \
  --name "Daily Social Media Post" \
  --cron "0 10 * * *" \
  --tz "UTC" \
  --session isolated \
  --message "Create an engaging social media post about: [rotate through content themes]. Include relevant hashtags. Keep under 280 characters. Generate accompanying image description." \
  --announce \
  --channel twitter
```

**Example**: Weekly blog post outline

```bash
openclaw cron add \
  --name "Weekly Blog Outline" \
  --cron "0 14 * * 3" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate blog post outline for next week: 1) Research trending topics 2) Identify knowledge gaps 3) Create detailed outline with H2/H3 headers 4) Suggest target keywords 5) Estimate word count" \
  --announce \
  --channel slack \
  --to "channel:content-team"
```

---

### 5. Reminder Systems

**Use Case**: Smart reminders with context

**Example**: Meeting prep reminder

```bash
openclaw cron add \
  --name "Meeting Prep Reminder" \
  --at "2026-03-15T13:30:00-05:00" \
  --session main \
  --system-event "REMINDER: Team meeting in 30 minutes. Quick prep: 1) Review yesterday's action items 2) Check if any blockers need escalation 3) Prepare 2-minute status update" \
  --wake now \
  --delete-after-run
```

**Example**: Recurring deadline reminders

```bash
openclaw cron add \
  --name "Weekly Report Deadline" \
  --cron "0 15 * * 4" \
  --tz "Europe/Berlin" \
  --session main \
  --system-event "REMINDER: Weekly report due tomorrow at 5 PM. Start drafting now to avoid last-minute rush. Check data sources are up to date." \
  --wake now
```

---

### 6. Health Checks & Maintenance

**Use Case**: Automated system maintenance

**Example**: Daily backup verification

```bash
openclaw cron add \
  --name "Backup Verification" \
  --cron "0 3 * * *" \
  --tz "UTC" \
  --session isolated \
  --message "Verify yesterday's backups: 1) Check backup files exist 2) Validate file sizes 3) Test restore on sample files 4) Report any failures immediately" \
  --announce \
  --channel slack \
  --to "channel:ops"
```

**Example**: Weekly cleanup task

```bash
openclaw cron add \
  --name "Weekly Cleanup" \
  --cron "0 2 * * 0" \
  --tz "America/New_York" \
  --session isolated \
  --light-context \
  --message "Perform weekly cleanup: 1) Delete temp files older than 7 days 2) Archive completed tasks 3) Clear old log entries 4) Report disk space freed" \
  --delivery none
```

---

## Cron Schedule Formats Explained

OpenClaw supports **three schedule types**, each suited for different use cases:

### 1. `at` - One-Shot Execution

Run once at a specific time or after a duration.

**Format**: ISO 8601 timestamp or relative duration

**Examples**:

```bash
# Specific timestamp (UTC)
openclaw cron add --at "2026-03-15T14:00:00Z"

# Relative duration (from now)
openclaw cron add --at "30m"     # in 30 minutes
openclaw cron add --at "2h"      # in 2 hours
openclaw cron add --at "1d"      # in 1 day

# With timezone
openclaw cron add --at "2026-03-15T09:00:00-05:00"
```

**Best For**: Reminders, one-time tasks, scheduled announcements

**Auto-Delete Behavior**: One-shot jobs delete after successful run by default. Use `--keep-after-run` to retain them.

---

### 2. `every` - Fixed Interval Execution

Run repeatedly at fixed time intervals.

**Format**: Duration string (e.g., `10m`, `1h`, `30s`)

**Examples**:

```bash
# Every 5 minutes
openclaw cron add --every 5m

# Every hour
openclaw cron add --every 1h

# Every 30 seconds (high frequency!)
openclaw cron add --every 30s

# Every 6 hours
openclaw cron add --every 6h

# Every day
openclaw cron add --every 24h
```

**Best For**: Monitoring, health checks, frequent data collection

**Note**: Interval is measured from job creation time (anchor). `--every 1h` created at 10:23 runs at 11:23, 12:23, etc.

---

### 3. `cron` - Cron Expression (Maximum Flexibility)

Standard Unix-style cron expressions with optional timezone.

**Format**: 5-field or 6-field cron expression

**5-Field Format** (most common):
```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12 or JAN-DEC)
│ │ │ │ ┌───────────── day of week (0-6 or SUN-SAT)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**6-Field Format** (with seconds):
```
┌───────────── second (0-59)
│ ┌───────────── minute (0-59)
│ │ ┌───────────── hour (0-23)
│ │ │ ┌───────────── day of month (1-31)
│ │ │ │ ┌───────────── month (1-12)
│ │ │ │ │ ┌───────────── day of week (0-6)
│ │ │ │ │ │
│ │ │ │ │ │
* * * * * *
```

**Common Examples**:

```bash
# Every minute
openclaw cron add --cron "* * * * *"

# Every hour at minute 0
openclaw cron add --cron "0 * * * *"

# Every day at 7 AM
openclaw cron add --cron "0 7 * * *"

# Every weekday at 9 AM
openclaw cron add --cron "0 9 * * 1-5"

# Every Monday at 9 AM
openclaw cron add --cron "0 9 * * 1"

# Every 15 minutes
openclaw cron add --cron "*/15 * * * *"

# Every 2 hours
openclaw cron add --cron "0 */2 * * *"

# Daily at midnight
openclaw cron add --cron "0 0 * * *"

# Weekly on Sunday at 2 AM
openclaw cron add --cron "0 2 * * 0"

# Monthly on 1st at 6 AM
openclaw cron add --cron "0 6 1 * *"

# Every minute (6-field with seconds)
openclaw cron add --cron "0 * * * * *"
```

**With Timezone**:

```bash
# 7 AM Eastern Time
openclaw cron add --cron "0 7 * * *" --tz "America/New_York"

# 9 AM Berlin Time
openclaw cron add --cron "0 9 * * *" --tz "Europe/Berlin"

# Midnight UTC
openclaw cron add --cron "0 0 * * *" --tz "UTC"
```

**Advanced Features**:

```bash
# Multiple times: 9 AM and 5 PM
openclaw cron add --cron "0 9,17 * * *"

# Range: Every hour from 9 AM to 5 PM
openclaw cron add --cron "0 9-17 * * *"

# Step: Every 15 minutes during business hours
openclaw cron add --cron "*/15 9-17 * * 1-5"

# Last day of month
openclaw cron add --cron "0 0 L * *"

# Specific months: Jan, Apr, Jul, Oct
openclaw cron add --cron "0 0 1 1,4,7,10 *"
```

**Best For**: Complex schedules, business hours, specific days/times

---

### Staggering: Avoid Thundering Herd

OpenClaw automatically staggers top-of-hour cron jobs by up to 5 minutes to prevent load spikes.

**Control Staggering**:

```bash
# Force exact timing (no stagger)
openclaw cron add --cron "0 * * * *" --exact

# Custom stagger window
openclaw cron add --cron "0 * * * *" --stagger 30s
openclaw cron add --cron "0 * * * *" --stagger 2m
```

---

## Step-by-Step: Setting Up Your First Cronjob

Let's walk through creating a practical cronjob from scratch.

### Scenario: Daily Morning Brief

You want a daily summary of overnight updates delivered to your Slack channel every morning at 7 AM.

### Step 1: Plan Your Job

```
Name: Morning Brief
Schedule: Every day at 7 AM (your timezone)
Session: Isolated (don't pollute main chat)
Prompt: "Summarize overnight updates"
Delivery: Announce to Slack
```

### Step 2: Create the Job

```bash
openclaw cron add \
  --name "Morning Brief" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate a morning brief summarizing: 1) Overnight system activity 2) Any errors or alerts 3) Key metrics from yesterday 4) Top priorities for today. Keep it concise (under 300 words). Format with bullet points." \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```

### Step 3: Verify the Job

```bash
# List all cronjobs
openclaw cron list

# Expected output:
# │ ID                                   │ Name           │ Schedule      │ Next Run   │ Status  │
# │ a1b2c3d4-...                         │ Morning Brief  │ 0 7 * * *     │ in 14h     │ enabled │
```

### Step 4: Test Immediately (Optional)

Don't wait until 7 AM—test it now:

```bash
# Run the job immediately (force mode)
openclaw cron run a1b2c3d4-...

# Or only run if it's due
openclaw cron run a1b2c3d4-... --due
```

### Step 5: Check Execution History

```bash
# View run history for this job
openclaw cron runs --id a1b2c3d4-... --limit 10

# View all cron run history
openclaw cron runs
```

### Step 6: Monitor & Adjust

Check if the job ran successfully:

```bash
# Check job status
openclaw cron list

# If there are errors, view details
openclaw cron runs --id a1b2c3d4-... --limit 5
```

**Adjust if needed**:

```bash
# Update the prompt
openclaw cron edit a1b2c3d4-... \
  --message "Updated prompt with more details..."

# Change the schedule
openclaw cron edit a1b2c3d4-... \
  --cron "0 6 * * *"

# Disable temporarily
openclaw cron disable a1b2c3d4-...

# Re-enable
openclaw cron enable a1b2c3d4-...
```

### Step 7: Remove When Done

```bash
# Delete the job
openclaw cron rm a1b2c3d4-...
```

---

## Payload Types: systemEvent vs agentTurn

OpenClaw supports two payload types, each tied to a specific execution mode.

### systemEvent (Main Session Only)

**Purpose**: Enqueue an event for the main session's next heartbeat.

**Characteristics**:
- ✅ Runs in main session (full context)
- ✅ Triggers heartbeat (optional)
- ✅ No direct delivery (part of main chat flow)
- ❌ Cannot use `--announce`

**Format**:
```json
{
  "kind": "systemEvent",
  "text": "Your instruction here"
}
```

**CLI Example**:
```bash
openclaw cron add \
  --name "Calendar Check" \
  --at "20m" \
  --session main \
  --system-event "Next heartbeat: check calendar for today's meetings and prepare briefing." \
  --wake now
```

**When to Use**:
- Tasks that need full conversation context
- Reminders that should appear in your main chat
- Simple one-off tasks

---

### agentTurn (Isolated Session Only)

**Purpose**: Run a dedicated agent turn in an isolated session.

**Characteristics**:
- ✅ Fresh session (no context pollution)
- ✅ Supports delivery (announce/webhook/none)
- ✅ Model and thinking overrides
- ✅ Lightweight bootstrap option
- ❌ No access to main session history

**Format**:
```json
{
  "kind": "agentTurn",
  "message": "Your instruction here",
  "model": "opus",              // optional
  "thinking": "high",           // optional
  "timeoutSeconds": 120,        // optional
  "lightContext": true          // optional
}
```

**CLI Example**:
```bash
openclaw cron add \
  --name "Deep Analysis" \
  --cron "0 6 * * 1" \
  --session isolated \
  --message "Perform deep analysis of weekly metrics..." \
  --model "opus" \
  --thinking high \
  --announce \
  --channel slack \
  --to "channel:analytics"
```

**When to Use**:
- Background tasks that shouldn't clutter main chat
- Jobs requiring different models/thinking levels
- High-frequency monitoring
- Tasks with dedicated delivery targets

---

### Comparison Table

| Feature | systemEvent | agentTurn |
|---------|-------------|-----------|
| Session | Main | Isolated |
| Context | Full history | Fresh session |
| Delivery | Main chat only | Announce/Webhook/None |
| Model Override | ⚠️ Changes main session | ✅ Per-job only |
| Thinking Level | ❌ No | ✅ Yes |
| Light Context | ❌ No | ✅ Yes |
| Best For | Reminders, simple tasks | Background jobs, monitoring |

---

## Advanced Configuration & Delivery Options

### Delivery Modes

**1. Announce (Default for Isolated Jobs)**

Delivers output to a channel and posts summary to main session.

```bash
openclaw cron add \
  --name "Status Report" \
  --session isolated \
  --message "Generate status report" \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```

**2. Webhook**

POSTs result to an HTTP endpoint.

```bash
openclaw cron add \
  --name "Webhook Notification" \
  --session isolated \
  --message "Generate alert" \
  --delivery webhook \
  --to "https://your-server.com/webhook"
```

**3. None (Internal Only)**

No delivery—useful for background data processing.

```bash
openclaw cron add \
  --name "Data Collection" \
  --session isolated \
  --message "Collect and store data" \
  --delivery none
```

---

### Model & Thinking Overrides

Override the default model and thinking level per job:

```bash
# Use Opus for complex reasoning
openclaw cron add \
  --name "Strategic Analysis" \
  --model "opus" \
  --thinking high

# Use fast model for simple tasks
openclaw cron add \
  --name "Quick Check" \
  --model "haiku" \
  --thinking off

# Use specific provider model
openclaw cron add \
  --name "Premium Task" \
  --model "anthropic/claude-sonnet-4-20250514" \
  --thinking medium
```

**Available Thinking Levels**:
- `off` - No thinking (fastest)
- `minimal` - Minimal reasoning
- `low` - Basic reasoning
- `medium` - Balanced (default)
- `high` - Deep reasoning
- `xhigh` - Maximum reasoning (GPT-5.2 + Codex only)

---

### Lightweight Bootstrap Context

For jobs that don't need workspace file injection:

```bash
openclaw cron add \
  --name "Quick API Call" \
  --session isolated \
  --light-context \
  --message "Call external API and return result"
```

**Benefits**:
- ✅ Faster startup
- ✅ Less overhead
- ✅ Reduced token usage

**When to Use**:
- Simple API calls
- Data fetching without workspace context
- High-frequency jobs where speed matters

---

### Agent Selection (Multi-Agent Setups)

Pin a job to a specific agent:

```bash
# Create job for specific agent
openclaw cron add \
  --name "Ops Sweep" \
  --agent ops \
  --message "Check ops queue"

# Edit existing job's agent
openclaw cron edit <jobId> --agent ops

# Clear agent binding (use default)
openclaw cron edit <jobId> --clear-agent
```

---

### Timeout Configuration

Override default timeout (30 seconds):

```bash
# 2-minute timeout
openclaw cron add \
  --name "Long Analysis" \
  --timeout-seconds 120

# 5-minute timeout for complex tasks
openclaw cron add \
  --name "Deep Research" \
  --timeout-seconds 300
```

---

## Best Practices for Reliable Automation

### 1. Use Descriptive Names

```bash
# ❌ Bad
openclaw cron add --name "Report" ...

# ✅ Good
openclaw cron add --name "Daily Analytics Report - Slack" ...
```

### 2. Set Appropriate Timezones

Always specify timezone for cron expressions:

```bash
# ❌ Ambiguous (uses Gateway host timezone)
openclaw cron add --cron "0 7 * * *" ...

# ✅ Explicit
openclaw cron add --cron "0 7 * * *" --tz "America/New_York" ...
```

### 3. Use Isolated Sessions for Noisy Jobs

Keep main chat clean:

```bash
# ✅ High-frequency monitoring in isolated session
openclaw cron add \
  --every 5m \
  --session isolated \
  --message "Check system health" \
  --announce \
  --channel slack
```

### 4. Configure Delivery Appropriately

Match delivery mode to use case:

```bash
# ✅ Alerts → Announce to channel
openclaw cron add --announce --channel slack --to "channel:alerts"

# ✅ Integrations → Webhook
openclaw cron add --delivery webhook --to "https://api.example.com/hook"

# ✅ Background tasks → No delivery
openclaw cron add --delivery none
```

### 5. Set Reasonable Timeouts

Don't let jobs hang forever:

```bash
# Quick checks: 30-60 seconds
openclaw cron add --timeout-seconds 60

# Complex analysis: 2-5 minutes
openclaw cron add --timeout-seconds 300
```

### 6. Use Light Context When Possible

Faster execution for simple tasks:

```bash
openclaw cron add \
  --light-context \
  --message "Fetch API data and store"
```

### 7. Test Before Deploying

Always test manually first:

```bash
# Create job
openclaw cron add ...

# Test immediately
openclaw cron run <jobId>

# Check result
openclaw cron runs --id <jobId> --limit 5

# Enable for production
openclaw cron enable <jobId>
```

### 8. Monitor Run History

Regularly check for errors:

```bash
# Daily check
openclaw cron runs --limit 50

# Filter by job
openclaw cron runs --id <jobId> --limit 20
```

### 9. Document Your Jobs

Keep a record of what each job does:

```bash
openclaw cron add \
  --name "Daily Analytics" \
  --description "Generates daily analytics report and posts to #analytics Slack channel. Runs at 7 AM EST." \
  ...
```

### 10. Clean Up Old Jobs

Remove jobs you no longer need:

```bash
# List all jobs
openclaw cron list

# Remove obsolete job
openclaw cron rm <jobId>
```

---

## Common Pitfalls & Troubleshooting

### Problem: "Nothing Runs"

**Symptoms**: Jobs created but never execute.

**Causes & Solutions**:

```bash
# 1. Check if cron is enabled
openclaw cron status

# 2. Verify Gateway is running continuously
# Cron runs inside Gateway process

# 3. Check job is enabled
openclaw cron list
# Look for "disabled" status

# 4. Verify timezone
openclaw cron edit <jobId> --tz "UTC"

# 5. Check Gateway logs
tail -f /tmp/openclaw/openclaw-*.log
```

---

### Problem: Job Keeps Failing

**Symptoms**: `consecutiveErrors` increasing, job delays.

**Causes & Solutions**:

```bash
# View error details
openclaw cron runs --id <jobId> --limit 5

# Common errors:

# 1. Rate limiting (429)
# → Increase interval or add stagger
openclaw cron edit <jobId> --stagger 5m

# 2. Invalid delivery target
# → Verify channel ID
openclaw cron edit <jobId> --to "channel:CORRECT_ID"

# 3. Timeout
# → Increase timeout
openclaw cron edit <jobId> --timeout-seconds 300

# 4. Model unavailable
# → Use different model
openclaw cron edit <jobId> --model "haiku"

# 5. Permanent error (auth failure)
# → Fix credentials, re-enable job
openclaw cron enable <jobId>
```

**Retry Behavior**:
- **One-shot jobs**: Retry up to 3 times with exponential backoff (30s → 1m → 5m)
- **Recurring jobs**: Backoff between runs (30s → 1m → 5m → 15m → 60m)

---

### Problem: Wrong Delivery Target

**Symptoms**: Messages going to wrong channel/user.

**Solutions**:

```bash
# Slack/Discord: Use explicit prefixes
openclaw cron edit <jobId> --to "channel:C1234567890"
openclaw cron edit <jobId> --to "user:U1234567890"

# Telegram topics: Use explicit topic marker
openclaw cron edit <jobId> --to "-1001234567890:topic:123"

# Verify last route
# Check where previous messages were delivered
```

---

### Problem: Jobs Running at Wrong Time

**Symptoms**: Job runs at unexpected times.

**Causes & Solutions**:

```bash
# 1. Timezone mismatch
# Always specify timezone explicitly
openclaw cron edit <jobId> --tz "America/New_York"

# 2. Staggering (automatic)
# Force exact timing
openclaw cron edit <jobId> --exact

# 3. Wrong cron expression
# Verify with cron expression tester
# Example: "0 7 * * *" = 7 AM every day
```

---

### Problem: Main Session Spam

**Symptoms**: Too many messages in main chat.

**Solutions**:

```bash
# Move to isolated session
openclaw cron edit <jobId> \
  --session isolated \
  --message "Convert systemEvent to agentTurn message"

# Change delivery to none
openclaw cron edit <jobId> --delivery none

# Deliver to different channel
openclaw cron edit <jobId> \
  --channel slack \
  --to "channel:notifications"
```

---

### Problem: High API Costs

**Symptoms**: Unexpected token usage/costs.

**Solutions**:

```bash
# 1. Use lighter models for simple tasks
openclaw cron edit <jobId> --model "haiku"

# 2. Reduce thinking level
openclaw cron edit <jobId> --thinking minimal

# 3. Use light context
openclaw cron edit <jobId> --light-context

# 4. Reduce frequency
openclaw cron edit <jobId> --every 30m  # instead of 5m

# 5. Shorten prompts
openclaw cron edit <jobId> --message "Shorter, more focused prompt"
```

---

### Problem: Job Store Corruption

**Symptoms**: Gateway won't start, jobs missing.

**Solutions**:

```bash
# 1. Stop Gateway
openclaw gateway stop

# 2. Backup current jobs.json
cp ~/.openclaw/cron/jobs.json ~/.openclaw/cron/jobs.json.backup

# 3. Check JSON validity
cat ~/.openclaw/cron/jobs.json | jq .

# 4. Fix or restore from backup
cp ~/.openclaw/cron/jobs.json.backup ~/.openclaw/cron/jobs.json

# 5. Restart Gateway
openclaw gateway start

# 6. Verify jobs
openclaw cron list
```

---

## Real-World Code Examples

### Example 1: Multi-Channel Morning Brief

```bash
# Create comprehensive morning brief
openclaw cron add \
  --name "Morning Brief - Multi-Channel" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate morning brief: 1) Weather forecast 2) Calendar for today 3) Overnight news summary 4) Top 3 priorities. Format as markdown with sections." \
  --model "opus" \
  --thinking medium \
  --announce \
  --channel slack \
  --to "channel:morning-brief"
```

---

### Example 2: Intelligent Alert System

```bash
# Smart alerting with escalation
openclaw cron add \
  --name "Intelligent Alert System" \
  --every 5m \
  --session isolated \
  --message "Monitor system metrics: 1) Check error rates 2) Check response times 3) Check resource usage. If ANY threshold exceeded: create detailed alert with context, affected services, and recommended actions. Escalate to on-call if critical." \
  --model "opus" \
  --thinking high \
  --timeout-seconds 120 \
  --announce \
  --channel discord \
  --to "channel:alerts"
```

---

### Example 3: Automated Content Pipeline

```bash
# Daily content generation
openclaw cron add \
  --name "Daily Content Generator" \
  --cron "0 10 * * *" \
  --tz "UTC" \
  --session isolated \
  --message "Create today's content: 1) Generate social media post (under 280 chars) 2) Create LinkedIn article outline 3) Suggest 3 blog topics 4) Generate hashtags. Save all to content calendar." \
  --model "sonnet" \
  --thinking medium \
  --announce \
  --channel slack \
  --to "channel:content"
```

---

### Example 4: Weekly Analytics Report

```bash
# Comprehensive weekly report
openclaw cron add \
  --name "Weekly Analytics Report" \
  --cron "0 9 * * 1" \
  --tz "Europe/Berlin" \
  --session isolated \
  --message "Generate weekly analytics report: 1) Key metrics table (this week vs last week) 2) Growth rates 3) Top performers 4) Areas needing attention 5) Recommendations. Use markdown tables and charts. Keep under 800 words." \
  --model "opus" \
  --thinking high \
  --timeout-seconds 300 \
  --announce \
  --channel slack \
  --to "channel:executives"
```

---

### Example 5: Competitor Monitoring

```bash
# Hourly competitor tracking
openclaw cron add \
  --name "Competitor Price Monitor" \
  --every 1h \
  --session isolated \
  --light-context \
  --message "Check competitor prices for top 20 products. Compare to our prices. Flag any competitor price changes >10%. Update pricing database. Alert if we're no longer competitive on key items." \
  --model "haiku" \
  --thinking minimal \
  --delivery none
```

---

### Example 6: Customer Feedback Analysis

```bash
# Daily feedback synthesis
openclaw cron add \
  --name "Customer Feedback Analysis" \
  --cron "0 16 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Analyze today's customer feedback: 1) Categorize by topic 2) Sentiment analysis 3) Identify recurring issues 4) Extract actionable insights 5) Prioritize top 3 improvements. Format as executive summary." \
  --model "opus" \
  --thinking high \
  --announce \
  --channel slack \
  --to "channel:product-team"
```

---

### Example 7: Automated Backup Verification

```bash
# Daily backup check
openclaw cron add \
  --name "Backup Verification" \
  --cron "0 3 * * *" \
  --tz "UTC" \
  --session isolated \
  --light-context \
  --message "Verify backups: 1) Check all backup files exist 2) Validate file sizes match expected 3) Test restore on random sample 4) Check backup age (should be <24h) 5) Report any failures immediately with details." \
  --model "haiku" \
  --thinking low \
  --timeout-seconds 180 \
  --announce \
  --channel slack \
  --to "channel:ops"
```

---

### Example 8: Social Media Scheduling

```bash
# Multiple daily posts
openclaw cron add \
  --name "Morning Social Post" \
  --cron "0 9 * * *" \
  --session isolated \
  --message "Create engaging morning social post about [today's theme from rotation]. Include 3-5 relevant hashtags. Keep under 280 characters. Generate image description for alt text." \
  --announce \
  --channel twitter

openclaw cron add \
  --name "Afternoon Social Post" \
  --cron "0 14 * * *" \
  --session isolated \
  --message "Create afternoon social post: educational content or tip. Include relevant hashtags. Under 280 characters." \
  --announce \
  --channel twitter

openclaw cron add \
  --name "Evening Social Post" \
  --cron "0 18 * * *" \
  --session isolated \
  --message "Create evening social post: engagement question or poll. Encourage interaction. Under 280 characters." \
  --announce \
  --channel twitter
```

---

## Quick Reference Cheat Sheet

### CLI Commands

```bash
# Add a new cronjob
openclaw cron add --name "Job Name" [options]

# List all jobs
openclaw cron list

# View job status
openclaw cron status

# Run job immediately
openclaw cron run <jobId>
openclaw cron run <jobId> --due  # only if due

# Edit existing job
openclaw cron edit <jobId> --field "value"

# Disable/Enable job
openclaw cron disable <jobId>
openclaw cron enable <jobId>

# Remove job
openclaw cron rm <jobId>

# View run history
openclaw cron runs --id <jobId> --limit 20
openclaw cron runs  # all jobs
```

---

### Schedule Formats

```bash
# One-shot at specific time
--at "2026-03-15T14:00:00Z"
--at "30m"           # in 30 minutes
--at "2h"            # in 2 hours

# Recurring interval
--every 5m           # every 5 minutes
--every 1h           # every hour
--every 24h          # every day

# Cron expression (5-field)
--cron "* * * * *"           # every minute
--cron "0 * * * *"           # every hour
--cron "0 7 * * *"           # daily at 7 AM
--cron "0 9 * * 1-5"         # weekdays at 9 AM
--cron "0 0 * * 0"           # weekly on Sunday
--cron "*/15 * * * *"        # every 15 minutes

# With timezone
--cron "0 7 * * *" --tz "America/New_York"
```

---

### Common Cron Expressions

| Expression | Meaning | Example Use |
|------------|---------|-------------|
| `* * * * *` | Every minute | High-freq monitoring |
| `*/5 * * * *` | Every 5 minutes | Health checks |
| `*/15 * * * *` | Every 15 minutes | Data collection |
| `0 * * * *` | Every hour | Hourly reports |
| `0 */2 * * *` | Every 2 hours | Regular updates |
| `0 7 * * *` | Daily at 7 AM | Morning brief |
| `0 9 * * 1-5` | Weekdays 9 AM | Business hours |
| `0 0 * * 0` | Weekly Sunday | Weekly cleanup |
| `0 0 1 * *` | Monthly 1st | Monthly report |

---

### Session & Payload Types

```bash
# Main session (systemEvent)
--session main \
--system-event "Your instruction"

# Isolated session (agentTurn)
--session isolated \
--message "Your instruction"
```

---

### Delivery Options

```bash
# Announce to channel
--announce \
--channel slack \
--to "channel:C1234567890"

# Webhook delivery
--delivery webhook \
--to "https://your-server.com/webhook"

# No delivery (internal)
--delivery none
```

---

### Model & Thinking Overrides

```bash
# Model selection
--model "haiku"              # Fast, cheap
--model "sonnet"             # Balanced
--model "opus"               # Most capable
--model "anthropic/..."      # Specific model

# Thinking level
--thinking off               # No reasoning
--thinking minimal           # Basic
--thinking low               # Simple
--thinking medium            # Default
--thinking high              # Deep
--thinking xhigh             # Maximum
```

---

### Advanced Options

```bash
# Timezone
--tz "America/New_York"

# Timeout
--timeout-seconds 120

# Light context (faster)
--light-context

# Stagger (avoid load spikes)
--stagger 30s
--stagger 5m

# Exact timing (no stagger)
--exact

# Agent selection
--agent ops

# Delete after run (one-shot)
--delete-after-run

# Keep after run (one-shot)
--keep-after-run

# Description
--description "What this job does"
```

---

### Complete Examples

**Simple Reminder**:
```bash
openclaw cron add \
  --name "Meeting Reminder" \
  --at "30m" \
  --session main \
  --system-event "REMINDER: Team meeting in 30 minutes" \
  --wake now \
  --delete-after-run
```

**Daily Report**:
```bash
openclaw cron add \
  --name "Daily Report" \
  --cron "0 7 * * *" \
  --tz "America/New_York" \
  --session isolated \
  --message "Generate daily report" \
  --announce \
  --channel slack \
  --to "channel:reports"
```

**Monitoring**:
```bash
openclaw cron add \
  --name "Health Check" \
  --every 5m \
  --session isolated \
  --message "Check system health" \
  --announce \
  --channel discord \
  --to "channel:alerts" \
  --model "haiku" \
  --thinking minimal
```

**Complex Task**:
```bash
openclaw cron add \
  --name "Weekly Analysis" \
  --cron "0 9 * * 1" \
  --tz "Europe/Berlin" \
  --session isolated \
  --message "Deep weekly analysis" \
  --model "opus" \
  --thinking high \
  --timeout-seconds 300 \
  --announce \
  --channel slack \
  --to "channel:executives"
```

---

### Troubleshooting Quick Reference

```bash
# Check if cron is enabled
openclaw cron status

# List all jobs
openclaw cron list

# View run history
openclaw cron runs --id <jobId> --limit 10

# Test job immediately
openclaw cron run <jobId>

# Edit job
openclaw cron edit <jobId> --field "value"

# Disable problematic job
openclaw cron disable <jobId>

# Check Gateway logs
tail -f /tmp/openclaw/openclaw-*.log

# View job store
cat ~/.openclaw/cron/jobs.json | jq .
```

---

### File Locations

```
~/.openclaw/cron/jobs.json           # Job definitions
~/.openclaw/cron/runs/<jobId>.jsonl  # Run history
/tmp/openclaw/openclaw-*.log         # Gateway logs
```

---

### Best Practices Checklist

- [ ] Use descriptive job names
- [ ] Always specify timezone for cron expressions
- [ ] Use isolated sessions for noisy jobs
- [ ] Set appropriate timeouts
- [ ] Test jobs manually before deploying
- [ ] Monitor run history regularly
- [ ] Use light context for simple tasks
- [ ] Document jobs with descriptions
- [ ] Clean up obsolete jobs
- [ ] Configure appropriate delivery modes

---

## Conclusion

OpenClaw's cronjob system is a **powerful automation tool** that transforms your AI from reactive to proactive. Whether you need simple reminders, complex monitoring, or scheduled content generation, cronjobs handle it reliably.

**Key Takeaways**:
1. ✅ **Three schedule types** cover all use cases (`at`, `every`, `cron`)
2. ✅ **Two execution modes** for different needs (main vs isolated)
3. ✅ **Flexible delivery** options (announce, webhook, none)
4. ✅ **Advanced features** like model overrides and light context
5. ✅ **Built-in reliability** with retry logic and error handling

**Next Steps**:
1. Start with one simple job (e.g., daily reminder)
2. Test and verify it works
3. Gradually add more complex automations
4. Monitor and optimize based on run history
5. Share your best cronjob recipes with the community

**Remember**: The best automation is the one that runs reliably without you thinking about it. Start small, test thoroughly, and scale what works.

---

## Resources

**Official Documentation**:
- [OpenClaw Cron Jobs Docs](https://docs.openclaw.ai/automation/cron-jobs)
- [Cron vs Heartbeat](https://docs.openclaw.ai/automation/cron-vs-heartbeat)
- [CLI Reference](https://docs.openclaw.ai/cli/cron)
- [Troubleshooting Guide](https://docs.openclaw.ai/automation/troubleshooting)

**Tools**:
- [Cron Expression Tester](https://crontab.guru/) - Validate cron expressions
- [Timezone Converter](https://time.is/) - Verify timezones
- [OpenClaw CLI](https://openclaw.ai/) - Manage cronjobs

**Community**:
- OpenClaw Discord Server
- GitHub Discussions
- ClawHub Skills Repository

---

*Last Updated: March 10, 2026*  
*Author: AI Insights Team*  
*Questions? Reach out through the website or OpenClaw community channels.*
