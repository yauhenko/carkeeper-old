#!/usr/bin/env bash
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd "${bin}/../"
src=`pwd`
dst=${src}/build
echo "Building..."
cd bin && \
rm -rf ${dst} && \
git clone -l -s ../ ${dst} -b master > /dev/null 2>&1 && \
cd ${dst} && \
composer install --no-dev -o > /dev/null 2>&1 && \
cd bin && \
rm -rf ${dst}/.git ${dst}/data/* ${dst}/.gitignore ${dst}/bin/build.sh ${dst}/bin/deploy.sh ${dst}/composer.*
