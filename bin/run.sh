#!/bin/bash

if [ ! -e "$1" ]
then 
  echo "文件不存在,请检查"
  exit 1
fi


installed=$(which spim)

file=$1

if [ -z "$installed" ]
then 
  echo "请先安装spim"
else
  if [ "${file##*.}"x != "s"x ] 
  then  
    echo "请检查文件名后缀";
    exit 1;
  fi
  spim -file ${file} | sed -e '/^Loaded/d'
fi
