#!/bin/sh

LANGDIR=../static/lang
READMEDIR=../readme.i18n

convert() {
    lang=${1}
    langname=${2}
    conf=$lang.json
    opencc -c $conf -i $READMEDIR/readme.zh-Hant-CN.md -o $READMEDIR/readme.$lang.md
    opencc -c $conf -i $LANGDIR/zh-Hant-CN.json -o $LANGDIR/$lang.json
}

convert zh-CN 中文（简体字）
convert zh-HK 中文（香港字）
convert zh-TW 中文（正體字）
