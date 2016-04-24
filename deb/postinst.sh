#!/bin/bash



/usr/sbin/service kapture start
/sbin/iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080
