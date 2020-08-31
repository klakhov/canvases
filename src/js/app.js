// import Canvas from './StarCanvas/Canvas';

// function start() {
//   const canvas = new Canvas('container', 'Hello world');
//   setInterval(() => {
//     if (canvas.displayed) canvas.createStar();
//   }, 1000);
// }

import Canvas from './BubbleCanvas/Canvas';


function start(){
  const canvas = new Canvas('container', {width: 300, height: 600});
  setInterval(() => {
    if (canvas.displayed) canvas.createBubble();
  }, 1000);
}

start();
