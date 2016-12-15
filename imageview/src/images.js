const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const uuidV4 = require('uuid/v4');
const cors = require('cors')
const fs = require('fs')
const mqtt = require('mqtt')
const AWS = require('aws-sdk');
const https = require('https');
const os = require('os');
const details = require ('./picture-details');
const ExifImage = require('exif').ExifImage;
const ip = os.networkInterfaces().en0.filter(i => i.family === 'IPv4').map(e => e.address)[0];
const bucketId = 'com.senacor.tecco.insanerobot'
const client = mqtt.connect('mqtt://10.22.0.204:1883')

client.on('connect', function() {
  client.subscribe('robot/camera');
});

setInterval(() => {
  client.publish('robot/service', JSON.stringify({service: 'images', url: `http://${ip}:3001/images`}));
}, 30000);

client.on('message', function(topic, message) {
  console.log(`Received ${message} on topic ${topic}`)

  try {
    payload = JSON.parse(message);

    if (payload.image) {
      console.log("Should fetch " + payload.image);
      listAll(s3, bucketParams);
    }
  }
  catch (e) {
  }
});

let s3 = new AWS.S3({
               signatureVersion: 'v4'
             });
if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1'
  });
}
let rekognition = new AWS.Rekognition({
               signatureVersion: 'v4'
             });

const bucket = 'com.senacor.tecco.insanerobot';
const bucketParams = {
  Bucket: bucket
};

function errorHandler(err) {
  if (err) {
    console.log("Got error:", err.message);
    if (this && this.request) {
      console.log("Request:");
      console.log(this.request.httpRequest);
    }
  }
}

function listAll(s3, params) {
  s3.listObjects(Object.assign({Prefix: 'test/'}, params) , function(err, data) {
    if (err) {
      errorHandler(err);
      return;
    }
    let href = this.request.httpRequest.endpoint.href;
    let bucketUrl = href + params.Bucket + '/';

    data.Contents.map(function(item) {
      let key = item.Key;
      var url = bucketUrl + key;

      if (key === "test/") {
        return;
      }

      let fname = __dirname + "/public/" + key
      if (fs.existsSync(fname) || fs.existsSync(fname + ".jpg") ) {
        // console.log(`${fname} already exists...skip download`);
        return;
      }

      console.log(`Downloading my image ${fname}`)
      https.get(url, function(resp) {
        resp.pipe(fs.createWriteStream(fname))
            .on('unpipe', () =>
              fs.renameSync(fname, fname + ".jpg"));
      });
    });
  });
}

function store(s3, params, key, payload) {
  console.log(`Key: ${key} Payload: ${payload}`)
  let storeParam = Object.assign({
    Key: key,
    Body: payload + new Date()
  }, params);

  return s3.putObject(storeParam)
           .promise();
}

function get(s3, params, key) {
  console.log(`Looking for stuff ${key}`)
  let getParams = Object.assign({
    Key: key
  }, params);

  return s3.getObject(getParams)
    .promise();
}

function download(s3, params, key) {
  console.log(`Downloading image ${key}`)
  let getParams = Object.assign({
    Key: key
  }, params);
  let file = fs.createWriteStream(key);
  s3.getObject(params).createReadStream().pipe(file);
}

function analyse(s3, params, key) {
  return new Promise(function(resolve, reject) {
    try {
      let fname = key.indexOf("test") < 0 ? __dirname + "/public/test/" + key
                                           : __dirname + "/public/" + key

      console.log("Analysing " + fname);
      new ExifImage({ image : fname }, function (error, exifData) {
          if (error)
              console.log('Error: '+error.message);
          else
              console.log(exifData); // Do something with your data!
              resolve(exifData);
      });
    } catch (error) {
        console.log('Error: ' + error.message);
        reject(error)
    }
  }).then(exifData => {
    return new Promise(function(resolve, reject) {
       details.detectDetails(s3, params, key, rekognition)
        .then(function(data){
            console.log('My new log ', data);
            resolve( data);
        }).catch(function(err){
            reject(err);
        });
    });  

  })

}

listAll(s3, bucketParams);

setInterval(() => {
  listAll(s3, bucketParams);
}, 60000)

router.use(bodyParser.json())
router.route('/')
      .get((req, res, next) => {
        let d = fs.readdirSync('src/public/test')
          .filter(elem => elem.endsWith(".jpg"))
          .map(elem => {
            return {
              id: elem,
              url: `http://${ip}:3001/test/${elem}`
            }
          });

        res.send({
          status: 'Ok',
          images: d
        })
      })
      .all((req, res, next) => {
        res.status(501).send('Not implemented')
      })

router.route('/:id')
      .get((req, res, next) => {
        console.log('Going to analyse')
        // todo plug analysis via Amazon
        analyse(s3, bucketParams, req.params['id'])
          .then(result => {
            res.send(Object.assign(  
            {
              status: 'OK'
            }, result
            ))
          })
          .catch(err => console.log(err));

      })
      .all((req, res, next) => {
        res.status(501).send('Not implemented')
      });

express()
  .use(cors())
  .use(express.static(__dirname + '/public'))
  .use('/images', router)
  .use(function (err, req, res, next) {
      console.log('Error handled:', err.message);
      res.writeHead(500);
      res.end('Server error!');
   })
  .listen(3001);


