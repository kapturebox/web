#!/bin/bash

ENV=${1:-development}
VARS=${2:-system_settings.yml}
# ANSIBLE_OPTS="$ANSIBLE_OPTS --check"

test -f $VARS && ANSIBLE_OPTS="-e @$VARS"

case "$ENV" in
  "production")
    # when on local machine
    ANSIBLE_CONFIG="/var/kapture/ansible/ansible.cfg"
    ansible-playbook $ANSIBLE_OPTS /var/kapture/ansible/local.yml
  ;;

  "development")
    # when testing with vagrant
    ANSIBLE_CONFIG="ansible/ansible.cfg"
    ansible-playbook $ANSIBLE_OPTS -i ansible/inventory/vagrant ansible/local.yml
  ;;
esac
