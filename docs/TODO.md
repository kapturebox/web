CODE: Things to do
==================



Bugs
----

- Fix issue where Transmission dies randomly
- Fix issue where plex is unable to stream because of [this issue](http://www.htpcguides.com/fix-plex-server-is-not-powerful-enough-on-raspberry-pi-2/)
  - May be able to be solved by:
```bash
find /usr/lib/plexmediaserver -name plex.js -exec sed -i -e "s/validateTranscoder:function(t,n){var/validateTranscoder:function(t,n){return false;var/g" {} \;
```
- Centralize client / backend / ansible config
- Fix issues with media being deleted on filesystem but delete not being reflected in plex
- Bug fix for the issue where plexmediaserver causes kernel exception when transcoding [more details here](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=146072&p=981380):
```
Alignment trap: not handling instruction f462ea6d at [<0092a108>]
Unhandled fault: alignment exception (0x001)
May 25 23:22:22 kapture kernel: [19616.455238] pgd = b678c000
[687d9d3a] *pgd=38788831, *pte=2154475f, *ppte=21544c7f
```

Features
--------

- Add like a trending media section
- Utilize [something like this](https://webtorrent.io/desktop) for an additional 'streaming button'
- Add the ability to pull subtitles on download, use http://opensubtites.org/
- Option to make sticky menu thing on the side
- Remove / delete / stop / start buttons for downloads
- Auto-remove periodically .. or during big new downloads
- Deb package:
  - [Get rid of dev deps in deb package](https://www.npmjs.com/package/grunt-package-modules)
   - Add in git revision to package identifier
- Add 'automatic downloads' feature to search results (ie search showrss maybe?)
- Add in ability to remotely download whatever you want (both automatically and one-off's)
- Favicon



PRODUCT: Things to do
=====================

- Determine ideal combinations of components
- Refine 3d-printed enclosure for components
