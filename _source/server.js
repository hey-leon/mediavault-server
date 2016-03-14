import fs              from 'fs'
import https           from 'https'
import express         from 'express'
import bodyParser      from 'body-parser'
import mongoose        from 'mongoose'

import authentication  from './middleware/authentication'
import restful         from './routes/restful'
import account         from './routes/account'
import endpoints       from './endpoints'


let server  = express(),
    port    = process.env.PORT || 3000,
    api     = express.Router(),
    data    = express.Router()


/* parse request body */
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())


/* support cors */
server.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'authorization')
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') { return res.sendStatus(200) }

  else next()

})

import user from './models/user'

server.use('/a', (req, res, next) => {
  user.findOne((error, user) => {
    res.send(user)
  })
})
//
// server.use('/d/:id', (req, res, next) => {
//   let id = req.params.id
//   user.findByIdAndRemove(id, (error) => {
//     if(!error) res.send('deleted')
//     else res.send(error)
//   })
// })

/* all request must be authenticated */
server.use(authentication)


/* connect to mongodb and start server */
mongoose.connect('mongodb://localhost:27017/api')
mongoose.connection.once('open', () => {

  for (let endpoint of endpoints) { restful(api, endpoint) }

  server.use('/api', api)

  server.use('/account', account(data))

  server.listen(port)

  console.log(`listening to port: ${port}`)

})
