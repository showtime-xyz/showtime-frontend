Change Log
==========
## Version 1.2.3
* Stability fixes on WebView based auth
* Set LoginActivity launch mode to CLEAR_TOP but not SINGLE_TOP, so the activity will be recreated

## Version 1.2.2
* Remove custom-tabs handling due to issues

## Version 1.2.1
* Fixes an issue that produced a redirect error when the redirect uri contains CAPS.

## Version 1.2.0

* Breaking changes: Rename classes from AuthenticationClassName to AuthorizationClassName
* Pass state parameter in AuthorizationResponse
* Add  method to clear Spotify and Facebook cookies to AuthenticationClient
* Upgrade buildToolsVersion to 27.0.3
* Replace deprecated compile keyword in gradle files

## Version 1.1.0

* Upgrade target and compile SDKs to 27
* Upgrade android support libraries to 27.0.2
