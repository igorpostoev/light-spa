<template> 
  <transition name="modal">
    <div class="modal" style="display: block">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              Edit {{edUser.username}} profile
            </h4>
          </div>
          <div class="modal-body">
            <input type="login" id="inputLogin" class="form-control" placeholder="New login" required autofocus v-model="username">
            <br>
            <input type="login" id="inputLogin" class="form-control" placeholder="New full name" required autofocus v-model="full_name">
            <br>
            <input type="login" id="inputPassword" class="form-control" placeholder="New password" required autofocus v-model="password">
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
            <input type="checkbox" id="inputIsAdmin" v-model="is_admin" checked>
            <label for="inputIsAdmin">Is admin</label>
            <button class="btn btn-lg btn-outline-info btn-block" v-on:click="onChg" type="submit">Confirm changes</button>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn btn-outline-info" v-on:click="$emit('close-modal')">Close </button>
          </div>
        </div>
      </div>
    </div>
  </transition> 
</template>

<script>
export default {
  data () {
    return {
      'password': null,
      'status': 'active',
      'username': null,
      'full_name': null,
      'is_admin': true,
      'edUser': null
    }
  },
  created () {
    this.edUser = this.user
  },
  methods: {
    async onChg () {
      const curUser = JSON.parse(localStorage.getItem('userData'))
      const body = {
        'full_name': this.full_name || this.edUser.full_name,
        'username': this.username || this.edUser.username,
        'status': this.status || this.edUser.status,
        'password': this.password || this.edUser.password,
        'is_admin': this.is_admin
      }
      const path = `/api/users/${this.edUser.username}`
      const res = await this.$axios.post(
        path,
        body,
        {'headers': {'X-Auth-Token': curUser.auth_token}}
      )

      if (res.status === 200) {
        this.edUser = body
        this.$emit('update-modal')
        this.$notify({
          'group': 'user-notification',
          'text': 'Changed!',
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
  },
  props: ['user']
}
</script>
