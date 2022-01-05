import Vue from 'vue'
import Router from 'vue-router'

import store from '../store.js'
import loginView from '../views/LoginView.vue'
import homeView from '../views/HomeView.vue'
import inquilinoView from '../views/InquilinoView.vue'
import imovelView from '../views/ImovelView.vue'
import movimentacaoMensalView from '../views/MovimentacaoMensalView.vue'

Vue.use(Router)

const routes = [
    {
        path: '/login',
        name: 'loginView',
        component: loginView
    },
    {
        path: '/home',
        name: 'homeView',
        component: homeView
    },
    {
        path: '/imovel',
        name: 'imovelView',
        component: imovelView
    },
    {
        path: '/inquilino',
        name: 'inquilinoView',
        component: inquilinoView
    },
    {
        path: '/movimentacaoMensal',
        name: 'movimentacaoMensalView',
        component: movimentacaoMensalView
    }
]

//
const RotasApp = new Router({routes})


RotasApp.beforeEach((to, from, next) => {
    //console.log("from", from.path)
    //console.log("to", to.path)
    //console.log(`from => ${from.path}, to => ${to.path},  estaLogado => ${store.getters.estaLogado}`)

/*     if (to.path == '/')
        next()
    else { */
        if (!store.getters.estaLogado) {
            if ((to.path == '/trocaSenha') || (to.path=='/registraUsuario')) {
                next()
            } else if (to.path != '/login') 
                next('/login') 
            else
                next()
        } else {
            next()
        }
/*     } */
    
  })

export default RotasApp