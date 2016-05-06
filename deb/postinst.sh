#!/bin/bash

/usr/sbin/service kapture start
/bin/chown -R kapture.kapture /var/kapture /etc/kapture

/sbin/iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080

/usr/sbin/invoke-rc.d netfilter-persistent save  > /dev/null 2>&1
