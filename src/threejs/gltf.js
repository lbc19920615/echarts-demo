import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const DECODER_PATH = 'https://unpkg.com/three@0.125.2/examples/js/libs/draco/'


import './gltf-modelviewer'


class GLTFModelViewer {
  constructor({ canvas = null, src = '' } = {}) {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.frame = -1;
    this.render = this.render.bind(this);
    this.dragging = false;
    this.canvas = canvas
    this.src = src
  }

  get isInitialized() {
    return Boolean(this.scene && this.controls && this.camera)
  }

  connectedCallback() {
    if (!this.renderer) {
      this.setup();
    }
  }

  disconnectedCallback() {
    this.dispose();
  }

  setup() {
    let canvas = this.canvas

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer = renderer;
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspectRatio,
      near,
      far
    );
    camera.position.set(0, 10, 20);
    this.camera = camera;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    this.controls = controls;

    const scene = new THREE.Scene();
    this.scene = scene;

    this.initScene();

    this.frame = requestAnimationFrame(this.render);
  }

  initScene() {
    this.setupLight();
    this.loadModel();
  }

  setupLight() {
    const { scene } = this;
    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 1;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(5, 10, 2);
      scene.add(light);
      scene.add(light.target);
    }
  }

  createPlane() {
    const { scene } = this;
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/textures/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  loadModel() {
    const { controls, scene, camera, canvas } = this;
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DECODER_PATH);
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      this.src,
      (gltf) => {
        const root = gltf.scene;
        scene.add(root);
        this.model = root;
        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        this.frameArea(boxSize, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();
        canvas.classList.remove('loading');
      }
    );
  }

  /**
   * Arrange the camera so the object fits in the canvas
   * @param {*} sizeToFitOnScreen
   * @param {*} boxSize
   * @param {*} boxCenter
   */
  frameArea(sizeToFitOnScreen, boxSize, boxCenter) {
    const { camera } = this;
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 2, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  /**
   * Clean up the scene materials, meshes, geometries, textures
   */
  cleanupScene(groupOrScene = null) {
    if (groupOrScene === null) {
      groupOrScene = this.scene;
    }
    const items = [...groupOrScene.children];
    for (let item of items) {
      if (item.children && item.children.length > 0) {
        this.cleanupScene(item);
      }
      const { geometry, material, texture } = item;
      if (geometry) {
        geometry.dispose();
      }
      if (material) {
        material.dispose();
      }
      if (texture) {
        texture.dispose();
      }
      if (typeof item.dispose === 'function') {
        item.dispose();
      }
      groupOrScene.remove(item);
    }
  }

  dispose() {
    this.cleanupScene();
    window.removeEventListener('resize', this.onResize, false);
    if (this.frame > -1) {
      cancelAnimationFrame(this.frame);
      this.frame = -1;
    }
    const context = this.renderer.getContext();
    this.renderer.dispose();
    const loseCtx = context.getExtension('WEBGL_lose_context');
    if (loseCtx && typeof loseCtx.loseContext === 'function') {
      loseCtx.loseContext();
    }
    this.removeChild(this.canvas);
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
  }

  setSize([clientWidth, clientHeight = clientWidth] = []) {
    console.log(clientWidth, clientHeight)
    const { renderer, camera } = this;
    camera.aspect = clientWidth / clientHeight;
    renderer.setSize(clientWidth, clientHeight);
  }

  render() {
    const { renderer, scene, camera } = this;
    this.controls.update();
    renderer.render(scene, camera);
    this.frame = requestAnimationFrame(this.render);
  }
}

export function DemoGltf1(THREE, context) {
  let myGLTFModelViewer = new GLTFModelViewer({
    canvas: context.$refs.canvas
    ,src: 'https://terabaud.github.io/blender-experimenting/leas-donut.glb'
  });
  // console.log(myGLTFModelViewer)

  myGLTFModelViewer.connectedCallback()
  myGLTFModelViewer.setSize([1024, 768])
}
