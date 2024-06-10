import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import GymRegistration from '@/components/GymRegistration'
import Login from '@/components/Login'
import Register from '@/components/Register'
import CreateSession from '@/components/CreateSession'
import SessionsStaffView from '@/components/SessionsStaffView'
import SessionsClientView from '@/components/SessionsClientView'
import Accounts from '@/components/Accounts'
import ClassTypes from '@/components/ClassTypes'
import EditSession from '@/components/EditSession'
import AccountDetails from '@/components/AccountDetails'
import CustomerRegistrationsView from '../components/CustomerRegistrationsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/app',
      name: 'GymRegistration',
      component: GymRegistration
    },
    {
      path: '/class-types',
      name: 'ClassTypes',
      component: ClassTypes
    },
    {
      path: '/login',
      name: 'LogIn',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/create-session', 
      name: 'CreateSession',
      component: CreateSession
    },
    {
      path: '/view-session-staff', 
      name: 'SessionsStaffview',
      component: SessionsStaffView
    },
    {
      path: '/view-session-client', 
      name: 'SessionsClientview',
      component: SessionsClientView
    },
    {
      path: '/accounts', 
      name: 'Accounts',
      component: Accounts
    },
    {
      path: '/edit-session', 
      name: 'EditSession',
      component: EditSession,
      props: true
    },
    {
      path: '/account-details',
      name: 'AccountDetails',
      component: AccountDetails
    },
    {
      path: '/customer-registrations',
      name: 'CustomerRegistrationsView',
      component: CustomerRegistrationsView
    }
  ]
})
