import Konva from 'konva';
import Bubble from './Bubble';
import random from 'random';

export default class Canvas {
  constructor(id, dimensions) {
    this.width = dimensions.width;
    this.height = dimensions.height;

    this.stage = new Konva.Stage({
      container: id,
      width: this.width,
      height: this.height,
    });

    this.displayed = true;

    this.animatedLayer = null;

    this.init();
  }

  createAnimatedLayer() {
    this.animatedLayer = new Konva.Layer();
    this.stage.add(this.animatedLayer);
  }

  init() {
    this.createAnimatedLayer();

    document.addEventListener('visibilitychange', (e) => {
      this.displayed = !document.hidden;
      if (!this.displayed) this.animatedLayer.destroyChildren();
    });
  }

  createBubble() {
    const radius = 30;
    const baseX = random.float(radius+10, this.width-radius-10);
    const baseY = random.float(this.height-200, this.height-20);
    const bubble = new Bubble({
      x: baseX,
      y: baseY,
      radius: radius,
      fill: 'red',
    }, {
      radius: radius,
      baseY: baseY,
    }, this.animatedLayer, this.stage);
    this.animatedLayer.add(bubble.konvaObject);
    bubble.animate();
  }
}
