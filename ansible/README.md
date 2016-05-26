Kapture pi system setup
=======================

Configured to use:

* Plex - plays content
* Transmission - downloads torrents
* flexget - used to read from showrss and pull in new episodes
* Apple file share: Pointing to storage device
* Samba: Pointing to storage device


Initial pi setup
----------------

First use the following image flashed onto a sd card in order to get a base OS:

https://ubuntu-pi-flavour-maker.org/xenial/ubuntu-standard-16.04-server-armhf-raspberry-pi.img.xz.torrent

Put the sd card into the pi, power it up, and run the following in this directory in order to transform a pi into a kapture:


```bash
ansible-playbook -i inventory/xenial initial-setup.yml --ask-sudo-pass
```

**On first run** It will prompt you for a sudo pass, which is ```ubuntu```.  Let that complete and you should have a new kapture device located at:

http://kapture.local/

It will also set a SSH password for the ```ubuntu``` user of: ```kapture is the bombest thing ever```.  Last it sets up some authorized_keys for that user as defined by the group_vars file.


Hardware requirements
---------------------

* [Bananapi (or other pi's) w/ lubuntu 10.04.3](https://drive.google.com/open?id=0BzoTh3Vdt47ffkNUM0J0ZnVXbXljTTBqazZPX3dSaWZ3MGRfTTBUU3F0OWtnd3NBdFhRRlU)
* SSH key-based login configured properly with sudo access from machine running ansible
* Storage device setup correctly (and configured in system-setup.yml)


Troubleshooting
---------------

If plex won't play certain videos because the bananapi isn't powerful enough, you'll need to use the included script ```convert-avi-to-x264.sh``` on the file that won't play properly.
