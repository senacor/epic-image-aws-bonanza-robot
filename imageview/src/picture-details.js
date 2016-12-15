function get(s3, params, key) {
  console.log(`Looking for ${key}`)
  let getParams = Object.assign({
    Key: key
  }, params);

  return s3.getObject(getParams)
    .promise();
}

var detectDetails = function (s3, params, key, rekognition) {
	let awskey = key;
	if (!key.indexOf('test') > -1) {
		awskey = `test/${key}`;
	}

  awskey = awskey.replace(/\.jpg/, "");

	console.log("Searching for " + awskey);

	return new Promise(function(resolve, reject) {
  		// do a thing, possibly async, then…
	  get(s3, params, awskey)
	  		.then(function(value) {
	            	rekognition.detectLabels({Image: {Bytes: value.Body}}, function(err, data){
	            		if(err){
	            			reject(Error(err))
	            		}
	            		else{
	            			resolve(data);
	            		}
	            	});
	          });
	})
};

module.exports = {detectDetails};