#!/usr/bin/env bash
npm run build && rsync -a --delete ./build/* carkeeper@tipaopa.ru:app/public/www/cp
