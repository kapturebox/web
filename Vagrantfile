# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.hostname = "kapture-vagrant"
  config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)"

  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = "2"
  end


  config.vm.provision "shell", inline: <<-SHELL
    set -e

    curl -sL https://kapture-apt.s3.amazonaws.com/kapture-apt-s3.gpg | apt-key add -
    echo "deb https://kapture-apt.s3.amazonaws.com unstable main" > /etc/apt/sources.list.d/kapture.list


    # sets up remote nodejs apt repo
    if ! which node > /dev/null; then
      curl -sL https://deb.nodesource.com/setup_8.x |  bash -
    fi

    if ! which docker > /dev/null ; then
      curl -sL get.docker.com | sudo bash
      sudo usermod -aG docker ubuntu
    fi


    # xenial has some more invasive apt cron jobs that start on boot ..
    while ! apt-get update >/dev/null 2>&1; do
      echo 'waiting for apt lock to clear, then performing apt-get update ..'
      sleep 5
    done;


    # install some tools for development on vagrant box, and ansible
    export DEBIAN_FRONTEND=noninteractive
    apt-get install -y python-pip devscripts debhelper ruby ruby-compass \
                       git iptables-persistent python-dev libffi-dev httpie \
                       libssl-dev nodejs transmission-daemon netatalk vim kapture-ansible

    pip install --upgrade setuptools pip
    pip install ansible markupsafe

    /usr/local/bin/kapture-setup -e systemname=kapture-vagrant

    # get code deps setup, and install kapture package locally
    npm install -g --upgrade grunt-cli npm bower
    su ubuntu -c 'cd /vagrant && npm install && bower install'
  SHELL


end
