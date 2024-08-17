
import {createRouter,createWebHistory}  from 'vue-router'

import LoginCard from './components/LoginCard'
import RegisterCard from './components/RegisterCard'
import Home from './components/HomeMovies'

export default createRouter({
    history:createWebHistory(),
    routes:[{
        path:'/',
        component:LoginCard
    },{
        path:'/register',
        component:RegisterCard
    },{
        path:'/Home',
        component:Home
    }]
})