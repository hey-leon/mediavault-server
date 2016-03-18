/**
 * Created by Leon on 18/03/2016.
 */


let whitelist = ['http://mediavault.xyz', 'http://www.mediavault.xyz'];

 export default (req, res, next) => {
   res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS');
   res.header('Access-Control-Allow-Headers', 'authorization');
   res.header('Access-Control-Allow-Credentials', 'true');

   if(req.method === 'OPTIONS') {
     if(whitelist.indexOf(req.get('origin').toLowerCase()) > -1){
       let origin = req.get('origin');
       console.log(origin);
       res.header('Access-Control-Allow-Origin', origin);
     }
     return res.sendStatus(200);
   } else {
     next()
   }

 }

