<template>
  <div class="emptest">
    <h1>Your top match from default search 'pretty' is: {{ matches }}</h1>
    <!--li v-for="match in matches[0]">@{{ match._id }}</li-->
    <input type="text" v-model="input.search" placeholder="Search" />
    <!--input type="text" v-model="input.lastname" placeholder="Last Name" /-->
    <button v-on:click="sendData()">Send</button>
    <br />
    <br />
    <h1>The top search result from your input is: {{ searchResult }}</h1>
  </div>
</template>

<!--script>
  import axios from "axios"

  export default {
    name: 'EmpTest',
    data () {
      return {
        matches: "",
        input: {
          firstname: "",
          lastname: ""
        },
        response: ""
      }
    },
    mounted() {
      axios({ method: 'GET', 'url': 'https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp2/_search?q=*&pretty' }).then(result => {
        this.matches = result.hits.hits._id
      }, error => {
        console.error(error)
      })
    },
    methods: {
      sendData() {
        axios({ method: 'POST', 'url': 'https://httpbin.org/post', 'data': this.input, 'headers': { 'content-type': 'application/json' } }).then(result => {
          this.response = result.data
        }, error => {
          console.error(error)
        })
      }
    }
  }
</script-->

<script>
export default {
  name: 'EmpTest',
  data () {
    return {
      matches: '',
      searchResult: '',
      input: {
        search: ''
      },
      response: ''
    }
  },
  mounted () {
    this.$http.get('https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp2/_search?q=*&pretty').then(result => {
      this.matches = result.body.hits.hits[0]._id
    }, error => {
      console.error(error)
    })
  },
  methods: {
    sendData () {
      // This part doesn't work yet !!!
      this.$http.get('https://search-emp-cixk22lczi5yrt4zd2dhswnltm.us-east-1.es.amazonaws.com/emp2/_search?q=*&' + this.input.search).then(result => {
        this.searchResult = result.body.hits.hits[0]._id
      }, error => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  textarea {
    width: 600px;
    height: 200px;
  }
</style>
