#!/usr/bin/env bash
rm -rf ./build && \
tsc && \
cp package.json ./build/ && \
cp -r ./views ./build && \
rsync -a ./public ./build/ --exclude=uploads && \
cd build && \
npm i --production && \
rm package.json package-lock.json && \
mkdir -p public/uploads && \
touch public/uploads/.holder && \
echo "Build done in ${SECONDS} sec."
