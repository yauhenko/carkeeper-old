#!/usr/bin/env bash
npm run build && rsync -a --delete ./build/* car@apps.redstream.by:www-cp/
