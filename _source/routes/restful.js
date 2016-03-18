import del from 'del'
import path from 'path'

import stash  from '../middleware/stash'


/* creates restful endpoint, with all base operations (see: node-restful) */
export default (router, model) => {

  router.route(`/${model.modelName}`)

    /* create */
    .post(stash,  (req, res, next) => {
      let file = req.file;

      let doc = new model({
        name: req.file.originalname,
        owner: req.auth.user.email,
        mimetype: req.file.mimetype,
        uri: req.file.path
      });

      if(req.file.meta)
        doc.meta = req.file.meta;

      if(req.file.thumburi)
        doc.thumburi = req.file.thumburi;

      doc.save( (error) => {
        if (error)
          res.status(500).send(error);
        else
          res.status(200).send(doc)
      })
      
    })

    /* read */
    .get( (req, res, next) => {
      model.find({ owner: req.auth.user.email }, (error, docs) => {
        if (error)
          res.status(500).send(error);
        else
          res.status(200).send(docs)
      })
    });


  router.route(`/${model.modelName}/:id`)

    /* read by id */
    .get((req, res, next) => {
      model.findById(req.params.id, (error, doc) => {
        if (error)
          res.status(500).send(error);
        else
          res.status(200).send(doc)
      })
    })

    /* update */
    .patch((req, res, next) => {
      model.findById(req.params.id, (error, doc) => {
        if (error)
          res.status(500).send(error);
        else {
          let attributes = model.schema.paths;
          for(let attribute in attributes){
              if(attribute in req.body)
                doc.attribute = req.body[attribute]
          }
          doc.owner = req.auth.user.email;

          doc.save( (error) => {
            if (error)
              res.status(500).send(error);
            else
              res.sendStatus(200)
          })
        }
      })
    })

    /* delete */
    .delete((req, res, next) => {
      new Promise ((resolve) => {
        model.findById(req.params.id, (error, doc) => {
          if (error)
            res.status(500).send(error);
          else {
            del(path.join(__dirname, '/../', doc.uri));
            if (doc.thumburi)
              del(path.join(__dirname, '/../', doc.thumburi))
          }
          resolve()
        })
      }).then(() => {
        model.findByIdAndRemove(req.params.id, (error) => {
          if (error)
            res.status(500).send(error);
          else
            res.sendStatus(200)
        })
      })
    })

}
