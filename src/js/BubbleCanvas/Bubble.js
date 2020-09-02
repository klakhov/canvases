import BubbleLine from './BubbleLine';
export default class Bubble {
  constructor(konvaProps, bubbleProps, layer, stage) {
    this.konvaObject = new Konva.Circle(konvaProps);
    this.options = bubbleProps;

    this.coords = {x: bubbleProps.baseX, y: bubbleProps.baseY};
    this.layer = layer;
    this.stage = stage;

    this.radius = bubbleProps.radius;
    this.parent = bubbleProps.parent;

    this.canPop = false;
    setTimeout(()=>{
      this.canPop = true;
    }, 2000);
    this.animation = null;
    this.konvaObject.on('mouseover', this.bubblePop.bind(this));
  }

  animate() {
    this.animation = new Konva.Animation((frame)=>{
      if (!this.konvaObject.parent) this.destroy();
      const velocity = (frame.timeDiff / 10);
      this.coords.y -= velocity;
      this.konvaObject.y(this.coords.y);
      // opacity looks awful
      // const percentage = (this.coords.y - this.options.radius)/
      //     (this.options.baseY - this.options.radius);
      // this.konvaObject.opacity(percentage);
      if (this.coords.y < this.options.radius + 200) this.bubblePop(true);
    }, this.layer);
    this.animation.start();
  }

  destroy() {
    this.konvaObject.destroy();
    this.animation.stop();
  }

  bubblePop(force=false) {
    if (force || this.canPop) {
      this.parent.bubbleCanPop = false;
      this.konvaObject.destroy();
      this.animation.stop();
      this.layer.batchDraw();
      const radius = this.radius;
      const radius2 = this.radius/2;
      const radius4 = this.radius/4;
      // long lines variant
      // const rotations = [
      //   {x1: -radius-radius4/2, y1: 0, x2: -radius4, y2: 0},
      //   {x1: -radius2-radius4, y1: -radius2-radius4, x2: 0, y2: 0},
      //   {x1: 0, y1: -radius-radius4, x2: 0, y2: -radius4},
      //   {x1: radius2+radius4, y1: -radius2-radius4, x2: 0, y2: 0},
      //   {x1: radius+radius4/2, y1: 0, x2: radius4, y2: 0},
      //   {x1: radius2+radius4, y1: radius2+radius4, x2: 0, y2: 0},
      //   {x1: 0, y1: radius+radius4, x2: 0, y2: radius4},
      //   {x1: -radius2-radius4, y1: radius2+radius4, x2: 0, y2: 0},
      // ];
      const rotations = [
        {x1: -radius-radius4/2, y1: 0, x2: -radius2, y2: 0},
        {x1: -radius2-radius4, y1: -radius2-radius4, x2: -radius4,
          y2: -radius4},
        {x1: 0, y1: -radius-radius4, x2: 0, y2: -radius2},
        {x1: radius2+radius4, y1: -radius2-radius4, x2: radius4,
          y2: -radius4},
        {x1: radius+radius4/2, y1: 0, x2: radius2, y2: 0},
        {x1: radius2+radius4, y1: radius2+radius4, x2: radius4,
          y2: radius4},
        {x1: 0, y1: radius+radius4, x2: 0, y2: radius2},
        {x1: -radius2-radius4, y1: radius2+radius4, x2: -radius4,
          y2: radius4},
      ];
      const lines = [];
      for (const rotation of rotations) {
        lines.push(new BubbleLine({
          x1: this.coords.x + rotation.x1,
          y1: this.coords.y + rotation.y1,
          x2: this.coords.x + rotation.x2,
          y2: this.coords.y + rotation.y2,
        }, this.layer));
      }
      for (const line of lines) {
        line.animate();
      }
    }
  }
}
