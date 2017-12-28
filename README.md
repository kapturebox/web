# kapture web and api

> Kapture is a tool to create a "personalized netflix server":  A cloud or pi-based device that provides simplified retrieval, storage, and redistribution of any media.


# Quickstart

[![Build Status](https://travis-ci.org/kapturebox/web.svg?branch=master)](https://travis-ci.org/kapturebox/web)

## Vagrant 

Start up whats intended to be a kapture box, including transmission, plex and the kapture app:

```
vagrant up
```

Will start up a new xenial instance locally, set up the machine, and then clean and build the npm project located in /vagrant

You can connect to the **packaged** instance that is in the apt repo on http://kapture-vagrant.local/

## Docker-compose

This repo is also built into a docker image: `kapturebox/web`.  The docker-compose file will spin up all dependent services:

```bash
docker-compose up -d
```

This will spin up the kapture service running on port `:9000` wherever your docker environment lives (usually [http://localhost:9000](http://localhost:9000))




# Development

## Running locally without components

This can be run on your local box for easier developing, however it won't have transmission to download files and flexget to auto-kapture stuff.  Everything else (searching, UI, settings, etc) should work fine:

```bash
npm install -g grunt-cli bower yarn
yarn
bower install
grunt serve
```

You'll then have a server running at: http://localhost:9000

## All components in vagrant

```
vagrant ssh
cd /vagrant ; grunt serve
```

Then you will have a server running @ http://kapture-vagrant.local:9000

## Useful environment variables

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
docker-compose up
```

Will give you a new docker image meant for an ARM system (needs to be built on an ARM system as well), for use by other tools and services.  It will also give you the dependencies needed to download or auto-kapture (transmission and flexget)

### Building deb package

```bash
# create package
grunt clean package

# install on system
sudo dpkg -i tmp/*.deb
```







# Misc

## Pulling updates material iconsets

```
git clone https://github.com/nkoterba/material-design-iconsets.git /tmp
cd /tmp/material-design-iconsets/
npm install && npm run init
npm build
cp -r iconsets/* ICONSET_DIR
```

# References

- [TransmissionRPC API spec](https://trac.transmissionbt.com/browser/trunk/extras/rpc-spec.txt)
