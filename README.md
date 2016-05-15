kapture
=======

> Goal is to make a device that provides simplified retrieval, storage, and redistribution of media

Quickstart
---

Start up whats intended to be a kapture box, including transmission, plex and the [kapture app](http://vagrant-kapture.local):

```
vagrant up
```

Devel
-----

Start server in develop mode:

```
vagrant ssh
cd /vagrant ; grunt serve
```

Pulling updates material iconsets:

```
git clone https://github.com/nkoterba/material-design-iconsets.git /tmp
cd /tmp/material-design-iconsets/
npm install && npm run init
npm build
cp -r iconsets/* ICONSET_DIR
```

Docs
----

- [TransmissionRPC API spec](https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt)
