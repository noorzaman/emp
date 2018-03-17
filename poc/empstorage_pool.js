/** 
 * 
 * There are two helper methods used to fill out the form
 * - getRandomEmail()
 *      generates a random email instead of typing one every time
 * 
 * - getDateTime()
 *      returns a date time string in the default Elastic Search format
 * 
 * THe other methods are basically to store the document in elastic search:
 * 
 * - takes form values from the caller in the form of a json string
 * - figures out the url to post 
 *   if url is not found in the document then defaults are used
 * - Stores the document in elastic search
 * - Returns the response (success or failure)
 * 
 * @author Nurul Zaman
 * @since version 1.0
 */


var DEV_DEBUG = false;
function getRandomEmail() {
    var randomEmail = "";
    for (i = 0; i < 5; i++) { 
        randomEmail += String.fromCharCode(Math.floor(Math.random() * 26 + 97));
    }
    return randomEmail + "@emp.com";
}


function getDateTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var secs = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    
    var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + mins + ":" + secs + "Z";
}


function createElasticSearchUrl () {

    var empUrl = null;

    var empHost = null;
    var empIndex = null;
    var empType = null;

    if (document.getElementById("empHost") != undefined
        && document.getElementById("empHost") != null) {
        empHost = document.getElementById("empHost").value;
        }
    
    if (document.getElementById("empIndex") != undefined
        && document.getElementById("empIndex") != null) {
            empIndex = document.getElementById("empIndex").value;
    }

    if (document.getElementById("empType") != undefined
        && document.getElementById("empType") != null) {
            empType = document.getElementById("empType").value;
    }

    if (empHost == null || empHost == undefined || empHost.trim()=="") 
        empHost = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com';
    if (empIndex == null || empIndex == undefined || empIndex.trim()=="")
        empIndex = "emp";
    if (empType == null || empType == undefined || empType.trim()=="") 
        empType = "rooms";
    empUrl = empHost + "/" + empIndex + "/" + empType;
    return empUrl;
}


function storeInElasticSearch(emailId, formVals) {
    var jsonStr = JSON.stringify(formVals);
    empUrl = createElasticSearchUrl();
    var response = indexUsingXmlHttp(empUrl, emailId, jsonStr);
    return response;
}


/*
{
	"_index": "emp",
	"_type": "rooms",
	"_id": "cynpn@emp.com",
	"_version": 1,
	"result": "created",
	"_shards": {
		"total": 2,
		"successful": 1,
		"failed": 0
	},
	"_seq_no": 6,
	"_primary_term": 1
}
*/
function indexUsingXmlHttp(empUrl, id, jsonStr) {
    //var empUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms'; 
    empUrl = empUrl + "/" + id;    
    if(DEV_DEBUG) alert("indexUsingXmlHttp:" + empUrl);       
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', empUrl, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlHttp.send(jsonStr);
    var response = JSON.parse(xmlHttp.responseText);

    if(DEV_DEBUG) alert("indexUsingXmlHttp: " + response);

    return response;
}
   