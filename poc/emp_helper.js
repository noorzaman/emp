var DEV_DEBUG = true;

function searchAll() {
    var jsonStr = '{"query" : {"match_all" : {}}}';

    //var jsonStr = '{"query" : {"match_all" : {}},"sort": { "meeting_place.create_date":   { "order": "desc" }}}';


    if (DEV_DEBUG) alert (jsonStr);

    var empUrl = createElasticSearchUrl();
    //var searchUrl = empUrl + '/_search';
    var searchUrl = createElasticSearchUrl() + '/_search?size=1000&from=0';

    if (DEV_DEBUG) alert (searchUrl);

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    responseTxt = flattenJson(response);
    //var responseTxt = JSON.stringify(JSON.parse(response),null,2);  
    document.getElementById("allResponses").innerHTML = responseTxt;

}

function flattenJson(response) {
    var js = JSON.parse(response);
    var rooms = js.hits.hits;

    var summary = "";
    for (var i = 0; i < rooms.length; i++) {
        summary += 
            rooms[i]._source.meeting_place.theme + "\t"
            + rooms[i]._source.meeting_place.email + "\t"
            + rooms[i]._source.meeting_place.name + "\n"
            //+ rooms[i]._source.meeting_place.description + "\n"
        ;
    }
    if (DEV_DEBUG) alert (summary);
    return summary;
}



function searchByEmailId() {
    var emailId = document.getElementById("emailId").value;
    var jsonStr = '{"query": {"ids" : {"values" : ["' + emailId + '"]}}}';
    if (DEV_DEBUG) alert (jsonStr);

    var searchUrl = createElasticSearchUrl() + '/_search';
    if (DEV_DEBUG) alert (searchUrl);

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    var responseTxt = JSON.stringify(JSON.parse(response),null,2);  
    document.getElementById("responseByEmailId").innerHTML = responseTxt;           
}


function createElasticSearchUrl () {

    var empUrl = null;

    var empHost = document.getElementById("empHost").value;
    var empIndex = document.getElementById("empIndex").value;
    var empType = document.getElementById("empType").value;

    if (empHost == null || empHost == undefined) 
        empHost = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com';
    if (empIndex == null || empIndex == undefined)
        empIndex = "emp";
    if (empType == null || empType == undefined) 
        empType = "rooms";
    empUrl = empHost + "/" + empIndex + "/" + empType;
    return empUrl;
}


function searchUsingXmlHttp(empUrl, queryStr) {

    //var empUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms/_search?size=1000&from=0'; 

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', empUrl, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlHttp.send(queryStr);

    var response = xmlHttp.responseText;  
    if (DEV_DEBUG) alert(response);
    return response;
}


// from insert

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

function storeElastic(form) {
    var root = new Object();

    var meeting_place_obj = new Object();
    root.meeting_place = meeting_place_obj;

    var location_obj = new Object();
    var office_location_obj = new Object();
    location_obj.office = office_location_obj;

    var other_location_obj = new Object();
    location_obj.other = other_location_obj;

    root.location = location_obj;

    var tagsObj = new Object();
    root.tags = tagsObj;


    var i = 0;
    var fe = form.elements;
    for (i = 0; i < fe.length; i+=1) {
        if (fe[i].id == "meeting_place.email") {
            root.meeting_place.email = fe[i].value;
        } else if (fe[i].id == "meeting_place.name") {
            root.meeting_place.name = fe[i].value;
        } else if (fe[i].id == "meeting_place.theme") {
            root.meeting_place.theme = fe[i].value;  
        } else if (fe[i].id == "meeting_place.capacity") {
            root.meeting_place.capacity = fe[i].value;
        } else if (fe[i].id == "meeting_place.description") {
            root.meeting_place.description = fe[i].value;
        } else if (fe[i].id == "meeting_place.create_date") {
            root.meeting_place.create_date = fe[i].value;
        } else if (fe[i].id == "meeting_place.update_date") {
            root.meeting_place.update_date = fe[i].value; 


        }  else if (fe[i].id == "location.office_space") {
            root.location.office_space = fe[i].value; 


        }  else if (fe[i].id == "location.office.room_name") {
            root.location.office.room_name = fe[i].value; 
        }  else if (fe[i].id == "location.office.floor") {
            root.location.office.floor = fe[i].value; 
        }  else if (fe[i].id == "location.office.building") {
            root.location.office.building = fe[i].value; 


        }  else if (fe[i].id == "location.other.business_name") {
            root.location.other.business_name = fe[i].value; 
        }  else if (fe[i].id == "location.other.street_address") {
            root.location.other.street_address = fe[i].value; 
        }  else if (fe[i].id == "location.other.city") {
            root.location.other.city = fe[i].value; 
        }  else if (fe[i].id == "location.other.zip_code") {
            root.location.other.zip_code = fe[i].value; 
        }  else if (fe[i].id == "location.other.state") {
            root.location.other.state = fe[i].value; 

        } else if (fe[i].id == "tags") {
            root.tags = fe[i].value.trim().split(" ");

        }
    }
    var jsonStr = JSON.stringify(root);
    if(DEV_DEBUG) alert (jsonStr);



    var empUrl = null;
    var empHost = null;
    var empIndex = null;
    var empType = null;

    if (empHost == null || empHost == undefined) 
        empHost = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com';
    if (empIndex == null || empIndex == undefined)
        empIndex = "emp";
    if (empType == null || empType == undefined) 
        empType = "rooms";
    
    empUrl = empHost + "/" + empIndex + "/" + empType;
    
    indexUsingXmlHttp(empUrl, root.meeting_place.email, jsonStr);
}


function indexUsingXmlHttp(empUrl, id, jsonStr) {
    //var empUrl = 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp/rooms'; 
    empUrl = empUrl + "/" + id;    
    if(DEV_DEBUG) alert(empUrl);       
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', empUrl, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xmlHttp.send(jsonStr);
    var response = JSON.parse(xmlHttp.responseText);
    if(DEV_DEBUG) alert(response);
}

