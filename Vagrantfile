# -*- mode: ruby -*-
# vi: set ft=ruby :

disk = '/tmp/kapture-vagrant-storage.vdi'

Vagrant.configure(2) do |config|
  config.vm.box = "gbarbieru/xenial"
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
    vb.customize ['storageattach', :id, '--storagectl', 'SATA', '--port', 1, '--device', 0, '--type', 'hdd', '--medium', disk]
  end


  config.vm.provision "shell", inline: <<-SHELL
    # install some tools for development on vagrant box, and ansible
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y python-pip devscripts debhelper ruby ruby-compass git iptables-persistent python-dev libffi-dev libssl-dev
    pip install ansible==2.0.0.2 markupsafe

    # get rest of machine setup for kapture
    export ANSIBLE_CONFIG=/vagrant/ansible/ansible.cfg
    ansible-playbook -c local -i /vagrant/ansible/inventory/vagrant /vagrant/ansible/initial-setup.yml

    update-alternatives --install /usr/bin/node node /usr/bin/nodejs 50000

    # get code deps setup, and install kapture package locally
    npm install -g grunt-cli npm bower
    su vagrant -c 'cd /vagrant && npm install --no-bin-links || npm install --no-bin-links && bower install && grunt clean package'
    if [ -e /vagrant/tmp/*.deb ]; then dpkg -i /vagrant/tmp/*.deb ; fi
  SHELL
end
