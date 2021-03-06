import * as trig from "../libs/math/trigonometry.mjs"

export function addControls() {

  function addDragControls() {

    let radius3 = null
    let dragSpeed = 10
    let startX, startY = null
    let horizontalAngle, verticalAngle = null

    let camera = data.camera
    let target = camera.target
    let position = camera.position

    function start(event) {

      event.preventDefault()
      event.stopPropagation()

      startX = event.pageX
      startY = event.pageY

      let deltaX = Math.abs(position.x - target.x)
      let deltaY = Math.abs(position.y - target.y)
      let deltaZ = Math.abs(position.z - target.z)

      radius3 = position.distanceTo(target)
      let radius2 = trig.side4sides(deltaZ, null, radius3)

      horizontalAngle = trig.angle4sides(radius2, deltaX)
      if (position.x < target.x) { horizontalAngle = 180 - horizontalAngle }
      if (position.y < target.y) { horizontalAngle = -horizontalAngle }

      verticalAngle = trig.angle4sides(radius3, deltaZ)
      if (position.z < target.z) { verticalAngle = 180 - verticalAngle }

      document.onmousemove = drag
      document.onmouseup = stop

    }

    function drag(event) {

      event.preventDefault()
      event.stopPropagation()

      let radius2 = trig.side4sides(Math.abs(position.z - target.z), null, radius3)

      let newHorizontalAngle = horizontalAngle + ((startX - event.pageX) / dragSpeed)
      if (newHorizontalAngle >= 180) { newHorizontalAngle = newHorizontalAngle - 360 }

      let newVerticalAngle = verticalAngle + ((startY - event.pageY) / dragSpeed)
      if (newVerticalAngle <= 0) { newVerticalAngle = 0.000001 } else if (newVerticalAngle >= 180) { newVerticalAngle = -180 - 0.000001 }

      let newX = trig.side4angle(newHorizontalAngle, radius2, true, null) + target.x
      let newY = trig.side4angle(newHorizontalAngle, radius2, null, true) + target.y
      let newZ = trig.side4angle(newVerticalAngle, radius3, true, null) + target.z

      position.set(newX, newY, newZ)
      camera.lookAt(target.x, target.y, target.z)

    }

    function stop(event) {

      event.preventDefault()
      event.stopPropagation()

      document.onmouseup = null
      document.onmousemove = null

    }

    $("#canvas").mousedown(start)

  }

  function addFlyControls() {

    $(document).keydown(function(event) {

      let flySpeed = 1
      let spinSpeed = 1

      let camera = data.camera
      let target = camera.target
      let position = camera.position

      let deltaX = Math.abs(position.x - target.x)
      let deltaY = Math.abs(position.y - target.y)
      let deltaZ = Math.abs(position.z - target.z)

      let radius3 = position.distanceTo(target)
      let radius2 = trig.side4sides(deltaZ, null, radius3)

      let horizontalAngle = trig.angle4sides(radius2, deltaX)
      if (position.x < target.x) { horizontalAngle = 180 - horizontalAngle }
      if (position.y < target.y) { horizontalAngle = -horizontalAngle }

      let verticalAngle = trig.angle4sides(radius3, deltaZ)
      if (position.z < target.z) { verticalAngle = 180 - verticalAngle }

      if (event.keyCode == 38) { // Up

        let inverter = -1
        if (verticalAngle > 90) { verticalAngle = 180 - verticalAngle; inverter = -inverter }

        let radius2 = trig.side4angle(verticalAngle, flySpeed, true, null)

        let stepX = trig.side4angle(horizontalAngle, radius2, true, null) * inverter
        let stepY = trig.side4angle(horizontalAngle, radius2, null, true) * inverter
        let stepZ = trig.side4angle(verticalAngle, flySpeed, null, true)

        position.x += stepX
        position.y += stepY
        position.z += stepZ

        target.x += stepX
        target.y += stepY
        target.z += stepZ

      } else if (event.keyCode == 40) { // Down

        let inverter = -1
        if (verticalAngle > 90) { verticalAngle = 180 - verticalAngle; inverter = -inverter }

        let radius2 = trig.side4angle(verticalAngle, flySpeed, true, null)

        let stepX = trig.side4angle(horizontalAngle, radius2, true, null) * inverter
        let stepY = trig.side4angle(horizontalAngle, radius2, null, true) * inverter
        let stepZ = trig.side4angle(verticalAngle, flySpeed, null, true)

        position.x -= stepX
        position.y -= stepY
        position.z -= stepZ

        target.x -= stepX
        target.y -= stepY
        target.z -= stepZ

      } else if (event.keyCode == 37) { // Left

        let newHorizontalAngle = horizontalAngle + 90
        if (newHorizontalAngle >= 180) { newHorizontalAngle = newHorizontalAngle - 360 }

        let stepX = trig.side4angle(newHorizontalAngle, flySpeed, true, null)
        let stepY = trig.side4angle(newHorizontalAngle, flySpeed, null, true)

        position.x -= stepX
        position.y -= stepY

        target.x -= stepX
        target.y -= stepY

      } else if (event.keyCode == 39) { // Right

        let newHorizontalAngle = horizontalAngle + 90
        if (newHorizontalAngle >= 180) { newHorizontalAngle = newHorizontalAngle - 360 }

        let stepX = trig.side4angle(newHorizontalAngle, flySpeed, true, null)
        let stepY = trig.side4angle(newHorizontalAngle, flySpeed, null, true)

        position.x += stepX
        position.y += stepY

        target.x += stepX
        target.y += stepY

      }

      if (event.keyCode == 87) { // W

        let newVerticalAngle = verticalAngle + spinSpeed
        if (newVerticalAngle <= 0) { newVerticalAngle = 0.000001 } else if (newVerticalAngle >= 180) { newVerticalAngle = -180 - 0.000001 }

        target.z = position.z - trig.side4angle(newVerticalAngle, radius3, true, null)

        radius2 = trig.side4sides(Math.abs(position.z - target.z), null, radius3)

        target.x = position.x - trig.side4angle(horizontalAngle, radius2, true, null)
        target.y = position.y - trig.side4angle(horizontalAngle, radius2, null, true)

      } else if (event.keyCode == 83) { // S

        let newVerticalAngle = verticalAngle - spinSpeed
        if (newVerticalAngle <= 0) { newVerticalAngle = 0.000001 } else if (newVerticalAngle >= 180) { newVerticalAngle = -180 - 0.000001 }

        target.z = position.z - trig.side4angle(newVerticalAngle, radius3, true, null)

        radius2 = trig.side4sides(Math.abs(position.z - target.z), null, radius3)

        target.x = position.x - trig.side4angle(horizontalAngle, radius2, true, null)
        target.y = position.y - trig.side4angle(horizontalAngle, radius2, null, true)

      } else if (event.keyCode == 65) { // A

        let newHorizontalAngle = horizontalAngle + spinSpeed
        if (newHorizontalAngle >= 180) { newHorizontalAngle = newHorizontalAngle - 360 }

        target.x = position.x - trig.side4angle(newHorizontalAngle, radius2, true, null)
        target.y = position.y - trig.side4angle(newHorizontalAngle, radius2, null, true)

      } else if (event.keyCode == 68) { // D

        let newHorizontalAngle = horizontalAngle - spinSpeed
        if (newHorizontalAngle >= 180) { newHorizontalAngle = newHorizontalAngle - 360 }

        target.x = position.x - trig.side4angle(newHorizontalAngle, radius2, true, null)
        target.y = position.y - trig.side4angle(newHorizontalAngle, radius2, null, true)

      }

      camera.lookAt(target.x, target.y, target.z)

    })

  }

  function addZoomControls() {

    $("#canvas").on("wheel", function(event) {

      let zoomMin = 1
      let zoomMax = 500
      let zoomSpeed = 1000
      let zoomDelta = event.originalEvent.wheelDelta / zoomSpeed

      let camera = data.camera
      let target = camera.target
      let position = camera.position

      let stepX = position.x - target.x
      let stepY = position.y - target.y
      let stepZ = position.z - target.z

      // Zoom In
      if (zoomDelta > 0) {
        if (position.distanceTo(target) >= zoomMin) { zoom() }
      }

      // Zoom Out
      else if (zoomDelta < 0) {
        if (position.distanceTo(target) <= zoomMax) { zoom() }
      }

      function zoom() {

        position.x -= stepX * zoomDelta
        position.y -= stepY * zoomDelta
        position.z -= stepZ * zoomDelta

      }

    })

  }

  addDragControls()
  addFlyControls()
  addZoomControls()

}

export function focus(obj, duration=1000, steps=100) {

  let camera = data.camera
  let target = camera.target
  let position = camera.position

  let stepX = (obj.x - target.x) / steps
  let stepY = (obj.y - target.y) / steps
  let stepZ = (obj.z - target.z) / steps

  for (let i = 1; i <= steps; i++) {

    setTimeout(updateCameraTarget, (duration / steps) * i)

  }

  function updateCameraTarget() {

    target.x += stepX
    target.y += stepY
    target.z += stepZ

    camera.lookAt(target.x, target.y, target.z)

  }

}
