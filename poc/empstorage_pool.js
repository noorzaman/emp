
AWS.config.region = 'us-east-1'; 

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:20b70abe-c545-4142-b684-e36913ad3d3a' 
});

AWS.config.credentials.get(function(err) {
    if (err) alert(err);
    console.log(AWS.config.credentials);
});

var bucketName = 'empstorage'; // Enter your bucket name
var bucket = new AWS.S3({
    params: {
        Bucket: bucketName
    }
});

function store(file) {
    alert ('store');
    var objKey = file.name;
    alert (objKey);
    var params = {
        Key: objKey,
        ContentType: file.type,
        Body: file,
        ACL: 'public-read'
    };

    bucket.putObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            alert ('store error');
        } else {
            console.log(data);  // successful response
            alert ('store success');
        }
    });
}
