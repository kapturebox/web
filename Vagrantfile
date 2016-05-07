# -*- mode: ruby -*-
# vi: set ft=ruby :

disk = '/tmp/kapture-vagrant-storage.vdi'

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  # config.vm.box_check_update = false
  config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)"

  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = "2"

    unless File.exist?(disk)
      vb.customize ['createhd', '--filename', disk, '--size', 1 * 1024]
    end
    vb.customize ['storageattach', :id, '--storagectl', 'SATAController', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', disk]
  end


  config.vm.provision "shell", inline: <<-SHELL
    # get new version of nodejs
    # curl -sL https://deb.nodesource.com/setup_5.x | bash -

    # install some tools for development on vagrant box, and ansible
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y python-pip devscripts debhelper nodejs ruby ruby-compass git iptables-persistent
    pip install ansible markupsafe

    update-alternatives --install /usr/bin/node node /usr/bin/nodejs 50000

    # get rest of machine setup for kapture
    export ANSIBLE_CONFIG=/vagrant/ansible/ansible.cfg
    ansible-playbook -c local -i 'localhost,' /vagrant/ansible/initial-setup.yml -e systemname=vagrant-kapture

    # get code deps setup, and install kapture package locally
    npm install -g grunt-cli npm bower
    su vagrant -c 'cd /vagrant && npm install && bower install && grunt clean package'
    if [ -e /vagrant/tmp/*.deb ]; then dpkg -i /vagrant/tmp/*.deb ; fi
  SHELL
end
