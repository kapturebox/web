Bananapi auto-downloader
-----------------------------------------------------------------

Configured to use:
* Plex
* Transmission
* flexget (showrss)
* Apple file share: Configured on storage device

Playbook will auto-download entries from the url specified in the system-setup.yml configuration

To run:

```bash
ansible-playbook system-setup.yml -i hosts -s
```


Requirements
------------

* [Bananapi (or other pi's) w/ lubuntu 10.04.3](https://drive.google.com/open?id=0BzoTh3Vdt47ffkNUM0J0ZnVXbXljTTBqazZPX3dSaWZ3MGRfTTBUU3F0OWtnd3NBdFhRRlU)
* SSH key-based login configured properly with sudo access from machine running ansible
* Storage device setup correctly (and configured in system-setup.yml)


Troubleshooting
---------------

If plex won't play certain videos because the bananapi isn't powerful enough, you'll need to use the included script ```convert-avi-to-x264.sh``` on the file that won't play properly.
