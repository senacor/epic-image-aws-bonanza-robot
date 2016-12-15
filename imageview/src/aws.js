const AWS = require('aws-sdk');
const uuidV4 = require('uuid/v4');
const fs = require('fs');
const https = require('https');

let s3 = new AWS.S3({
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

      let fname = __dirname + "/public/" + key + ".jpg"
      if (fs.existsSync(fname)) {
        // console.log(`${fname} already exists...skip download`);
        return;
      }

      console.log(`Downloading ${fname}`)
      https.get(url, function(resp) {
        resp.pipe(fs.createWriteStream(fname))
            .on('finish', () =>
              console.log("DONE"));
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
  console.log(`Looking for ${key}`)
  let getParams = Object.assign({
    Key: key
  }, params);

  return s3.getObject(getParams)
    .promise();
}

function download(s3, params, key) {
  console.log(`Downloading ${key}`)
  let getParams = Object.assign({
    Key: key
  }, params);
  let file = fs.createWriteStream(key);
  s3.getObject(params).createReadStream().pipe(file);
}

listAll(s3, bucketParams);


