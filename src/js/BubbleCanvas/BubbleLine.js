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
    this.onAnimationEnd = props.onAnimationEnd;

    this.layer = layer;
    this.layer.add(this.konvaObject);

    // this.konvaObject.cache();
    this.konvaObject.perfectDrawEnabled(false);
    this.konvaObject.listening(false);
    this.animation = null;
    this.layer.draw();
  }

  animate() {
    const xSign = Math.sign(this.coords.x1 - this.coords.x2);
    const ySign = Math.sign(this.coords.y1 - this.coords.y2);

    this.animation = new Konva.Animation((frame) => {
      if (!this.konvaObject.parent) this.destroy();
      const velocity = frame.timeDiff/15;
      // virtual coords change
      if (this.coords.x1 !== this.coords.x2) {
        this.coords.x2 += xSign*velocity;
        const angle = Math.abs(this.coords.y2-this.coords.y1)/
          Math.abs(this.coords.x2-this.coords.x1);
        this.coords.y2 += ySign*angle*velocity;

        this.coords.x1 += xSign*velocity/3;
        this.coords.y1 += ySign*angle*velocity/3;
      } else {
        this.coords.y2 += ySign*velocity;
      }

      this.konvaObject.points([this.coords.x1, this.coords.y1,
        this.coords.x2, this.coords.y2]);
      if (Math.abs(this.coords.x1 - this.coords.x2) < 5 &&
        Math.abs(this.coords.y1 - this.coords.y2) < 5) this.destroy();
    });
    this.animation.start();
  }

  destroy() {
    this.konvaObject.destroy();
    this.animation.stop();
  }
}
