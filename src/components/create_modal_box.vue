<template> 
  <transition name="modal">
    <div class="modal" style="display: block">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              Create new user
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
            <label>Active</label>
            <br>
            <input type="radio" id="blocked" value="blocked" v-model="status">
            <label>Blocked</label>
            <br>
            <input type="radio" id="blocked" value="not_confirmed" v-model="status">
            <label>Not confirmed</label>
            <br>
            <input type="checkbox" id="inputIsAdmin" v-model="is_admin">
            <label for="inputIsAdmin">Is admin</label>
            <button class="btn btn-lg btn-outline-info btn-block" v-on:click="onCrt" type="submit">Confirm changes</button>
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
     'status': 'not_confirmed',
     'username': null,
     'full_name': null,
     'is_admin': false
    }
  },
  methods: {
    async onCrt () {
      const curUser = JSON.parse(localStorage.getItem('userData'))
      const body = {
        'full_name': this.full_name,
        'username': this.username,
        'status': this.status,
        'password': this.password,
        'is_admin': this.is_admin
      }
      const path = '/api/users'
      const res = await this.$axios.post(
        path,
        body,
        {'headers': {'X-Auth-Token': curUser.auth_token}}
      )

      if (res.status === 201) {
        this.crUser = body
        this.$emit('update-modal')
        this.$notify({
          'group': 'user-notification',
          'text': 'Created!',
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
