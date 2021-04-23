<style lang="scss">
.page-threejs {
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>

<template>
  <div class="page-threejs">
    <simple-dialog open>
      <div>sdsds</div>
    </simple-dialog>

    <canvas class="canvas" ref="canvas" />
  </div>
</template>

<script>
import * as THREE from "three";
import {DemoMeshPhongMaterial} from "@/threejs/demo1";

window.THREE = THREE;

export default {
  mounted() {
    DemoMeshPhongMaterial(THREE)
  }
}
</script>
