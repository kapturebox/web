#!/bin/bash

if [ -f /etc/init/kapture.conf ] && status -q kapture | grep -q 'kapture start/running' ; then
  stop kapture
fi
