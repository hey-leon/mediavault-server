export default (req, cb) => {
  // whitelisted origins
  let whitelist = [
    'http://mediavault.xyz',
    'http://www.mediavault.xyz'
  ]
  // check if whitelisted
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    cb(null, { origin: true })
  } else {
    cb(null, { origin: false })
  }
}
