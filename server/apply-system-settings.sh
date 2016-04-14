#!/bin/bash

MODE=vagrant


# always have these arguments
ANSIBLE_OPTS="-e $VARS"
ANSIBLE_OPTS="$ANSIBLE_OPTS --check"
VARS=/tmp/vars.yml


case "$MODE" in
  "local")
    # when on local machine
    ANSIBLE_OPTS="$ANSIBLE_OPTS -i 'localhost,' -c local"
    ansible-playbook $ANSIBLE_OPTS $(dirname $0)/ansible/local.yml
  ;;

  "vagrant")
    # when testing with vagrant
    ANSIBLE_OPTS="$ANSIBLE_OPTS -i ansible/vagrant-inventory"
    ansible-playbook $ANSIBLE_OPTS $(dirname $0)/ansible/initial-setup.yml
  ;;
esac
