<style lang="scss">
.page-threemap {
  // margin: 20px 0;
  position: absolute;
  text-align: center;
  /*opacity: 0.2;*/
  width: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
  #name {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
}
</style>

<template>
  <div class="page-threemap">
    <canvas class="canvas" id="canvas" />
    <canvas class="canvas" id="name" />
  </div>
</template>

<script>
import chinaJson from "@/utils/threemap/china.json";
import * as d3geo from "d3-geo";
import { buildLightSystem, buildAuxSystem } from "@/utils/threemap/helpers";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

window.THREE = THREE;

let offCanvas;
let ctxOffCanvas;

let intervalMixins = {
  data() {
    return {
      lastTimeStamp: 10,
      initedShowName: false,
    };
  },
  mounted() {},
  methods: {
    detectTimeStamp(v, gutter = 1000) {
      if (typeof this.lastTimeStamp === "undefined" && v) {
        this.lastTimeStamp = v;
      }
      // console.log(this.lastTimeStamp, typeof this.lastTimeStamp , v)
      if (v > this.lastTimeStamp + gutter) {
        console.log("detectTimeStamps");
        this.lastTimeStamp = v;
        if (!this.initedShowName) {
          this.initedShowName = true;
        }
      }
    },
  },
};

export default {
  mixins: [intervalMixins],
  data() {
    return {
      scene: null, // 场景
      camera: null, // 摄像机
      renderer: null, // 渲染器
      map: null, // 地图容器
    };
  },
  methods: {
    addDatGui() {
      const gui = new dat.GUI();
      let camera = this.camera;
      gui.add(camera.position, "x", -100, 100).step(1);
      gui.add(camera.position, "y", -100, 100).step(1);
      gui.add(camera.position, "z", -100, 100).step(1);
    },
    // 初始化3D环境
    initEnvironment() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);
      // 建一个空对象存放对象
      this.map = new THREE.Object3D();
      // 设置相机参数
      this.setCamera();
      // 初始化
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: document.querySelector("canvas"),
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight - 10);
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
      window.addEventListener("resize", this.onWindowResize, false);
    },
    initMap() {
      // console.log('json', chinaJson)
      // d3-geo转化坐标
      const projection = d3geo
        .geoMercator()
        .center([104.0, 37.5])
        .scale(80)
        .translate([0, 0]);
      // 遍历省份构建模型
      chinaJson.features.forEach((elem) => {
        // 新建一个省份容器：用来存放省份对应的模型和轮廓线
        const province = new THREE.Object3D();
        const coordinates = elem.geometry.coordinates;
        coordinates.forEach((multiPolygon) => {
          multiPolygon.forEach((polygon) => {
            // 这里的坐标要做2次使用：1次用来构建模型，1次用来构建轮廓线
            const shape = new THREE.Shape();
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0xffffff,
            });
            const linGeometry = new THREE.Geometry();
            for (let i = 0; i < polygon.length; i++) {
              const [x, y] = projection(polygon[i]);
              if (i === 0) {
                shape.moveTo(x, -y);
              }
              shape.lineTo(x, -y);
              linGeometry.vertices.push(new THREE.Vector3(x, -y, 4.01));
            }
            const extrudeSettings = {
              depth: 4,
              bevelEnabled: false,
            };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({
              color: "#d13a34",
              transparent: true,
              opacity: 0.6,
            });
            const mesh = new THREE.Mesh(geometry, material);
            const line = new THREE.Line(linGeometry, lineMaterial);
            province.add(mesh);
            province.add(line);
          });
        });
        // 将geojson的properties放到模型中，后面会用到
        province.properties = elem.properties;
        if (elem.properties.centroid) {
          const [x, y] = projection(elem.properties.centroid);
          province.properties._centroid = [x, y];
        }
        this.map.add(province);
      });
      this.scene.add(this.map);
    },
    setCamera() {
      this.camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.set(0, -70, 90);
      this.camera.lookAt(0, 0, 0);
    },
    // 显示名称
    showName() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let canvas = document.querySelector("#name");
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      // 新建一个离屏canvas
      offCanvas = document.createElement("canvas");
      offCanvas.width = width;
      offCanvas.height = height;
      ctxOffCanvas = offCanvas.getContext("2d");
      // 设置canvas字体样式
      ctxOffCanvas.font = "16.5px Arial";
      ctxOffCanvas.strokeStyle = "#FFFFFF";
      ctxOffCanvas.fillStyle = "#000000";
      // console.log(offCanvas)
      // texts用来存储显示的名称，重叠的部分就不会放到里面
      const texts = [];
      /**
       * 遍历省份数据，有2个核心功能
       * 1. 将3维坐标转化成2维坐标
       * 2. 后面遍历到的数据，要和前面的数据做碰撞对比，重叠的就不绘制
       * */
      this.map.children.forEach((elem, index) => {
        if (!elem.properties._centroid) return;
        // 找到中心点
        const y = -elem.properties._centroid[1];
        const x = elem.properties._centroid[0];
        const z = 4;
        // 转化为二维坐标
        const vector = new THREE.Vector3(x, y, z);
        const position = vector.project(this.camera);
        // 构建文本的基本属性：名称，left, top, width, height -> 碰撞对比需要这些坐标数据
        const name = elem.properties.name;
        const left = ((vector.x + 1) / 2) * width;
        const top = (-(vector.y - 1) / 2) * height;
        const text = {
          name,
          left,
          top,
          width: ctxOffCanvas.measureText(name).width,
          height: 16.5,
        };
        // 碰撞对比
        let show = true;
        for (let i = 0; i < texts.length; i++) {
          if (
            text.left + text.width < texts[i].left ||
            text.top + text.height < texts[i].top ||
            texts[i].left + texts[i].width < text.left ||
            texts[i].top + texts[i].height < text.top
          ) {
            show = true;
          } else {
            show = false;
            break;
          }
        }
        if (show) {
          texts.push(text);
          ctxOffCanvas.strokeText(name, left, top);
          ctxOffCanvas.fillText(name, left, top);
        }
      });
      // 离屏canvas绘制到canvas中
      ctx.drawImage(offCanvas, 0, 0);
    },
    // 根据浏览器窗口变化动态更新尺寸
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove(event) {
      event.preventDefault();
    },
    // 动画循环
    loop(timestamp) {
      this.detectTimeStamp(timestamp);
      if (this.initedShowName) {
        this.initedShowName = false;
        this.showName();
      }
      this.render();
      requestAnimationFrame(this.loop);
    },
    // 渲染画布
    render() {
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    // 初始化3D环境
    this.initEnvironment();
    // tigon debug
    this.addDatGui();
    // 构建光照系统
    buildLightSystem(this.scene);
    // 构建辅助系统
    // buildAuxSystem(this.scene)
    // let controls = new OrbitControls(this.camera, this.renderer.domElement)
    // controls.enableDamping = true
    // controls.dampingFactor = 0.25
    // controls.rotateSpeed = 0.35
    this.initMap();

    this.loop();
  },
};
</script>
