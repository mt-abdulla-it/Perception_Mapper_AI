#!/bin/bash
# Development environment bootstrap script
echo "Setting up dev dependencies..."
npm install
pip install -r apps/nlp/requirements.txt 2>/dev/null || true
