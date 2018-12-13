#!/usr/bin/env bash
#################################
user=carkeeper
host=tipaopa.ru
port=22
path=app
#################################
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
${bin}/build.sh
cd "${bin}/../"
src=`pwd`
cd ${src}/build/ && \
echo 'Uploading...' && \
rsync -a --delete ${src}/build/* --exclude="uploads" --exclude="www" --exclude="/log" --exclude="backup" -e "ssh -p ${port}" ${user}@${host}:${path} && \
ssh ${user}@${host} "${path}/bin/console --ansi migrations:migrate && ${path}/bin/console --ansi cache:warmup" && \
echo "Done in ${SECONDS} sec."
