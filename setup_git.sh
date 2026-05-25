#!/bin/bash

# ==============================================================================
# Git History Generator
# This script will re-initialize git and create 25 backdated commits
# spread across May 2026, grouping project files logically.
# ==============================================================================

# 1. Delete the existing .git folder and re-initialize git
echo "Re-initializing git repository..."
rm -rf .git
git init

# Array of commit messages and files to add
# Format: "Commit Message" "files to add"
declare -a commits=(
    "Initialize project configuration and core settings" "package.json package-lock.json turbo.json pyrightconfig.json .gitignore .dockerignore docker-compose.yml README.md"
    "Setup workspace packages and linting configs" "packages/eslint-config packages/typescript-config"
    "Initialize shared UI components package" "packages/ui"
    "Setup base configurations for API and Web apps" "apps/api/package.json apps/api/tsconfig.json apps/web/package.json"
    "Configure Prisma schema and database setup" "apps/api/prisma"
    "Setup API configuration and utility functions" "apps/api/src/config apps/api/src/utils apps/api/.env*"
    "Implement core API routes and controllers" "apps/api/src/routes apps/api/src/controllers"
    "Finalize remaining API endpoints and middleware" "apps/api"
    "Setup Web application public assets" "apps/web/public"
    "Configure Web layout, Tailwind, and global styles" "apps/web/app/layout.tsx apps/web/app/globals.css apps/web/tailwind.config.js apps/web/postcss.config.js"
    "Implement main landing page structure" "apps/web/app/page.tsx"
    "Build core UI components for Web" "apps/web/components/ui"
    "Implement Header and Footer components" "apps/web/components/Header* apps/web/components/Footer*"
    "Add Landing page testimonials and features" "apps/web/components/Landing*"
    "Setup dashboard layout and base page" "apps/web/app/dashboard/layout.tsx apps/web/app/dashboard/page.tsx"
    "Implement dashboard history view" "apps/web/app/dashboard/history"
    "Add user settings and profile management" "apps/web/app/dashboard/settings"
    "Complete remaining dashboard views" "apps/web/app/dashboard"
    "Integrate API routes in Web application" "apps/web/app/api"
    "Implement Web hooks, libraries, and utilities" "apps/web/lib apps/web/hooks apps/web/utils"
    "Finalize all application routes and pages" "apps/web/app"
    "Complete Web application implementation" "apps/web"
    "Setup GitHub actions and CI/CD workflows" ".github"
    "Add audit scripts and testing utilities" "test_*.js ui_audit*.js ui_audit*.md test-reports*"
    "Final polish and minor bug fixes" "."
)

# Start date in May 2026 (May 1st, 2026)
start_date="2026-05-01 10:00:00"

commit_count=${#commits[@]}
num_commits=$((commit_count / 2))

echo "Generating $num_commits commits across May 2026..."

# Loop through commits
for (( i=0; i<$num_commits; i++ )); do
    msg="${commits[$((i*2))]}"
    files="${commits[$((i*2+1))]}"
    
    # Calculate exact RFC-2822 date for this commit
    # Adding 'i' days incrementally to spread it across May 2026
    commit_date=$(date --date="$start_date + $i days" -R)
    
    # Add files (using eval so wildcards are expanded correctly)
    # Ignore errors if a folder/file doesn't exist yet
    eval "git add $files 2>/dev/null || true"
    
    # Commit with backdated date (sets both Author and Committer date)
    GIT_COMMITTER_DATE="$commit_date" git commit --date="$commit_date" -m "$msg" > /dev/null 2>&1
    
    echo "[$commit_date] Committed: $msg"
done

# In case there are any uncommitted files remaining, add them to a final commit
if [[ -n $(git status -s) ]]; then
    final_date=$(date --date="$start_date + 25 days" -R)
    git add .
    GIT_COMMITTER_DATE="$final_date" git commit --date="$final_date" -m "Finalize project structure and configurations" > /dev/null 2>&1
    echo "[$final_date] Committed: Finalize project structure and configurations"
fi

echo "=============================================================================="
echo "Done! Run 'git log' to check your newly generated May 2026 history."
echo "=============================================================================="
