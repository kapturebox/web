#!/bin/bash

ENV=${1:-development}
VARS=${2:-system_settings.yml}
# ANSIBLE_OPTS="$ANSIBLE_OPTS --check"

test -f $VARS && ANSIBLE_OPTS="-e @$VARS"

LOCKFILE=/tmp/ansiblerunlock

case "$ENV" in
  "production")
    # when on local machine
    ANSIBLE_CONFIG="/var/kapture/ansible/ansible.cfg"
    PLAYBOOOK_TO_RUN="/var/kapture/ansible/local.yml"

    fail_if_file_not_present $PLAYBOOOK_TO_RUN
    flock $LOCKFILE ansible-playbook $ANSIBLE_OPTS -c local -i 'localhost,'  $PLAYBOOOK_TO_RUN
  ;;

  "development")
    # when testing with vagrant
    ANSIBLE_CONFIG="ansible/ansible.cfg"
    PLAYBOOOK_TO_RUN="ansible/local.yml"

    fail_if_file_not_present $PLAYBOOOK_TO_RUN
    flock $LOCKFILE ansible-playbook $ANSIBLE_OPTS -i ansible/inventory/vagrant $PLAYBOOOK_TO_RUN
  ;;
esac


fail_if_file_not_present() {
  test -f $1 || echo "error: can't find file $1" && exit 1
}
