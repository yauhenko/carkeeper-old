#!/usr/bin/env bash
rsync -a --delete ./* carkeeper@tipaopa.ru:app/public/www/card2
