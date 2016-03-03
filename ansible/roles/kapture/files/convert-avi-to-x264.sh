#!/bin/bash
# 
# This file will look for media files with a container that plex can't support
# on a bananapi, and convert them to ones that will stream properly.
# 
# Will take a while on a bananapi given it's cpu power, but you can always run
# it on a box that has more power, as long as you have libav installed


if [ $# -ne 1 ]; then
  echo "usage: $0 <directory or files to find and convert to x264>"
  echo "WARN: will remove original version"
  echo "requires avutils"
  exit 1
fi

IFS=$'\n'

count=$(find "$1" -name '*.avi' | wc -l)
i=1
while read f; do
  if avprobe -show_streams "$f" 2>&1 | grep -q 'codec_name=mpeg4' >/dev/null; then
    echo "[$i of $count] converting $f .."
    avconv -y -v quiet -i "$f" -c:v libx264 -c:a copy "${f}.mkv" >/dev/null
    rm "$f"
    i=$(( i+1 ))
  fi
done < <(find "$1" -name '*.avi')

