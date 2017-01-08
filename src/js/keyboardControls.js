module.exports = ({changeWarp, changeV}) => document.onkeydown = e => {
  switch (e.keyCode) {
    case 27: return location.reload()
    case 37:
    case 65: return changeWarp(-0.0005)
    case 39:
    case 68: return changeWarp(0.0005)
    case 38:
    case 87: return changeV(0.2)
    case 40:
    case 83: return changeV(-0.2)
  }
}
