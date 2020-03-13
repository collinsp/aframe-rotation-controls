AFRAME.registerComponent('rotation-controls', {
  schema: {
    deadZone: { type: 'number', default: .2 },
    rotationStep: { type: 'number', default: .5 },
    scaleStep: { type: 'number', default: .02 },
    scaleMin: { type: 'number', default: .01 },
    scaleMax: { type: 'number', default: 200 },
    scaleTarget: { type: 'selector' }
  },

  init: function(){
    this.deadZone = this.data.deadZone
    this.deadZoneNeg = this.data.deadZone * -1
    this.leftPadIdx = this.rightPadIdx = undefined
    this.leftX = this.leftY = this.rightX = this.rightY = 0

    window.addEventListener('gamepadconnected', e => {
      const gp = navigator.getGamepads()[e.gamepad.index]
      // console.log('gamepad[', e.gamepad.index, '] ', gp.id, 'connected')
      if (/Right/.test(gp.id) && gp.axes.length==2) {
        this.rightPadIdx = e.gamepad.index
      } else if (/Left/.test(gp.id) && gp.axes.length==2) {
        this.leftPadIdx = e.gamepad.index
      }
    })
  },

  tick: function(_, timeDelta) {
    const gamepads = navigator.getGamepads()

    // process right touch controller input
    if (this.rightPadIdx >= 0) {
      const gp = gamepads[this.rightPadIdx]
      if (gp) {
        let [x, y] = gp.axes
        if (x > this.deadZoneNeg && x < this.deadZone) x = 0
        if (y > this.deadZoneNeg && y < this.deadZone) y = 0

        if (this.rightX == 0 && x > 0) {
          //console.log('pressed right on right controller', x)
          this.rightX = x
          this.el.object3D.rotation.y -= this.data.rotationStep
        } else if (this.rightX == 0 && x < 0) {
          //console.log('pressed left on right controller', x)
          this.rightX = x
          this.el.object3D.rotation.y += this.data.rotationStep
        } else if (this.rightX != 0 && x == 0) {
          //console.log('released left/right on right controller')
          this.rightX = 0
        }

        if (this.rightY == 0 && y > 0) {
          //console.log('pressed down on right controller', y)
          this.rightY = y

          if (this.data.scaleTarget) {
            const newScale = this.data.scaleTarget.object3D.scale.x - this.data.scaleStep
            if (newScale < this.data.ScaleMin) newScale = this.data.scaleMin
            this.data.scaleTarget.object3D.scale.x = newScale
            this.data.scaleTarget.object3D.scale.y = newScale
            this.data.scaleTarget.object3D.scale.z = newScale
          }

        } else if (this.rightY == 0 && y < 0) {
          //console.log('pressed up on right controller', y)

          if (this.data.scaleTarget) {
            const newScale = this.data.scaleTarget.object3D.scale.x + this.data.scaleStep
            if (newScale > this.data.ScaleMax) newScale = this.data.scaleMax
            this.data.scaleTarget.object3D.scale.x = newScale
            this.data.scaleTarget.object3D.scale.y = newScale
            this.data.scaleTarget.object3D.scale.z = newScale
          }

          this.rightY = y
        } else if (this.rightY != 0 && y == 0) {
          //console.log('released up/down on right controller')
          this.rightY = 0
        }
      }
    }

    // process left touch controller input
/*
    if (this.leftPadIdx >= 0) {
      const gp = gamepads[this.leftPadIdx]
      if (gp) {
        let [x, y] = gp.axes
        if (x > this.deadZoneNeg && x < this.deadZone) x = 0
        if (y > this.deadZoneNeg && y < this.deadZone) y = 0

        if (x > 0) {
          console.log('pressed right on left controller', x)
          this.el.object3D.position.x += (timeDelta * .01 * this.data.speed)
          this.leftX = x
        } else if (x < 0) {
          console.log('pressed left on left controller', x)
          this.el.object3D.position.x -= (timeDelta * .01 * this.data.speed)
          this.leftX = x
        } else if (this.leftX != 0 && x == 0) {
          console.log('released left/right on left controller')
          this.leftX = 0
        }

        if (y > 0) {
          console.log('pressed down on left controller', y)
          const direction = new THREE.Vector3()
          this.data.moveDirectionTarget.object3D.getWorldDirection(direction)
          this.el.object3D.position.add(direction.multiplyScalar(timeDelta * .01 * this.data.speed))
          this.leftY = y
        } else if (y < 0) {
          console.log('pressed up on left controller', y)
          const direction = new THREE.Vector3()
          this.data.moveDirectionTarget.object3D.getWorldDirection(direction)
          this.el.object3D.position.add(direction.multiplyScalar(timeDelta * -.01 * this.data.speed))
          this.leftY = y
        } else if (this.leftY != 0 && y == 0) {
          console.log('released up/down on left controller')
          this.leftY = 0
        }
      }
    }
*/
  }
})
