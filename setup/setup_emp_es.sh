addr=https://search-emp-test-domain-nofl5ksboic5qjd7q7f6qunolq.us-east-1.es.amazonaws.com
echo $addr

curl -X DELETE "$addr/emp"?pretty
curl -X DELETE "$addr/tags"?pretty
echo
curl -X PUT "$addr/emp"?pretty
curl -X PUT "$addr/tags"?pretty
echo
curl -X GET "$addr/emp"?pretty
curl -X GET "$addr/tags"?pretty
echo
echo

curl -X POST "$addr/tags/fixed/tags_list" -H 'Content-Type: application/json' -d '
{
"space": {
"added_ts": "20180304",
"name": "Fixed Tags",
"image_key": "fixed_tags@emp.com.jpg",
"image": "null",
"updated_ts": "20180304",
"attributes": [
"Whiteboard",
"TV",
"Projector",
"Board Room",
"Restaurant",
"Cafe",
"Table",
"Chair",
"Couch",
"Desk",
"Chalkboard",
"Phone",
"Speakers",
"Outlets",
"Smartboard",
"Microphone",
"Lecturn",
"Auditorium",
"Classroom",
"Boardroom",
"Theater",
"Kitchenette",
"Hallway",
"Lounge",
"Bar",
"Indoor",
"Outdoor",
"Flip Chart",
"WiFi"
],
"capacity": 0,
"themes": "FixedTags",
"description": "Fixed common use tags for meeting spaces"
}
}'

