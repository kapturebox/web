#!/bin/bash

/bin/chown -R kapture.kapture /var/kapture /etc/kapture

/sbin/iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080

if [ -x /etc/init.d/netfilter-persistent ]; then
  /usr/sbin/invoke-rc.d netfilter-persistent save > /dev/null 2>&1
fi

if [ -x /etc/init.d/iptables-persistent ]; then
  /usr/sbin/invoke-rc.d iptables-persistent save  > /dev/null 2>&1
fi

/bin/systemctl enable kapture > /dev/null 2>&1
/usr/sbin/service kapture start
