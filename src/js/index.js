import 'bootstrap/dist/css/bootstrap.min.css'
import Notifications from 'vue-notification'
import UserAstronaut from '@fortawesome/fontawesome-free-solid/faUserAstronaut'
import Vue from 'vue'
import VueAxiosPlugin from 'vue-axios-plugin'
import VueRouter from 'vue-router'
import customHeader from '../components/header.vue'
import fontawesome from '@fortawesome/fontawesome'
import homePage from '../components/homepage.vue'
import loginPage from '../components/login.vue'
import logsPage from '../components/logs.vue'
import profileSettings from '../components/settings.vue'
import usersManagement from '../components/users_management.vue'

fontawesome.library.add(UserAstronaut)

Vue.use(Notifications)
Vue.use(VueRouter)
Vue.use(VueAxiosPlugin)

Vue.component('custom-header', customHeader)

const routes = [
    {
      'component': loginPage,
      'path': '/login'
    },
    {
      'component': logsPage,
      'path': '/logs'
    },
    {
      'component': homePage,
      'name': 'home',
      'path': '/home'
    },
    {
      'component': profileSettings,
      'name': 'settings',
      'path': '/settings'
    },
    {
      'component': usersManagement,
      'name': 'management',
      'path': '/management'
    }
]
const router = new VueRouter({
  'mode': 'history',
  routes
})

new Vue({router}).$mount('#index');
