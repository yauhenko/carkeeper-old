npm run build && c:/cygwin64/bin/chmod -R 0777 build && c:/cygwin64/bin/rsync -a --delete ./build/* -e "c:/cygwin64/bin/ssh" carkeeper@tipaopa.ru:app/public/www/land
