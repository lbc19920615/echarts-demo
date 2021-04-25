export function createThreejsCommon(THREE, { canvas } = {}) {
  const size = [ 1024, 768 ]

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, size[0] / size[1], 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
  });

  renderer.setSize(size[0], size[1]);

  return {
    scene,
    camera,
    renderer
  }
}
