<template>
  <div class="fui-app" id="app">
<!--    <div>-->
<!--      <router-link-->
<!--          v-for="(route, index) in routes"-->
<!--          :key="index"-->
<!--          :to="route.path">{{route.meta.title}}</router-link>-->
<!--    </div>-->
    <router-view></router-view>
  </div>
</template>

<script>
import { routes } from './router'

export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      routes: routes.filter(v => {
        return v.path !== '*'
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {

}
</style>
