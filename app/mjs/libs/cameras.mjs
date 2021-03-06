export function addCamera(position=data.scale) {

  let camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000)

  camera.up.set(0, 0, 1)
  camera.position.set(position, position, position)

  camera.target = {"x": 0, "y": 0, "z": 0}
  camera.lookAt(camera.target.x, camera.target.y, camera.target.z)

  data.camera = camera

  return camera

}
