#!/bin/bash

ENV=${1:-development}
VARS=${2:-system_settings.yml}
LOCKFILE=/tmp/ansiblerunlock
# ANSIBLE_OPTS="$ANSIBLE_OPTS --check"

test -f $VARS && ANSIBLE_OPTS="-e @$VARS"

fail_if_file_not_present() {
  if [ ! -f $1 ]; then
    echo "error: can't find file $1" && exit 1
  fi
}


case "$ENV" in
  "production")
    # when on local machine
    ANSIBLE_CONFIG="/var/kapture/ansible/ansible.cfg"
    PLAYBOOOK_TO_RUN="/var/kapture/ansible/kapture.yml"

    fail_if_file_not_present $PLAYBOOOK_TO_RUN
    flock $LOCKFILE ansible-playbook $ANSIBLE_OPTS -c local -i 'localhost,'  $PLAYBOOOK_TO_RUN
  ;;

  "development")
    # when testing with vagrant
    ANSIBLE_CONFIG="ansible/ansible.cfg"
    PLAYBOOOK_TO_RUN="ansible/kapture.yml"

    fail_if_file_not_present $PLAYBOOOK_TO_RUN
    flock $LOCKFILE ansible-playbook $ANSIBLE_OPTS -i ansible/inventory/vagrant $PLAYBOOOK_TO_RUN
  ;;
esac
