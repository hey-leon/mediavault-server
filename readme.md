# Mediavault REST server with oauth2

This server acts as cloud storage server for the mediavault app. all requests
are authorized with google's oath2 tokens. the server handles databasing
metadata of users files, and securely storing user data. the server uses
standard CRUD operations, and extracts file meta data for the user.

the metadata extracted includes:

 * id3v2 tags from audio tracks (including thumbnail album art).
 * thumbnails from video files.
 * thumbnails from images.


### System dependencies

 * NodeJS + NPM
 * All package dependencies
 * GraphicsMagick
 * ffmpeg
 
more documentation to come...

