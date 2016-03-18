import path from 'path'

export default (router) => {

  router.route('/:email/*')

  .get( (req, res, next) => {
    if(req.params.email === req.auth.user.email)
      res.sendFile(path.resolve(path.join(__dirname, '../account/', decodeURI(req.url.match(/[^?]+/)))))
    else
      res.sendStatus(403)
  })

  return router

}
