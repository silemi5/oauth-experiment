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

app.listen(3000)
console.log('Server running on port 3000')

