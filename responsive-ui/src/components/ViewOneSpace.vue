<template>
  <div class="main">
    <h1>Space Title Here</h1>
    <div class="viewOneImgCol">
      <img src="/static/images/carousel/calm-room.jpeg" alt="Space image. " class="img-fluid img-thumbnail">
    </div>
    <div class="roomInfo">
      <a href="#" class="btn btn-primary viewOneLink">Set up meeting</a>
      <a href="#" class="btn btn-primary viewOneLink editBtn">Edit Space</a>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      <br>
      <div class="viewOneCapacityCol">
        <p><strong>Capacity: </strong>20</p>
        <p><strong>Themes:</strong></p>
        <ul>
          <li>Casual</li>
          <li>Quiet</li>
        </ul>
        </div>
        <div class="viewOneAttrCol">
          <p><strong>Attributes:</strong></p>
          <ul>
            <li>WiFi</li>
            <li>Food</li>
            <li>Tables</li>
            <li>Chairs</li>
          </ul>
        </div>
      </div>
      <div class="clearFix"></div>
  </div>
</template>

<script>
export default {
  name: 'ViewOneSpace',
  data () {
    return {
      placeHolder: []
    }
  }
}
</script>
