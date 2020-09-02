export default class Bubble {
  constructor(konvaProps, bubbleProps, layer, stage) {
    this.konvaObject = new Konva.Circle(konvaProps);
    this.options = bubbleProps;

    this.coords = {x: 100, y: 400};
    this.layer = layer;
    this.stage = stage;

    this.animation = null;
    this.konvaObject.perfectDrawEnabled(false);
    this.konvaObject.on('mouseover', this.bubblePop.bind(this));
    layer.batchDraw();
  }

  animate() {
    this.animation = new Konva.Animation((frame)=>{
      if (!this.konvaObject.parent) this.destroy();
      const velocity = (frame.timeDiff / 20);
      this.coords.y -= velocity;
      this.konvaObject.y(this.coords.y);
      const percentage = (this.coords.y - this.options.radius)/
          (this.options.baseY - this.options.radius);
      this.konvaObject.opacity(percentage);
      if (this.coords.y < this.options.radius) this.destroy();
    }, this.layer);
    this.animation.start();
  }

  destroy() {
    this.konvaObject.destroy();
    this.animation.stop();
  }

  bubblePop(){
    this.destroy();

  }
}
