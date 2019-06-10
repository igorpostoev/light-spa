<template>
  <div>
  <custom-header></custom-header>
    <div class="container mx-3">
      <ul class="navbar-nav"> 
        <li class="nav-item" ><router-link class="nav-link" to='/home'>Home</router-link></li>
        <li class="nav-item"><router-link class="nav-link" to='/settings'>Settings</router-link></li>
        <li class="nav-item" v-if="admin"><router-link class="nav-link" to='/management'>Users management</router-link></li>
        <li class="nav-item" v-if="admin"><router-link class="nav-link" to='/logs'>Logs</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      'admin': false,
      'username': null
    }
  },
  async created () {
    const curUser = JSON.parse(localStorage.getItem('userData'))
    const path = `/api/users/${curUser.username}`

    this.username = curUser.username
    const res = await this.$axios.get(
      path,
      {'headers': {'X-Auth-Token': curUser.auth_token}}
    )

    if (res.data[0].is_admin) {
      this.admin = true
    }
  }
}
</script>
