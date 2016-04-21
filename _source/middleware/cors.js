/**
 * Created by Leon on 18/03/2016.
 */
export default (req, res, next) => {
  // valid request origins
  let whitelist = ['http://mediavault.xyz', 'http://www.mediavault.xyz']
  // set headers
  if (req.method === 'OPTIONS') {
    if (whitelist.indexOf(req.get('origin').toLowerCase()) > -1) {
      res.header('Access-Control-Allow-Origin', req.get('origin'))
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.send(200)
  } else {
    next()
  }
}
