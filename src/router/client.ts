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
import ClientModel from '../models/client'

export const clientRouter = new Router({
  prefix: '/oauth2/v1'
});

// route definitions
clientRouter
  .post('/clients', createClient)
  .get('/clients', getClients)

async function experimentalRoute(ctx: any){
  ctx.body = { message: "Experimental route!" }
}

async function createClient(ctx: any){
  const request: ClientMetadata = ctx.request.body;

  const client = await ClientModel.create(request)

  client.save();

  console.log(client)
  
  const response: ClientMetadata = {
    // TODO: What is the specification for generation of unique client id?
    client_id: 'GENE-RATE-RAND-OMID-HERE',
    ...request
  }
  ctx.body = response
}

async function getClients(ctx: any){
  const clients = await ClientModel.find({})
  console.log(clients)
  ctx.body = {
    clients
  }
}

