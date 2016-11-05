# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "boxcutter/ubuntu1604"
  config.vm.hostname = "kapture-vagrant"
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)"

  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = "2"
  end


  config.vm.provision "shell", inline: <<-SHELL
    set -e

    # xenial has some more invasive apt cron jobs that start on boot ..
    while ! apt-get update >/dev/null 2>&1; do
      echo 'waiting for apt lock to clear, then performing apt-get update ..'
      sleep 5
    done;

    # sets up remote nodejs apt repo
    curl -sL https://deb.nodesource.com/setup_6.x |  bash -

    # install some tools for development on vagrant box, and ansible
    export DEBIAN_FRONTEND=noninteractive
    apt-get install -y python-pip devscripts debhelper ruby ruby-compass git iptables-persistent python-dev libffi-dev libssl-dev nodejs transmission-daemon netatalk
    pip install --upgrade setuptools pip
    pip install ansible markupsafe

    # disable avahai so that it doesnt conflict with netatalk
    service avahi-daemon disable && service avahi-daemon stop
        
    update-alternatives --install /usr/bin/node node /usr/bin/nodejs 50000

    usermod -aG vagrant debian-transmission

    # get code deps setup, and install kapture package locally
    npm install -g grunt-cli npm bower
    su vagrant -c 'cd /vagrant && npm install --no-bin-links || npm install --no-bin-links && bower install'
  SHELL
end
