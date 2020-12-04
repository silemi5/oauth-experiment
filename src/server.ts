import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { clientRouter } from './router/client'
import { authorizeRouter } from './router/authorize'

import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

const DATABASE_URI: string = process.env.MONGODB_URI || ""

export const app = new Koa();
app.use(bodyParser())
app.use(authorizeRouter.routes())
app.use(clientRouter.routes())
app.use(async (ctx, next) => {
  await next()
  setNoCacheHeaders(ctx)
})

mongoose.connect(DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.listen(3000)
console.log('Server running on port 3000')

// https://stackoverflow.com/questions/51450411/set-header-cache-control-in-koa-frame-work
function setNoCacheHeaders(ctx: any){
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  ctx.set('Pragma', 'no-cache')
  ctx.set('Expires', 0)
}

