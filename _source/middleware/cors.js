/**
 * Created by Leon on 18/03/2016.
 */
export default (req, res, next) => {
  // valid request origins
  let whitelist = ['http://mediavault.xyz', 'http://www.mediavault.xyz']
  // test request origin
  let origin
  if (whitelist.indexOf(req.get('origin').toLowerCase()) > -1) {
    origin = req.get('origin')
  } else {
    origin = whitelist[0]
  }
  // set headers
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', origin)
  // if pre-flight? return request now : next middleware
  if (req.method === 'OPTIONS') {
    return res.status(200).send()
  } else {
    next()
  }
}
