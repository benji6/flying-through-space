module.exports = ({changeWarp, changeV}) => document.onkeydown = (e) => {
  switch (e.keyCode) {
    case 27:
      //escape
      return window.location.reload();
    case 37:
    case 65:
      //left
      return changeWarp(-0.0005);
    case 39:
    case 68:
      //right
      return changeWarp(0.0005);
    case 38:
    case 87:
      //up
      return changeV(0.2);
    case 40:
    case 83:
      //right
      return changeV(-0.2);
  }
};
