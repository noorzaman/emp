

/**
 * hack to run the google api from local rather than a server
 * close all chrome instances and restart like so
 * open -a Google\ Chrome --args --disable-web-security
 * 
 * or
 * 
 * run a server
 * python -m http.server 
 * 
 * and point the browser towards the file
 * http://localhost:8000/empstorage_pool.html
 * 
 */

var empStorageUrl = "https://s3.amazonaws.com/empstorage/";
var maxTries = 5;
var numRetries = 5; //try five times on failure
var retryInterval = 1000; //ms
AWS.config.region = 'us-east-1'; 

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:20b70abe-c545-4142-b684-e36913ad3d3a' 
});


AWS.config.credentials.get(function(err) {
    if (err) alert(err);
    console.log(AWS.config.credentials);
});


var bucketName = 'empstorage'; 
var bucket = new AWS.S3({
    params: {
        Bucket: bucketName
    }
});


function store(file) {

    var objKey = file.name;
    var params = {
        Key: objKey,
        ContentType: file.type,
        Body: file,
        ACL: 'public-read'
    };

    bucket.putObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); 
        } else {
            console.log(data);  //success
        }
    });
}


function getTagsFromGoogleVision(file) {

    store(file);
    var fileName = file.name;

    showDefaultMessage();
    var tags = generateGVTags (fileName, numRetries);

    var resMap = new Object(); // or var map = {};
    resMap["imageLocation"] = empStorageUrl + fileName;
    resMap["tags"] = tags;

    return resMap;;
}


function generateGVTags(fileName, maxTries) {
    showDefaultMessage();
    var classificationRequest = '{'
        + '"requests"' + ': ['
        +    '{'
        +        '"image"' + ': {'
        +            '"source"' + ': {'
        +                '"imageUri"' + ':' 
                            + '"' + empStorageUrl + fileName + '"'
        +            '}'
        +        '},'
        +        '"features"' + ': ['
        +            '{'
        +                '"type"' + ':' + '"LABEL_DETECTION"' + ','
        +                '"maxResults"' + ': 10'
        +            '}'
        +        '],'
        +        '"imageContext"' + ': {}'
        +    '}'
        + ']'
        + '}';
    var response = sendLabelsRequest (classificationRequest);
    var tags = parseResponse(response);

    if (tags == "-1") { //try again in one second
        setTimeout(retry(classificationRequest, maxTries), 1000);
    } else {
        return tags;
    }
}


function retry(classificationRequest, maxTries) {

    if (maxTries <= 0) {
        clearAll();
        showMessage("Problem generating labels - please retry..");
        return "-1";
    }

    //showMessage("Retry number: " + maxTries + " - Retrying to generate labels in 1 sec..");
    maxTries = maxTries - 1;

    var response = sendLabelsRequest (classificationRequest);
    var tags = parseResponse(response);
    if (tags == "-1") { //try again in one second
        setTimeout(retry(classificationRequest,  maxTries), 1000);
    } else {
        return tags;
    }
}


function sendLabelsRequest(requestStr) {
    var url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCpxMZWeEDxIbgu5wkaDv1M_E--eJK8RhY";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', url, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlHttp.send(requestStr);
    var response = xmlHttp.responseText; 
    return response;
}


/**
{
    "responses": [
        {
            "error": {
                "code": 3,
                "message": "The URL does not appear to be accessible by us. 
                Please double check or download the content and pass it in."
            }
        }
    ]
}
*/
function parseResponse (response) {

    var js = JSON.parse(response);
    var response = js.responses[0];
    if (response["error"]) 
        return "-1";

    var tags = new Array();
    var annotations = js.responses[0].labelAnnotations;
     
    for (var i = 0; i < annotations.length; i++) {
        tags.push(annotations[i].description);
        //annotations[i].score;
    }
    return tags;
}
