<template>
  <div id="app">
    <china-map ref="map"></china-map>
  </div>
</template>

<script>


import ChinaMap from "@/components/chinaMap";
export default {
  name: 'app',
  components: {
    ChinaMap

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
