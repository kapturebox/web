#!/bin/bash



initctl reload-configuration && start kapture
iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 8080
