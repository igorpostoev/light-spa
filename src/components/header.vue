<template>
  <div class="navbar navbar-light bg-light h-10" > 
    <div class="nav navbar-nav navbar-left">   
    </div>
    <div class="nav navbar-nav navbar-center">   
        Last login:  {{lastLoginAt}} 
    </div> 
    <div>
      <font-awesome-icon style="display: inline-block" icon="user-astronaut"/>  
      <div style="display: inline-block">{{username}}</div>
      <button v-on:click="onExit" class="btn btn-outline-info">Exit</button> 
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import moment from 'moment'

export default {
  data () {
    return {
      'username': null,
      'lastLoginAt': null
    }
  },
  created () {
    const user = JSON.parse(localStorage.getItem('userData'))
    const date = moment(user.last_login_at)

    this.username = user.username
    this.lastLoginAt = date.fromNow()
  },
  components: {FontAwesomeIcon},
  methods: {
    onExit () {
      localStorage.clear()
      this.$router.push({path: '/login'})
    }
  }
}
</script>

<style>
.navbar-center {
    position: absolute;
    left: 50%;
    transform: translatex(-50%);
}
</style>
