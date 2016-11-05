#!/bin/bash

/bin/chown -R kapture.kapture /var/kapture /etc/kapture /var/lib/kapture /var/lib/downloads

/sbin/iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080

if [ -x /etc/init.d/netfilter-persistent ]; then
  /usr/sbin/invoke-rc.d netfilter-persistent save > /dev/null 2>&1
fi

if [ -x /etc/init.d/iptables-persistent ]; then
  /usr/sbin/invoke-rc.d iptables-persistent save  > /dev/null 2>&1
fi

# WOULD BE BETTER TO DO THESE POSTINST SCRIPTS VIA NPM ....
# since this dep contains a binary that needs to be arch dependent, install it in the dir
if [[ $(nodejs -e 'console.log(require("/var/kapture/server/config/environment/production").ngrokEnabled)') == 'true' ]]; then
  /usr/bin/nodejs /var/kapture/server/node_modules/ngrok/postinstall.js
fi

/usr/bin/nodejs /var/kapture/server/node_modules/youtube-dl/scripts/download.js


/bin/systemctl enable kapture > /dev/null 2>&1
/usr/sbin/service kapture start
