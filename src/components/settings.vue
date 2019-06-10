<template>
  <div>
    <custom-header></custom-header>
    <div style="display: inline-block;" class="container container mx-3">
      Login: {{user.username}}
      <br>
      Full name: {{user.full_name}}
      <br>
      <div v-if="user.is_admin">
        Password: {{user.password}}
        <br>
        Status: {{user.status}}
      </div>
    </div>
    <br>
    <div style="display: inline-block;" id="frame">
      <input type="login" id="inputLogin" class="form-control" placeholder=" New login" v-model="username">
       <br>
      <input type="login" id="inputLogin" class="form-control" placeholder=" New full name" v-model="full_name">
       <br>
      <div v-if="user.is_admin">
        <input type="login" id="inputPassword" class="form-control" placeholder="New password" v-model="password">
        <br>
        Status:
        <br>
        <input type="radio" id="active" value="active" v-model="status">
        <label for="one">Active</label>
        <br>
        <input type="radio" id="blocked" value="blocked" v-model="status">
        <label for="two">Blocked</label>
        <br>
        <input type="radio" id="blocked" value="not_confirmed" v-model="status">
        <label for="two">Not confirmed</label>
        <br>
        <input type="checkbox" id="inputIsAdmin" v-model="is_admin">
        <label for="inputIsAdmin">Is admin</label>
      </div>
      <button class="btn btn-lg btn-outline-info btn-block" type="submit" v-on:click="confChg">Confirm changes</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      'password': null,
      'status': 'active',
      'is_admin': true,
      'username': null,
      'full_name': null,
      'user': null,
      'token': null
    }
  },

  async created () {
    this.user = JSON.parse(localStorage.getItem('userData'))
    this.token = this.user.auth_token

    const path = `/api/users/${this.user.username}`
    const index = 0

    try {
      const res = await this.$axios.get(
        path,
        {'headers': {'X-Auth-Token': this.token}}
      )

      if (res.status === 200) {
        this.user = res.data[index]
      }

    } catch (err) {
        console.log(err)
    }
 },

  methods: {
    async confChg () {
      const body = {
        'full_name': this.full_name || this.user.full_name,
        'username': this.username || this.user.username,
        'status': this.status || this.user.status,
        'password': this.password || this.user.password,
        'is_admin': this.is_admin
      }
      const path = `/api/users/${this.user.username}`
      const res = await this.$axios.post(
        path,
        body,
        {'headers': {'X-Auth-Token': this.token}}
      )

      if (res.status === 200) {
        this.user = body
        this.$notify({
          'group': 'user-notification',
          'text': 'Ok!',
          'type': 'success'
        })
      } else {
        this.$notify({
          'group': 'user-notification',
          'text': res.data,
          'title': 'Warn!',
          'type': 'error'
        })
      }
    }
  }
}
</script>

<style>
#frame {
  width: 400;  
  position: absolute;
  left: 50%;
  top: 15%;
  margin-right: -50%;
  transform: translate(-50%)
}
</style>
