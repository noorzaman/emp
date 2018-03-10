var DEV_DEBUG = false;
/** 
 * A list of all methods defined for searching through Enhanced Meeting Planner entries
 * 
 * searchAll ()
 *   This method simply returns all data stored against a particular index and type.
 *   A large number of records may be returned for this call.
 * 
 * searchBy(fields, keywords)
 *   The mother of all combinations. You can search using particular fields and keywords.
 *   For example:
 *     searchBy ([tags], [mocha]) will search for the word "mocha" in the tags field only.
 *     searchBy ([], [mocha]) will search for the word "mocha" in all fields
 *     searchBy ([theme, tags], [professional mocha]) will search for the words "mocha" and
 *       "professional" in the fields theme and tags
 *     searchBy([], []) acts as searchAll()
 * 
 * searchByTheme (theme)
 *   A simpler version of searchBy method that only searches for all places using theme
 * 
 * searhByTags(tags)
 *   Returns all records meeting the keywords defined in the tags field.
 * 
 * searchByEmailId (theme)
 *   Returns a single record by the email id.
 * 
 * @author nurul zaman
 * @since v 1.0
 */


function searchByEmailId(email) {
    var jsonStr = '{"query": {"ids" : {"values" : ["' + email + '"]}}}';

    var searchUrl = createElasticSearchUrl() + '/_search';

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    var responseTxt = JSON.stringify(JSON.parse(response),null,2);  
    return responseTxt;      
}

function searchAll() {
    //var jsonStr = '{"query" : {"match_all" : {}}}';
    var jsonStr = '{"query":{"match_all":{}},' 
        + '"sort":[{"meeting_place.update_date":{"order":"desc"}}]}';
    if (DEV_DEBUG) alert (jsonStr);

    var empUrl = createElasticSearchUrl();
    var searchUrl = createElasticSearchUrl() + '/_search?size=1000&from=0';

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    return response;
}

function searchBy(fields, keywords) {
    var jsonStr = ""
    if ( (fields == null || fields == undefined || fields.trim() == "")
        && (keywords == null || keywords == undefined ||  keywords.trim() == "") ){
            jsonStr = '{"query":{"match_all":{}},' 
                + '"sort":[{"meeting_place.update_date":{"order":"desc"}}]}';


    } else if (  (keywords != null && keywords != undefined && keywords.trim() != "")
            && (fields != null && fields != undefined && fields.trim() != "" ) ) {
        jsonStr = '{"query": {"simple_query_string" : {"fields" : ["' 
            + fields + '"], "query" : "' 
            + keywords + '"}}}';

    } else  if (keywords == null || keywords == undefined ||  keywords.trim() == "") {
        jsonStr = '{"query": {"simple_query_string" : {"fields" : ["' 
            + fields + '"], "query" : "' 
            + "*" + '"}}}';

    } else if (fields == null || fields == undefined || fields.trim() == "") {
        jsonStr = '{"query": {"multi_match" : '
            + '{"fields" : ["' + "*" + '"],'
            + '"query" : "' + keywords + '"}}}';
        //jsonStr = '{"query":{"match":{"_all":"' + keywords + '"}}}';
    }

    var searchUrl = createElasticSearchUrl() + '/_search?size=1000&from=0';

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    return response; 
}


function searchByKeywords(keywords) {

    var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["tags"], "query" : "' 
                    + keywords + '"}}}';

    var searchUrl = createElasticSearchUrl() + '/_search?size=1000&from=0';

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    return response;  
}


function searchByTheme(theme) {
    var jsonStr = '{"query": {"simple_query_string" : {"fields" : ["meeting_place.theme"], "query" : "' 
                + theme + '"}}}';

    var searchUrl = createElasticSearchUrl() + '/_search?size=1000&from=0';

    var response = searchUsingXmlHttp(searchUrl, jsonStr);
    return response;  
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