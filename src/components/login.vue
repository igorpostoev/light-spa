<template>
    <div>
      <notifications/>
      <div class="container" id="frame" >
        <form class="form-signin" action="javascript:void(0);"> 
          <h2 class="form-signin-heading">Please sign in</h2>
          <label for="inputEmail" class="sr-only">Login</label>
          <input type="login" id="inputLogin" class="form-control" placeholder="Login" required autofocus v-model="username">
          <br>
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="password">
          <br>
          <div class="checkbox">
            <label>
              <input type="checkbox" value="remember-me"> Remember me
            </label>
          </div>
          <button class="btn btn-lg btn-outline-info btn-block" type="submit" v-on:click="logIn">Sign in</button>
        </form>
      </div> 
    </div>
</template>

<script>
export default {
  data() {
    return {
      'password': null,
      'username': null
    }
  },
  methods: {
    async logIn() {
      let res = null
      const body = {
        'password': this.password,
        'username': this.username
      }

      try {
        res = await this.$axios.post('api/login', body)
        if (res.status === 200) {
          localStorage.setItem('userData', JSON.stringify(res.data))
          this.$router.push({path: '/home'})
        } else {
          this.$notify({
            'text': res.data,
            'title': 'Warn!',
            'type': 'error'
          })
        }
      } catch (err) {
          console.log(err)
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
  top: 10%;
  margin-right: -50%;
  transform: translate(-50%)
}
</style>
