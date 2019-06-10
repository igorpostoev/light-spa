<template> 
  <transition name="modal">
    <div class="modal" style="display: block">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
            Delete user {{user.username}}
            </h4>
          </div>
          <div class="modal-body">
            Do you want to delete this user?
            <br>
            user id: {{user._id}} 
            <br>
            username: {{user.username}} 
            <br>
            last login at:  {{user.last_login}} 
            <button class="btn btn-lg btn-outline-info btn-block" v-on:click="onDelete(user.username)" type="submit">Yes, delete!</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-info" v-on:click="$emit('close-modal')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </transition> 
</template>

<script>
export default {
  methods: {
    async onDelete (user) {
      const curUser = JSON.parse(localStorage.getItem('userData'))
      const path = `/api/users/${user}`
      const res = await this.$axios.delete(
        path,
        {
          'data': {},
          'method': 'delete',
          'headers': {'X-Auth-Token': curUser.auth_token}
        }
      )

      if (res.status === 200) {
        this.$emit('update-modal')
        this.$emit('close-modal')
        this.$notify({
          'group': 'user-notification',
          'text': 'Deleted!',
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
