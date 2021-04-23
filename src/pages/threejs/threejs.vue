<style lang="scss">
.page-threejs {
  position: absolute;
  width: 100%;
  .canvas {
    display: block;
    margin: auto;
  }
}
</style>

<template>
  <div class="page-threejs">
    <el-button type="grd" size="small" @click="openDialog1 = true"
               style="--grd-btn-width: 90px; --grd-btn-height: 30px;"
    >打开dialog1</el-button>

    <simple-dialog :open="openDialog1" @closed="openDialog1 = false">
      <div style="width: 600px; height: 300px;">sdsds</div>
    </simple-dialog>

    <canvas class="canvas" ref="canvas" />
  </div>
</template>

<script>
import * as THREE from "three";
import {DemoMeshPhongMaterial} from "@/threejs/demo1";

window.THREE = THREE;

export default {
  data() {
    return {
      openDialog1: false
    }
  },
  mounted() {
    DemoMeshPhongMaterial(THREE, this)
  }
}
</script>
