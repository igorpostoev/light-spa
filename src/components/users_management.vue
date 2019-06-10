<template>
  <div>
    <custom-header></custom-header>
    <br>
    <button class="btn btn-lg btn-outline-info btn-block" v-on:click="onShowModalCrt" type="submit"  style="margin:auto;width: 400px;">AddUser</button>
    <br>
    <modal-update v-if="showModalUpd" v-on:close-modal="onCloseModal" v-on:update-modal="onUpdateModal" v-bind:user="userToManage"></modal-update>
    <modal-delete v-if="showModalDel" v-on:close-modal="onCloseModal" v-on:update-modal="onUpdateModal" v-bind:user="userToDelete"></modal-delete>
    <modal-create v-if="showModalCrt" v-on:close-modal="onCloseModal" v-on:update-modal="onUpdateModal"></modal-create>
    <table class="table table-striped table-bordered" style="max-width: 90%;margin: auto;">
      <thead>
        <tr style="text-align: center">
          <th>id</th>
          <th>username</th>
          <th>status</th>
          <th>full_name</th>
          <th>last_login</th>
          <th>manage</th>
        </tr>
      </thead>
      <tbody>
        <user-data v-on:open-modal="onShowModalUpd($event)" v-on:delete-user="onShowModalDel($event)" v-for="user in users" v-bind:user="user" v-bind:key="user._id"></user-data>
      </tbody>
    </table>
  </div>
</template>

<script>
import modalCreate from '../components/create_modal_box.vue'
import modalDelete from '../components/delete_modal_box.vue'
import modalUpdate from '../components/manage_modal_box.vue'
import userData from '../components/user_data.vue'

export default {
  data() {
    return {
      'users': null,
      'showModalUpd': false,
      'showModalDel': false,
      'showModalCrt': false,
      'userToManage': null,
      'userTodelete': null
    }
  },
  created () {
    this.onUpdateModal()
  },
  methods: {
    onShowModalUpd (user) {
      this.showModalUpd = true
      this.userToManage = user
    },
    onShowModalDel (user) {
      this.showModalDel = true
      this.userToDelete = user
    },
    onCloseModal () {
      this.showModalUpd = false
      this.showModalDel = false
      this.showModalCrt = false
    },
    async onUpdateModal () {
      const curUser = JSON.parse(localStorage.getItem('userData'))
      const path = '/api/users'
      const res = await this.$axios.get(
        path,
        {'headers': {'X-Auth-Token': curUser.auth_token}}
      )

      this.users = res.data
    },
    onShowModalCrt () {
      this.showModalCrt = true
    }
  },
  components: {
    userData,
    modalCreate,
    modalDelete,
    modalUpdate
  }
}
</script>
