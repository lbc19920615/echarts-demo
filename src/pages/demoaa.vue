

<template>
  <div>
    <al-echart :beforeRender="beforeRender"></al-echart>
  </div>
</template>

<script>
import AlEchart from "@/components/alEchart";
export default {
name: "demoaa",
  components: {AlEchart},
  data() {
    return {
    }
  },
  methods: {
    beforeRender() {
      return {}
    }
  }
}
</script>

<style scoped>

</style>
