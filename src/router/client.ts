/**
 * Dynamic Client Registration Protocol
 * 
 * Reference:
 * https://tools.ietf.org/html/rfc7591
 * 
 * 
 **/
import Router from "koa-router";
import { ClientMetadata } from '../interface/client'

export const clientRouter = new Router({
  prefix: '/oauth2/v1'
});

// route definitions
clientRouter
  .post('/clients', createClient)
  .get('/clients', experimentalRoute)

async function experimentalRoute(ctx: any){
  ctx.body = { message: "Experimental route!" }
}

async function createClient(ctx: any){
  const request: ClientMetadata = ctx.request.body;

  const response: ClientMetadata = {
    // TODO: What is the specification for generation of unique client id?
    client_id: 'GENE-RATE-RAND-OMID-HERE',
    ...request
  }
  ctx.body = response
}

