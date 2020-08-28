import Canvas from './classes/Canvas';

function start() {
  const canvas = new Canvas('container', 'Hello world');
  setInterval(() => {
    if (canvas.displayed) canvas.createStar();
  }, 1000);
}

start();
