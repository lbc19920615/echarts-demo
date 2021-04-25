<style lang="scss">
.page-threejs {
  position: absolute;
  width: 100%;
  .canvas {
    display: block;
    margin: auto;
  }

  gltf-modelviewer {
    display: block;
    width: 100vw;
    height: 100vh;
  }

  gltf-modelviewer canvas {
    width: 100%;
    height: 100%;
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

    <div>
      <el-button size="small"
                 v-for="ThreejsDemosKey in ThreejsDemosKeys"
                 @click="switchCanvas(ThreejsDemosKey)"
                 style="--grd-btn-width: 90px; --grd-btn-height: 30px;"
      >{{ThreejsDemosKey}}</el-button>
    </div>

    <gltf-modelviewer
        role="img" aria-label="It's a donut" src="https://terabaud.github.io/blender-experimenting/leas-donut.glb" autorotate></gltf-modelviewer>

    <canvas class="canvas"
            v-if="resetCanvas"
            ref="canvas" />
  </div>
</template>

<script>
import * as THREE from "three";
import * as ThreejsDemos from '@/threejs/index'


window.THREE = THREE;

export default {
  data() {
    return {
      openDialog1: false,
      resetCanvas: false,
      ThreejsDemosKeys: Object.keys(ThreejsDemos)
    }
  },
  mounted() {
    // DemoMeshPhongMaterial(THREE, this)
    this.resetCanvas = true
    setTimeout(() => {
      ThreejsDemos.DemoGltf1(THREE, this)
    }, 30)
  },
   methods: {
     switchCanvas(name) {
       let self = this
       self.resetCanvas = false
       self.$nextTick(() => {
         self.resetCanvas = true
         setTimeout(() => {
           ThreejsDemos[name](THREE, self)
         }, 30)
       })
     }
   }
}
</script>
