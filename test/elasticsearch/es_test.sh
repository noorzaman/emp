#!/bin/bash

verbose=false


# Setting the address of  end point
addr="https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com"

#curl -X DELETE "$addr/emp/rooms/$room1_name"
#curl -X GET "$addr/emp/rooms/$room1_name"


# check if verbose output
while getopts ":v" opt; do
   case $opt in
   v )  verbose=true ;
   esac
done


# create a room and some of its updated versions
# these will be used to run all tests

room1_name=scr_test_room1
room2_name=scr_test_room2
room3_name=scr_test_room3

room1_content='{"space":{"added_ts":"20180304","name":"Script test room 1",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"whiteboard","capacity":5,"themes":"Studious",'\
'"description":"Script test room #1 for testing"}}'

room2_content='{"space":{"added_ts":"20180304","name":"Script test room 2",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"blackboard","capacity":5,"themes":"Studious",'\
'"description":"Script test room #2 for testing"}}'

room3_content='{"space":{"added_ts":"20180304","name":"Script test room 3",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"whiteboard","capacity":5,"themes":"Zen",'\
'"description":"Script test room #3 for testing"}}'

room1_content_updated_capacity='{"space":{"added_ts":"20180304","name":"Script test room 1",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"blackboard","capacity":42,"themes":"Studious",'\
'"description":"Script test room #1 for testing"}}'

room1_content_updated_attr='{"space":{"added_ts":"20180304","name":"Script test room 1",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"blackboard","capacity":5,"themes":"Studious",'\
'"description":"Script test room #1 for testing"}}'

room1_content_updated_theme='{"space":{"added_ts":"20180304","name":"Script test room 1",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"blackboard","capacity":5,"themes":"Zen",'\
'"description":"Script test room #1 for testing"}}'

room1_content_updated_desc='{"space":{"added_ts":"20180304","name":"Script test room 1",'\
'"image_key":"frames/2018/3/27/21/place@emp.com.jpg",'\
'"image":"data:image/jpeg;base64,/9j/","updated_ts":"20180304",'\
'"attributes":"blackboard","capacity":5,"themes":"Studious",'\
'"description":"updated description"}}'



create_scr_test_room1 () {
	curl -X POST "$addr/emp/rooms/$room1_name" \
	-H'Content-Type: application/json' -d "$room1_content" \
	--stderr - | egrep "^{\"error"  > /dev/null
}

create_scr_test_room2 () {
	curl -X POST "$addr/emp/rooms/$room2_name" \
	-H'Content-Type: application/json' -d "$room2_content" \
	--stderr - | egrep "^{\"error"  > /dev/null
}

create_scr_test_room3 () {
	curl -X POST "$addr/emp/rooms/$room3_name" \
	-H'Content-Type: application/json' -d "$room3_content" \
	--stderr - | egrep "^{\"error"  > /dev/null
}

delete_test_rooms () {
	curl --silent -X DELETE "$addr/emp/rooms/$room1_name" > /dev/null
	curl --silent -X DELETE "$addr/emp/rooms/$room2_name" > /dev/null
	curl --silent -X DELETE "$addr/emp/rooms/$room3_name" > /dev/null

}

get_scr_test_room1 () {
	curl -X GET "$addr/emp/rooms/$room1_name" \
	--stderr - | egrep "\"found\":true"  > /dev/null
}



echo
echo -- Test 1: Create a meeting space
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1
# verify
if [ $? -eq 0 ]; then echo "Test Result: Failure"; else echo "Test Result: Success"; fi
# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo



echo -- Test 2: Retrieve a meeting space
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1

# retrieve
get_scr_test_room1

# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo


echo -- Test 3: Update a meeting space capacity
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1

# update
if [ "$verbose" == true ]; then echo "Updating capacity of room"; fi
curl -X POST "$addr/emp/rooms/$room1_name" \
-H'Content-Type: application/json' -d "$room1_content_updated_capacity" \
--stderr - | egrep "^{\"error"  > /dev/null

# retrieve
if [ "$verbose" == true ]; then echo "Retrieving room with modified capacity"; fi
curl -X GET "$addr/emp/rooms/$room1_name" \
--stderr - | egrep "\"capacity\":\"42\""  > /dev/null

# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo



echo -- Test 4: Update a meeting space attributes
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1

# update
if [ "$verbose" == true ]; then echo "Updating attribute of room"; fi
curl -X POST "$addr/emp/rooms/$room1_name" \
-H'Content-Type: application/json' -d "$room1_content_updated_attr" \
--stderr - | egrep "^{\"error"  > /dev/null

# retrieve
if [ "$verbose" == true ]; then echo "Retrieving room with modified attribute"; fi
curl -X GET "$addr/emp/rooms/$room1_name" \
--stderr - | egrep "\"attributes\":\"blackboard\""  > /dev/null

# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo



echo -- Test 5: Update meeting space themes
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1

# update
if [ "$verbose" == true ]; then echo "Updating theme of room"; fi
curl -X POST "$addr/emp/rooms/$room1_name" \
-H'Content-Type: application/json' -d "$room1_content_updated_theme" \
--stderr - | egrep "^{\"error"  > /dev/null

# retrieve
if [ "$verbose" == true ]; then echo "Retrieving room with modified theme"; fi
curl -X GET "$addr/emp/rooms/$room1_name" \
--stderr - | egrep "\"themes\":\"Zen\""  > /dev/null

# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo



echo -- Test 6: Update meeting space description
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1

# update
if [ "$verbose" == true ]; then echo "Updating description of room"; fi
curl -X POST "$addr/emp/rooms/$room1_name" \
-H'Content-Type: application/json' -d "$room1_content_updated_desc" \
--stderr - | egrep "^{\"error"  > /dev/null

# retrieve
if [ "$verbose" == true ]; then echo "Retrieving room with modified description"; fi
curl -X GET "$addr/emp/rooms/$room1_name" \
--stderr - | egrep "\"description\":\"updated description\""  > /dev/null

# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo



echo -- Test 7: Delete a meeting space
# insert
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
create_scr_test_room1

# retrieve
if [ "$verbose" == true ]; then echo "Retrieving newly created room"; fi
get_scr_test_room1

# verify to deletion step
if [ $? -eq 0 ]; then
	curl  --silent -X DELETE "$addr/emp/rooms/$room1_name" > /dev/null
	# retrieve
	get_scr_test_room1
	if [ $? -eq 0 ]; then echo "Test Result: Failure"; else echo "Test Result: Success"; fi
else
	echo "Test Result: Failure - error creating new room"
fi
# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo


echo -- Test 8: Retrieve rooms by theme [tbd]
create_scr_test_room1
create_scr_test_room2
create_scr_test_room3
echo Success
# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo


echo -- Test 9: Retrieve rooms by attribute
if [ "$verbose" == true ]; then echo "Setup - Creating three rooms, two with same attribute"; fi
create_scr_test_room1
create_scr_test_room2
create_scr_test_room3

# execute
if [ "$verbose" == true ]; then echo "Retrieving 2 rooms with common attribute"; fi
 curl -XGET "$addr/emp/rooms"/_count?pretty -H 'Content-Type: application/json' -d '{
     "query" : {
         "term" : { "space.attributes" : "whiteboard" }
     }
 }' \
 --stderr - | egrep "\"count\" : 2"  > /dev/null
 
# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo


echo -- Test 10: Negative test - retrieve non-existing room
if [ "$verbose" == true ]; then echo "Setup - Creating a room"; fi
delete_test_rooms
create_scr_test_room2

# execute
if [ "$verbose" == true ]; then echo "Retrieving room with a non existant name"; fi
curl -X GET "$addr/emp/rooms/$room1_name" \
 --stderr - | egrep "\"found\":false"  > /dev/null

# verify
if [ $? -eq 0 ]; then echo "Test Result: Success"; else echo "Test Result: Failure"; fi

# clean up
if [ "$verbose" == true ]; then echo "Cleaning up"; fi
delete_test_rooms
echo