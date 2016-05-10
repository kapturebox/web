#!/bin/bash

if [ -f /etc/init/kapture.conf ] && /usr/sbin/service kapture status | grep -q running; then
  /usr/sbin/service kapture stop
fi
