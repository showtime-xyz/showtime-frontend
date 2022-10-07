# Version 0.7.0
* Potentially breaking API change in `ContentApi`. The method `getRecommendedContentItems` will now take a `String` as `type`. We are making this change to support new dynamic categories.
* Fixed bug in Track.equals method.
* Fixed java.lang.NoClassDefFoundError: Failed resolution of: Lcom/spotify/android/appremote/api/ConnectionParams$Builder
* Added the method getCrossfadeState in PlayerApi. This method will return the state of the audio Crossfade setting. (Supported in Spotify 8.5.31.398)
* Skip to index - Skip to track at specified index in album or playlist

# Version 0.6.3

**What's New**
* Fix: Add rule to avoid proguard warning of missing classes

# Version 0.6.2

**What's New**
* Fix: Remove unwanted dependency to Guava
* Fix: Add rule to avoid proguard warning of missing classes

# Version 0.6.1

**What's New**

* Fix for adding uri to play queue via `PlayerApi.queue` command.
* Added `SpotifyRemoteServiceException` to catch `SecurityException` or `IllegalStateException` connection crash when trying to invoke startService/startForegroundService, see [ERRORS.md](ERRORS.md).
* MotionStateApi has been removed.

# Version 0.6.0

**What's New**

* Podcast playback support
* Set playback speed during Podcast playback
* Seek to relative playback position
* Improve image quality
* Bug fixes & improvements

# Version 0.5.0
  
**What's New**  
  
* Play music on the alarm stream
* Audio focusing & volume controls of the alarm stream
* Added connect and disconnect helper methods in `SpotifyAppRemote`
* Added toggle repeat & shuffle methods
* Fix URI validation
* Bug fixes & improvements

# Version 0.4.0   
  
**What's New**  
  
* Initial release