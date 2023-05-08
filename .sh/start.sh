#!/bin/bash

echo $1

echo $(pwd)

npm run compile --file $1 $(pwd)

# /Users/bytedance/.nvm/versions/node/v14.20.0/bin/npm i && npm run compile

# sleep 5
# nodeport=$(netstat -lntp | grep "7000" | awk '{print $4}' | awk -F":" '{print $4}')
# echo $nodeport

# if [ "$nodeport" ]; then
#   echo -e "\033[32m[ node process start success on dev env !  ]\033[0m"
# fi
