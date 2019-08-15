#!/bin/bash
echo "Deploying to GitHub Pages."
echo ""

# Remove previous build files
cd dist
find . ! -name '.gitkeep' -type f -exec rm -f {} +
cd ..

# Build assets
./node_modules/gulp/bin/gulp.js build

# Initialize git repo and commit
cd dist
git init
git add .
git commit -m "Deployed to Github Pages"

# Push to the gh-pages branch
git push -f git@github.com:gpuenteallott/jamonipsum.git master:gh-pages

# Go back to project root.
cd ..

echo ""
echo "Finished deploying."

# Giving credit to this project which helped us figure out how to do it:
# https://github.com/x-team/unleash-styles/blob/master/deploy-ghpages.sh
