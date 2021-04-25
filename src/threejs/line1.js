import {createThreejsCommon} from "@/threejs/common";

export function DemoLine1(THREE, context) {
  let { scene, camera, renderer } = createThreejsCommon(THREE, {
    canvas: context.$refs.canvas
  })

  camera.position.set( 0, 0, 100 );
  camera.lookAt( 0, 0, 0 );

  //create a blue LineBasicMaterial
  const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

  const points = [];
  points.push( new THREE.Vector3( - 10, 0, 0 ) );
  points.push( new THREE.Vector3( 0, 10, 0 ) );
  points.push( new THREE.Vector3( 10, 0, 0 ) );

  const geometry = new THREE.BufferGeometry().setFromPoints( points );

  const line = new THREE.Line( geometry, material );

  scene.add( line );
  renderer.render( scene, camera );
  console.log(
    line
  )
}
