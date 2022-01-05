<template>
   <v-app>
      <AppBar v-if="$store.getters.loginFinalizado" 
            :titulo="$store.getters.nomeSistema" 
            :urlLogo="urlLogo"
            :temBotaoMenu="true" :temBotaoSair="true"/>
      <v-main>
          <v-container grid-list-md class="pa-0" style="max-width: 600px;">
            <UserBar v-if="$store.getters.userBarAtivo"/>
            <transition appear name="slide" mode="out-in">
              <Router-view/>
            </transition>
          </v-container>
      </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import UserBar from './components/UserBar';

export default {
  name: 'App', 
  components: { AppBar, UserBar}, 
  data(){
    return {
      titulo: 'Painel Saúde',
      urlLogo: './assets/logo.png'
    }
  }
};
</script>
<style scoped>
  .slide-leave-active{
    transition: 0s;
  }
  .slide-enter-active {
    transition: 0.3s;
  }
  .slide-enter {
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    transform: translate(-100%, 0);
  }
  .v-app {
    max-width:600px;
    margin: 0 auto;
  }
</style>
