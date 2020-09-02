import Konva from 'konva';
export default class BubbleLine {
  constructor(props, layer) {
    this.konvaObject = new Konva.Line({
      points: [props.x1, props.y1, props.x2, props.y2],
      stroke: '#ED5E5C',
      strokeWidth: 3,
    });

    this.coords = {
      x1: props.x1,
      y1: props.y1,
      x2: props.x2,
      y2: props.y2,
    };

    this.layer = layer;
    this.layer.add(this.konvaObject);

    this.animation = null;
  }

  animate() {
    const xSign = Math.sign(this.coords.x1 - this.coords.x2);
    // const ySign = Math.sign(this.coords.y1 - this.coords.y2);

    this.animation = new Konva.Animation((frame) => {
      if (!this.konvaObject.parent) this.destroy();
      const velocity = frame.timeDiff/20;
      this.coords.x2 += xSign*velocity;
      // this.coords.y2 += ySign*
    });
  }

  destroy() {
    this.konvaObject.destroy();
    this.animation.stop();
  }
}
