<template>
  <tr style="text-align: center">
    <td> {{user._id}} </td>
    <td> {{user.username}} </td>
    <td> {{user.status}} </td>
    <td> {{user.full_name}} </td>
    <td> {{user.last_login_at}} </td>
    <td> 
      <button class="btn btn-outline-info" style="width:100px;margin: 5px"  v-on:click="$emit('open-modal', user)">Edit</button> 
      <button class="btn btn-outline-info" style="width:100px;margin: 5px"  v-on:click="$emit('delete-user', user)">Delete</button>
    </td>
  </tr>
</template>

<script>
export default {props: ['user']}
</script>
