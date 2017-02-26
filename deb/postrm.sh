#!/bin/bash

# delete rule if exists
if /sbin/iptables; then
  if /sbin/iptables -S PREROUTING -t nat | grep -q -- '-A PREROUTING -p tcp -m tcp --dport 80 -j REDIRECT --to-ports 8080'; then
    /sbin/iptables -D PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 8080
  fi
fi

