#!/usr/bin/env bash
rsync -a --delete ./* carkeeper@tipaopa.ru:app/public/www/card3 && curl -X DELETE "https://api.cloudflare.com/client/v4/zones/ff4aa21d29fd89f2b399ca25e41b8a68/purge_cache" -H "X-Auth-Email: kirienkov@gmail.com" -H "X-Auth-Key: 801fcac886268a88a4e9425f4504293715de7" -H "Content-Type: application/json" --data '{"purge_everything":true}'
