# -*- mode: ruby -*-
# vi: set ft=ruby :

disk = '/tmp/tempdisk.vdi'

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  # config.vm.box_check_update = false
  config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)"

  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"

    unless File.exist?(disk)
      vb.customize ['createhd', '--filename', disk, '--size', 1 * 1024]
    end
    vb.customize ['storageattach', :id, '--storagectl', 'SATAController', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', disk]
  end


  config.vm.provision "shell", inline: <<-SHELL
    apt-get update

    # install some tools for development on vagrant box, and ansible
    apt-get install -y python-pip devscripts debhelper nodejs npm ruby ruby-compass git
    pip install ansible
    npm install -g grunt-cli

    # setup code deps
    ( cd /vagrant && npm install && bower install )

    # get rest of machine setup for kapture
    export ANSIBLE_CONFIG=/vagrant/ansible/ansible.cfg
    ansible-playbook -c local -i 'localhost,' /vagrant/ansible/initial-setup.yml
  SHELL
end
