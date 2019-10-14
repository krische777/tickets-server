const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5555
const userRouter=require('./user/router')
const authRouter=require('./auth/router')
const eventRouter=require('./events/router')
const ticketRouter=require('./tickets/router')

const corsMiddleware = cors()
app.use(corsMiddleware)
app.use(bodyParser.json())
app.use(userRouter)
app.use(authRouter)
app.use(eventRouter)
app.use(ticketRouter)

app.get('/test', (request, response)=>response.send('hey hey'))

app.listen(port, () => console.log(`App listening on port ${port}!`))
