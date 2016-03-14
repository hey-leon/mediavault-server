import https from 'https'
import User from '../models/user'

/*
 This method validates a user via the token sent with the request. token can be sent as query param 'id_token' or in the authorisation header.
 */
export default (req, res, next) => {
    let token = req.headers.authorization || req.query.id_token;
    if (token) {
      req.auth = {};
      req.auth.token = token;
      findUserByToken(req, res, next)
    } else
        res.status(401).send('no authentication data was received')
}


function findUserByToken(req, res, next) {
  User.findOne({ token: req.auth.token }, (error, user) => {
    if (user){
      req.auth.user = user;
      next()
    } else if (error)
      res.sendStatus(500);
    else
      validateToken(req, res, next)
  })
}


function validateToken(req, res, next) {
  https.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.auth.token}`, (authRes) => {
    authRes.on('data', (data) => {
      let authdata = JSON.parse(data);
      if (authdata.email_verified)
        findUserByEmail(authdata.email, req, res, next);
      else
        res.sendStatus(403)
    })

  }).on('error', (error) => {
    res.sendStatus(500)
  })

}


function findUserByEmail(email, req, res, next) {
  User.findOne({ email: email }, (error, user) => {
    if (user){
      updateUser(user, req, res, next)
    } else if (error)
      res.sendStatus(500);
    else
      createUser(email, req, res, next)
  })
}


function updateUser(user, req, res, next) {
  user.token = req.auth.token;
  req.auth.user = user;

  req.auth.user.save((error) => {
    if (error)
      res.status(500).send(error);
    else
      next()
  })
}


function createUser(email, req, res, next) {
  req.auth.user = new User({
    email: email,
    token: req.auth.token
  });
  req.auth.user.save((error) => {
    if (error)
      res.status(500).send(error);
    else
      next()
  })
}
