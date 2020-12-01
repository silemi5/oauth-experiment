import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { clientRouter } from './router/client'
import { authorizeRouter } from './router/authorize'

import dotenv from 'dotenv'

dotenv.config();

export const app = new Koa();
app.use(bodyParser())
app.use(authorizeRouter.routes())
app.use(clientRouter.routes())
app.use(async (ctx, next) => {
  await next()
  setNoCacheHeaders(ctx)
})

app.listen(3000)
console.log('Server running on port 3000')

// https://stackoverflow.com/questions/51450411/set-header-cache-control-in-koa-frame-work
function setNoCacheHeaders(ctx: any){
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  ctx.set('Pragma', 'no-cache')
  ctx.set('Expires', 0)
}

