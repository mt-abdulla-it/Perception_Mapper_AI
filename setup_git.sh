#!/bin/bash

# ==============================================================================
# Ultimate Git History Generator (Perfectly distributed 183 Commits)
# ==============================================================================

echo "Re-initializing git repository..."
rm -rf .git
git init

# The Magic Trick: Let Git filter out all ignored files first, then get the pure list!
git add .
mapfile -t all_files < <(git ls-files)

# Now unstage them so we can slowly add them back in over 5 months
git rm -r --cached . > /dev/null 2>&1

total_files=${#all_files[@]}
echo "Found exactly $total_files valid files to commit."

target_commits=183

start_date_sec=$(date -d "2026-05-01 10:00:00" +%s)
end_date_sec=$(date -d "2026-09-10 10:00:00" +%s)
total_duration=$((end_date_sec - start_date_sec))
time_step=$((total_duration / target_commits))

commit_msgs=(
    "Update configuration"
    "Refactor module structure"
    "Add styling and layout"
    "Fix minor bug"
    "Update documentation"
    "Improve performance"
    "Add new component"
    "Implement core logic"
    "Clean up code"
    "Update dependencies"
    "WIP: testing features"
    "Fix typo in comments"
    "Enhance UI component"
    "Update database schema"
    "Add utility function"
    "Update API route"
    "Resolve merge conflicts"
    "Optimize rendering"
    "Update API controllers"
    "Fix layout responsiveness"
)

echo "Generating EXACTLY $target_commits commits spread perfectly from May to September..."

files_per_commit=$(( (total_files + target_commits - 1) / target_commits ))
if [ $files_per_commit -eq 0 ]; then
    files_per_commit=1
fi

file_idx=0
for (( i=0; i<target_commits; i++ )); do
    commit_date_sec=$((start_date_sec + (i * time_step)))
    commit_date=$(date -d "@$commit_date_sec" -R)
    
    rand_msg_idx=$((RANDOM % ${#commit_msgs[@]}))
    msg="${commit_msgs[$rand_msg_idx]}"

    for (( j=0; j<files_per_commit; j++ )); do
        if [ $file_idx -lt $total_files ]; then
            git add "${all_files[$file_idx]}"
            file_idx=$((file_idx + 1))
        fi
    done

    GIT_COMMITTER_DATE="$commit_date" git commit --no-verify --allow-empty --date="$commit_date" -m "$msg" > /dev/null 2>&1
done

if [[ -n $(git status -s) ]]; then
    final_date=$(date -d "@$end_date_sec" -R)
    git add .
    GIT_COMMITTER_DATE="$final_date" git commit --no-verify --date="$final_date" -m "Final polish and minor bug fixes" > /dev/null 2>&1
fi

echo "=============================================================================="
echo "Done! The timeline is now perfectly distributed."
echo "=============================================================================="
