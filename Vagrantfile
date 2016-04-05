# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  # config.vm.box_check_update = false
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)"

  config.vm.synced_folder ".", "/vagrant"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update -y
    sudo apt-get install python-pip -y
    sudo pip install ansible

    export ANSIBLE_CONFIG=/vagrant/ansible/ansible.cfg
    sudo ansible-playbook -c local -i 'localhost,' /vagrant/ansible/local.yml
  SHELL
end
