Kapture is a device that allows you to get media from all around the internet with ease, or even add your own.  You can then play it back wherever you want (phone, computer, TV).

This page describes how to use the device.

## Initial device setup

Plug your kapture box into your router via the ethernet cable.  Then attach the power cable to a power source and connect to this site:  http://kapture.local

Since you're at this page, you've already done that successfully! Well done!

Now you can download whatever you want using the search field on the left.  Simply enter whatever you want to kapture, and it will scour the internet to find what you want.  Then click whatever entries you want to download (that you're licensed to, of course) and it will be stored on your kapture box!

## Kapture all the media

Using the search panel at the top of the page, you can find any sort of media you want throughout the internet via the plugins that come with the device (more on that later).  You can also paste URL's that contain media that you want to kapture, and have it stored on your kapture box.

### AutoKapture

This feature is intended to automatically kapture new media as it comes out, such as a tv show, video, or other types of constantly updated media.

To set a new series to be AutoKaptured, use the search dialog above, and look for the AutoKapture 'action' that looks like this: <button class="btn btn-sm btn-success"><i class="fa fa-refresh"></i></button>

## Watch media via Plex

Once your download has completed (you can see this by clicking on the downloads menu link), you'll be able to look at it in the 'watch' menu link.  You can do this in a number of different ways all though the PLEX app:

### In your browser

Simply click the watch button and enjoy!  You'll be able to navigate the Plex interface and play / view / listen to anything that's been downloaded to your kapture.

### On your smartphone or tablet (and/or Chromecast)

You'll need to get an app to do this:

[ios-app-store-logo]: https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg "App store logo"
[google-play-logo]: https://play.google.com/intl/en_us/badges/images/badge_new.png "Google play link"

| App         | Price | Rating | Platform     | Remote Viewing? | Supports Chromecast? | Link |
| ----------- |:-----:|:------:|:------------:|:--------------:|:---------------------:| ---- |
| **Plex**    | $4.99 | Best   | iOS, Android | Yes            | Yes                   | [![Plex in iOS App Store][ios-app-store-logo]](https://play.google.com/store/apps/details?id=com.plexapp.android)  [![Plex in play store][google-play-logo]](https://play.google.com/store/apps/details?id=com.plexapp.android) |
| **AllCast** | Free  | Good   | iOS, Android | No             | Yes                   | [![Allcast in iOS App Store][ios-app-store-logo]](https://itunes.com/app/allcast-cast-photos-music) [](https://play.google.com/store/apps/details?id=com.koushikdutta.cast) [![Plex in play store][google-play-logo]](https://play.google.com/store/apps/details?id=com.koushikdutta.cast) |

**You can also cast to chromecast by using the web app:**

Ensure that you're using the Chrome browser and you have the Chromecast extension installed, then click the "chromecast" link in the top right of the watch tab to specify that you want to cast Plex to your chromecast.

### On your smart TV

You'll first need to make sure that your TV is set up to be on the same network as your kapture

If you smart TV supports DLNA networking and media (you'll see a logo on the box or TV saying this), you should be able to use your TV's menu to search the network and browse all media on kapture.


# Frequently asked questions (Beta users)


## Known issues

### Video gets choppy when playing media (specifically 1080p)

This is a problem with the raspberry pi's limited power.  It should be resolved once we get better hardware in place.

In the meantime, make sure when you download things, that you get it in 720p format, rather than 1080p.

Alternatively: you can use the "Optimize.." button on each piece of media (click the ... button on the media), and then select a format like "For TV", or "For Mobile".  After that you should have two copies of the file and be able to select between them.

### Plex unable to play this media

No workaround at the moment.

This is caused by a bug in Plex with certain media files.  It should be resolved in an update to Kapture / Plex shortly.


### Media in Plex not getting deleted when I delete from 'downloads'

Workaround is to simply delete from Plex as well as the 'downloads' page, by going to the media you deleted, and clicking the '...' on the left panel, then hitting 'delete'.

This will be fixed in a future version.

### Searching functionality limited

This is still a prototype, so chill.  This will be improved in the future
