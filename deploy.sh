#!/bin/bash

# exit when any command fails
set -e

echo "Deploying to GitHub Pages."
echo ""

# Remove previous build files
if [ -d "dist" ]
then
    cd dist
    find . ! -name '.gitkeep' -type f -exec rm -f {} +
    cd ..
fi

# Build assets
npm test
npm run build

# Initialize git repo and commit
cd dist
git init
git add .
git commit -m "Deployed to Github Pages"

# Push to the gh-pages branch
REMOTE=$(node -p "require('../package.json').repository")
git push -f $REMOTE master:gh-pages

# Go back to project root.
cd ..

echo ""
echo "Finished deploying to $REMOTE#gh-pages"

# Giving credit to this project which helped us figure out how to do it:
# https://github.com/x-team/unleash-styles/blob/master/deploy-ghpages.sh
