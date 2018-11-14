#!/usr/bin/env bash
#################################
user=car
host=apps.redstream.by
port=22
path=app-php
#################################
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
${bin}/build.sh
cd "${bin}/../"
src=`pwd`
cd ${src}/build/ && \
echo 'Uploading...' && \
rsync -a --delete ${src}/build/* --exclude="uploads" --exclude="/log" --exclude="backup" -e "ssh -p ${port}" ${user}@${host}:${path} && \
ssh ${user}@${host} "${path}/bin/console --ansi migrations:migrate && ${path}/bin/console --ansi cache:warm" && \
echo "Done in ${SECONDS} sec."
