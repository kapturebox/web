kapture
=======

> Goal is to make a device that provides simplified retrieval, storage, and redistribution of media

Quickstart
----------

Start up whats intended to be a kapture box, including transmission, plex and the kapture app:

```
vagrant up
```

Will start up a new xenial instance locally, set up the machine via ansible scripts in the ```ansible``` path, and then clean and build the npm project located in /vagrant

You can connect to the **packaged** instance that is in the apt repo on http://kapture-vagrant.local/

Devel
-----

### Start server in development mode

```
vagrant ssh
cd /vagrant ; grunt serve
```

### Useful environment variables

| Variable        | Default      | Options |
| --------------- | ------------ | ------- |
| ```LOG_LEVEL``` | info         | error, warn, info, debug |
| ```NODE_ENV```  | development  | production, development |

If installed via package, can be configured via the following systemd file:

    /etc/systemd/system/kapture.service

## Building

### Docker image

Running

```
grunt docker
```

Will give you a new docker image meant for an ARM system (needs to be built on an ARM system as well), for use by other tools and services

### Building deb package

```bash
# create package
grunt clean package

# install on system
sudo dpkg -i tmp/*.deb
```

Misc
----

### Pulling updates material iconsets

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
