# /gsave

## Purpose
Checkpoint the entire working directory in Git.

## Inputs
- `msg` (optional): Commit message.  
  • If blank, Claude will auto-summarise the staged diff.  

## Steps
1. If project is not yet a Git repository, run `git init && git branch -M main`.  
2. Stage all changes: `git add -A`.  
3. If `msg` provided → `git commit -m "{{msg}}"`  
   else →  
   &nbsp;&nbsp;a. Run `git diff --cached --compact-summary` to get a short diff.<br>
   &nbsp;&nbsp;b. Ask Claude: *"Summarise this diff in 12 words max."*<br>
   &nbsp;&nbsp;c. Commit with that summary.  
4. Echo **✅ Saved: <commit-sha>** so the user sees success.

## Output
Git commit with either the provided message or auto-generated summary, showing the commit SHA.

## Post‑run memory update?