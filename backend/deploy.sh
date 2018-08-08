#!/usr/bin/env bash
rsync -av --delete --exclude=uploads ./build/* car@apps.redstream.by:app/ && \
ssh car@apps.redstream.by "pm2 restart Server" && \
echo "Deploy done in ${SECONDS} sec."
