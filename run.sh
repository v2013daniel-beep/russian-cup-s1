#!/bin/bash
cd "$(dirname "$0")"
export PATH="$PWD/node:$PATH"
echo "Starting RUSSIAN CUP SEASON 1..."
npm run build && npm start
