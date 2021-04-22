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

window.THREE = THREE;

export default {
  mounted() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, 1024/768, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.$refs.canvas
    });

  renderer.setSize(1024, 768);

/* Create Lights: PointLight / SpotLight etc.*/
/* Create Lights: PointLight / SpotLight etc.*/
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(100,100,100);
spotLight.castShadow = true; //If set to true light will cast dynamic shadows. Warning: This is expensive and requires tweaking to get shadows looking right.
spotLight.shadowMapWidth = 1024;
spotLight.shadowMapHeight = 1024;
spotLight.shadowCameraNear = 500;
spotLight.shadowCameraFar = 4000;
spotLight.shadowCameraFov = 30;
scene.add(spotLight);

/* Create Material */
function Mat(){
  var material = new THREE.MeshPhongMaterial({
    color      : new THREE.Color("rgb(35,35,213)"),  //Diffuse color of the material
    emissive   : new THREE.Color("rgb(64,128,255)"), //Emissive(light) color of the material, essentially a solid color unaffected by other lighting. Default is black.
    specular   : new THREE.Color("rgb(93,195,255)"), /*Specular color of the material, i.e., how shiny the material is and the color of its shine. 
                                                       Setting this the same color as the diffuse value (times some intensity) makes the material more metallic-looking; 
                                                       setting this to some gray makes the material look more plastic. Default is dark gray.*/
    shininess  : 1,                                  //How shiny the specular highlight is; a higher value gives a sharper highlight. Default is 30.
    shading    : THREE.FlatShading,                  //How the triangles of a curved surface are rendered: THREE.SmoothShading, THREE.FlatShading, THREE.NoShading
    wireframe  : 1,                                  //THREE.Math.randInt(0,1)
    transparent: 1,
    opacity    : 0.15                                //THREE.Math.randFloat(0,1) 
  });
  return material;
}

/* Create Geometry */
var geometry = new THREE.SphereGeometry(50,20,20,0,Math.PI*2,0,Math.PI);
//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)

/* Create Earth Sphere*/
var earth = new THREE.Mesh(geometry, Mat());

/*
var numSphere = 30;
var tabSphere = [];
for(var i=0: i<numSphere; i++){
  tabShpere.push(new Sphere(i));
  scene.add(tabSphere[i].b);
}
*/

scene.add(earth);

camera.position.z = 90;

/*
  This will create a loop that causes the renderer to draw the scene 60 times per second. 
  If you're new to writing games in the browser, you might say "why don't we just create a setInterval? 
  The thing is - we could, but requestAnimationFrame has a number of advantages. 
  Perhaps the most important one is that it pauses when the user navigates to another browser tab, hence not wasting their precious processing power and battery life.
*/
function render(){
  requestAnimationFrame(render);
  // earth.rotation.x += 0.01;
  // earth.rotation.y += 0.01;
  renderer.render(scene, camera);
}
render();

  }

  
}
</script>