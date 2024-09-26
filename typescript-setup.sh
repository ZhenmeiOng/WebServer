#!/bin/bash

# Create a new project directory
mkdir $1
cd $1

# Initialize npm
npm init -y

# Install TypeScript and Node.js type definitions
npm install typescript @types/node --save-dev

# Initialize TypeScript configuration
npx tsc --init

# Create src directory
mkdir src

echo "Project $1 is set up with TypeScript and Node.js type definitions."