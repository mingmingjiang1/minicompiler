#!/bin/bash

# 先检测是否安装了spim，检测文件是否存在

if [ ! -e "$1" ]
then 
  echo "文件不存在,请检查"
  exit 1
fi


installed=$(which spim)

if [ -z "$installed" ]
then 
  echo "请先安装spim"
else
  spim -file $1 | sed -e '/^Loaded/d'
fi
