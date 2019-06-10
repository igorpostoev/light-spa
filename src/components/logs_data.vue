<template>
  <tr style="text-align: center">
    <td> {{user.ip}} </td>
    <td> {{user.username}} </td>
    <td> {{user.token_id}} </td>
    <td> {{user.user_agent}} </td>
    <td> {{user.login_at}} </td>
  </tr>
</template>

<script>
export default {props: ['user']}
</script>
