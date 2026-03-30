#!/usr/bin/env bash

echo "Options:
1. commit and push changes
2. commit changes only
3. push changes only"

read -p "Enter your choice: " choice
read -p "Enter commit message: " commit_message
read -p "Enter files to commit (leave blank for all fields):" files

if [ "$choice" -eq 1 ]; then
    echo "committing and pushing changes..."
    if [ -z "$files" ]; then
        git add .
    else
        git add "$files"
    fi
    git commit -m "$commit_message"
    git push

elif [ "$choice" -eq 2 ]; then
        echo "committing changes only..."
        if [ -z "$files" ]; then
            git add .
        else
            git add "$files"
        fi
        git commit -m "$commit_message"

elif [ $choice -eq 3 ]; then
    echo "pushing changes..."
    git push
else
    echo "Invalid choice"
fi

echo "Done"