<template>
  <div>
    <custom-header></custom-header>
    <br>
    <table class="table table-striped table-bordered" style="max-width: 90%;margin: auto;">
      <thead>
        <tr style="text-align: center">
          <th>ip</th>
          <th>username</th>
          <th>token_id</th>
          <th>user_agent</th>
          <th>login_at</th>
        </tr>
      </thead>
      <tbody>
        <log-data  v-for="user in users" v-bind:user="user" v-bind:key="user._id"></log-data>
      </tbody>
    </table>
  </div>
</template>

<script>
import logData from '../components/logs_data.vue'

export default {
  data () {
    return {'users': null}
  },
  async created () {
    const curUser = JSON.parse(localStorage.getItem('userData'))
    const path = '/api/logs'
    const res = await this.$axios.get(
          path,
          {'headers': {'X-Auth-Token': curUser.auth_token}}
        )

        this.users = res.data
  },
  components: {logData}
}
</script>