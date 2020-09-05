import Konva from 'konva';
import Bubble from './Bubble';
import random from 'random';

export class Canvas {
  constructor(id, dimensions) {
    this.width = dimensions.width;
    this.height = dimensions.height;

    this.id = id;

    this.stage = new Konva.Stage({
      container: id,
      width: this.width,
      height: this.height,
    });

    this.bubbleCanPop = true;

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
    document.addEventListener('scroll', ()=>{
      const canvas = document.getElementById(this.id);
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        this.displayed = rect.bottom > 0;
        if (!this.displayed) this.animatedLayer.destroyChildren();
      }
    });
  }

  createBubble() {
    const radius = 30;
    const baseX = random.float(radius+10, this.width-radius-10);
    const baseY = random.float(this.height-radius*2, this.height-radius);
    const bubble = new Bubble({
      x: baseX,
      y: baseY,
      radius: radius,
      fill: '#ED5E5C',
    }, {
      radius: radius,
      baseY: baseY,
      baseX: baseX,
      parent: this,
    }, this.animatedLayer, this.stage);
    this.animatedLayer.add(bubble.konvaObject);
    bubble.animate();
  }
}
