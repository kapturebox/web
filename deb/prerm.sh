#!/bin/bash

if [ -f /etc/init/kapture.conf ] && /usr/sbin/service kapture status >/dev/null ; then
  /usr/sbin/service kapture stop
fi
