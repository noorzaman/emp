
addr=https://search-emp-test-domain-nofl5ksboic5qjd7q7f6qunolq.us-east-1.es.amazonaws.com
if [ "$#" -eq 1 ]
then
addr=$1
fi
echo Using the endpoont..
echo $addr
echo
echo "-- Removing previous instance of emp"
curl -X DELETE "$addr/emp"?pretty
echo
echo "-- Removing previous instance of tags"
curl -X DELETE "$addr/tags"?pretty
echo
echo "-- Adding index for emp"
curl -X PUT "$addr/emp"?pretty
echo
echo "-- Adding index for tags"
curl -X PUT "$addr/tags"?pretty
echo
echo "-- Display index for emp"
curl -X GET "$addr/emp"?pretty
echo
echo "-- Display index for tags"
curl -X GET "$addr/tags"?pretty
echo
echo "-- Adding fixed tags list"
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
echo
echo -- Done
echo
