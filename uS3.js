// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-west-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-west-2:e288c4c7-85a2-48a2-993c-57da6e01f510',
});

var bucketName = 'cvpa'
var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName }
});


function listS3Bucket() {
	s3.listObjects(function(err, data) {
		if (err) {
			return alert("There was an error listing the Bucket: " + err.message);
		} else {
			s3BucketList = [];
			for (var i = 0; i < data.Contents.length; i++) {
				var key = data.Contents[i].Key;
				var lastModified = data.Contents[i].LastModified;
				var size = data.Contents[i].Size;
				s3BucketList.push({key, lastModified, size});
			};
			//console.log(data)
		};		
		currentState.s3BucketListFetched = true;
	});
};

function fetchS3Object(folderName, objName) {
	var href = 'https://s3.us-west-2.amazonaws.com/';
	href += bucketName + "/" + folderName + "/" + objName;
	fetch(href).then(function (response) {
		response.text().then(function(text) {
			//console.log('Object fetched')
			trendAllJSON = text;
			currentState.s3ObjectFetched = true;
		});
	});
};

function saveS3Object(folderName, objName, dataObj) {
	var param = {
		Key: folderName + "/" + objName +".json",
		Body: dataObj,
	};
	s3.putObject(param, function(err, data) {
		if (err) {
			return alert("There was an error creating your album: " + err.message);
		} else {
			//alert("Successfully saved S3 Object: " + param.Key);
			currentState.s3SavingObject = false;
		};
    });
};

