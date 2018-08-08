#!/usr/bin/env bash
rm -rf ./build && \
babel . --out-dir build --ignore node_modules && \
cp package.json ./build/ && \
cd build && \
npm i --production && \
rm package.json package-lock.json && \
mkdir -p public/uploads && \
touch public/uploads/.holder && \
echo "Build done in ${SECONDS} sec."
