Resources:
  https://www.youtube.com/watch?v=t18YB3xDfXI
  https://www.youtube.com/watch?v=996OiexHze0


OAuth Terminologies

  Resource owner - user who owns the data that the app will try to access
  Client - application that wants to access data
  Authorization server - system that RO could use to authorize the client to access the data (accounts.google.com)
  Resource server - API that holds the data that the client would get data from
  Authorization grant - thing that client uses to access the data, basically saying that the RO has permission to access the scope.
  Redirect URI - after authentication, where to end up after authorizating the client
  Access token - key to get into resource server

  Sometimes, AS and RS are the same. Many times it's separate.
  


Example (front-channel)
  Client: yelp.com

  Resource owner -> Authorization server
    Redirect URI: yelp.com/callback
    Response type: code

  Authorization server
    -> Google login shows
    -> Google asks RO to authorize Client in access

  Authorization server -> Redirect URI with authorization code (AC)

  (Do note that client could not use the AC in the RS so it will request for access token using AC in the AS)

  Client now exchanges authorization code with access token

  Client can now contact resource server using the access token
