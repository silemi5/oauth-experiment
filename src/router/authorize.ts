import Router from "koa-router";
import Koa from 'koa';
import jwt from 'jsonwebtoken'
import jws from 'jws'
import dotenv from 'dotenv'
import { AuthorizationWhileLoggedInRequest, ClientMetadata } from '../interface/client'
import { cache } from '../cache'
import { v5 as uuid } from 'uuid'

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || ""
const NAMESPACE = process.env.NAMESPACE || "ee5e7a7c-d081-4e86-84aa-a9dfdb956c4c"

export const authorizeRouter = new Router({
  prefix: '/oauth2/v1'
});

// route definitions
authorizeRouter
  .get('/authorize', authorize)
  .post('/token', token)
  .post('/introspect', experimentalRoute)
  .post('/revoke', experimentalRoute)
  .post('/logout', experimentalRoute)
  .post('/keys', experimentalRoute)
  .post('/userinfo', experimentalRoute)

  
async function experimentalRoute(ctx: any){
  ctx.body = { message: "Experimental route!" }
}

async function authorize(ctx: any){
   /**
   * Expected request body:
   *  client_id
   *  response_type
   *  redirect_uri
   *  scope
   *  state
   */
  // Assuming that user is logged in
  const request: AuthorizationWhileLoggedInRequest = ctx.request.query

  // Let's see if the client application is registered with the authorization server
  // TODO: query for client info here

  // Placeholder credentials, assuming user was logged-in
  const credentials = {
    username: "user011",
  }
 
  // Generate an unique identifier to serve as the authorization code
  const uid: string = uuid(`authorization_code:${request.client_id}:${request.username}:${request.scope}:${Date.now()}:${SECRET_KEY}`, NAMESPACE)
  
  // Issue an authorization code
  const payload = jwt.sign({
    id: uid,
    client_id: request.client_id,
    redirect_uri: request.redirect_uri,
    scope: request.scope,
    username: request.username, //TODO: user id instead of username
    exp: Math.floor(Date.now() / 1000) + (60 * 10), // code will only be valid for 10 minutes
  }, SECRET_KEY)

  // Store it in cache
  cache.set(uid, payload)

  // Generates redirect uri
  const uri = encodeURI(`${request.redirect_uri}?code=${uid}`)

  // Redirects to the generated redirect uri
  console.log(`URI: ${uri}`)
  ctx.redirect(uri)
  return
}

async function token(ctx: any){
  /**
   * First check if authorization code is valid and is not expired.
   * Then verify that the authorization code provided in the request
   *  was issued to the client identified. 
   * Finally, redirect uri must match with the redirect_uri used to
   *  request for authentication code.
   * 
   * Reference: https://tools.ietf.org/html/rfc6750
   * 
   * NOTE: authorization code in the cache must be
   */
  const request: { code: string, client_id: string; client_secret: string; redirect_uri: string;  } = ctx.request.body

  // Gets the information from the cache
  const payload: any = cache.get(request.code)
  if(payload){
    // Dispose the authorization code for security
    // cache.del(request.code)

    const decodedPayload: any = jwt.verify(payload, SECRET_KEY)

    if(!decodedPayload) throw new Error('Invalid payload!')

    // Verify if client is the same one who requested the authorization key
    // TODO: find client by its id, match with the client secret (?)
    const client: ClientMetadata = { // NOTE: this is a placeholder
      client_name: "CB Apps",
      client_id: "client_id12121",
      client_uri: "http://localhost",
      client_description: "Placeholder client info",
      client_secret: 'SECRET-CLIENT-HERE',
      redirect_uris: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://oauthdebugger.com/debug'],
      application_type: 'web',
    }

    // Check if client secret matches
    if(!(client.client_secret === request.client_secret)) throw new Error("Secret doesn't match!")

    // Make sure redirect uri matches
    if(!client.redirect_uris?.includes(decodedPayload.redirect_uri)) throw new Error("Redirect URI didn't match!")

    // Issue access token here
    const access_token = jwt.sign({
      sub: decodedPayload.username, // should be userID instead of username
      iss: 'https://localhost:3000', // token endpoint
      aud: decodedPayload.client_id,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), //token will be valid for 2 hours 
      scope: decodedPayload.scope
    }, SECRET_KEY);

    console.log(access_token);

    ctx.body = {
      token: access_token
    }

  } else {
    // Return an error
    ctx.body = "invalid authorization code!"
  }
}
