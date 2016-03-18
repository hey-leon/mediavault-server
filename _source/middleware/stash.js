import fs        from 'fs'
import path      from 'path'
import multer    from 'multer'
import gm        from 'gm'
import ffmpeg    from 'fluent-ffmpeg'
import mediatag  from 'jsmediatags'
import strgen    from '../libs/strgen'


export default (req, res, next) => {

  let storage = multer.diskStorage({
    destination: `./account/${req.auth.user.email}/`,
    filename: (req, file, cb) => { cb(null, file.originalname) }
  });

  multer({ storage: storage }).single('file')(req, res, (error) => {
    if (error)
      res.status(500).send(error);
    else if(req.file)
      getMetaData(req, res, next);
    else
      res.sendStatus(400)
  })

}


function getMetaData(req, res, next){

  if (req.file.mimetype.search('audio') !== -1)
    getAudioMeta(req, res, next);
  else if (req.file.mimetype.search('video') !== -1)
    getVideoMeta(req, res, next);
  else if (req.file.mimetype.search('image') !== -1)
    getImageMeta(req, res, next);
  else
    next()

}


function getAudioMeta(req, res, next){
  mediatag.read(req.file.path, {
    onSuccess: (tag) => {
      tag = tag.tags;
      req.file.meta = JSON.stringify({
        'title': tag.title,
        'album': tag.album,
        'artist': tag.artist
      });
      if('picture' in tag){
        let data = new Buffer (new Uint8Array(tag.picture.data).buffer),
            uri = path.join(
              req.file.path,
              '..',
              strgen() + tag.picture.format.replace('image/', '')
            );
        fs.writeFile(path.join(__dirname, '..', uri), data, (error) => {
          if (error)
            console.log(error);
          else
            req.file.thumburi = uri;
          next()
        })
      }
      else
        next()
    },
    onError: (error) => {
      next()
    }
  })
}


function getVideoMeta(req, res, next){
  let input = path.join(__dirname, '..', req.file.path),
      name = `${strgen()}.png`,
      thumburi = path.join(req.file.path, '..', name),
      output = path.join(input, '..');

  ffmpeg(input)
    .on('end', () => {
      console.log('screenshot created');
      req.file.thumburi = thumburi;
      next()
    }).on('error', (error, stdout, stderr) => {
      console.log(error || stderror);
      next()
    }).screenshots({
      timestamps: [10],
      filename: name,
      folder: output,
      size: '480x?'
    })
}


function getImageMeta(req, res, next){
  let input  = path.join(__dirname, '..', req.file.path),
      thumburi = path.join(req.file.path, '..',
                          strgen() + req.file.mimetype.replace('image/', '.')),
      output =  path.join(__dirname, '..', thumburi);

  gm(input)
    .resize('480', '480', '^')
    .gravity('Center')
    .crop('480', '480')
    .write(output, function (error) {
      if (error)
        console.log(error);
      else
        req.file.thumburi = thumburi;
      next()
    })
}
