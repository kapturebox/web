#!/bin/bash

VARS=/tmp/vars.yml
ANSIBLE_OPTS="-i 'localhost,' -e $VARS -c local"
ANSIBLE_OPTS="$ANSIBLE_OPTS --check"

ansible-playbook $ANSIBLE_OPTS $(dirname $0)/ansible/local.yml
