import fs              from 'fs'
import https           from 'https'
import express         from 'express'
import bodyParser      from 'body-parser'
import mongoose        from 'mongoose'

import authentication  from './middleware/authentication'
import cors            from './middleware/cors'
import restful         from './routes/restful'
import account         from './routes/account'
import endpoints       from './endpoints'

let server  = express(),
    port    = 3000,
    api     = express.Router(),
    data    = express.Router();


/* parse request body */
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

/* support cors */
server.use(cors);

/* all request must be authenticated */
server.use(authentication);


/* connect to mongodb and start server */
mongoose.connect('mongodb://localhost:27017/api');
mongoose.connection.once('open', () => {


  for (let endpoint of endpoints)
    restful(api, endpoint);

  server.use('/api', api);

  server.use('/account', account(data));

  server.listen(port);

  console.log(`listening to port: ${port}`)

});
