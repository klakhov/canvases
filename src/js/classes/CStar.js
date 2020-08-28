import Konva from 'konva';
import {UP, DOWN, RIGHT} from '../directions';
import random from 'random';

export default class CStar {
  constructor(konvaProps, starProps, layer, stage, line) {
    this.konvaObject = new Konva.Star({...konvaProps});

    this.coords = {x: konvaProps.x, y: konvaProps.y};

    this.options = {
      acceleration: starProps.acceleration ? starProps.acceleration : 1,
      accelerationFrameChange: starProps.accelerationFrameChange ?
        starProps.accelerationFrameChange : 0.1,
      angle: starProps.angle ? starProps.angle : random.float(.5, 3),
      angleInterceptionChange: starProps.angleInterceptionChange ?
        starProps.angleInterceptionChange : 0.2,
      verticalDirection: starProps.verticalDirection ?
        starProps.verticalDirection : DOWN,
      horizontalDirection: starProps.horizontalDirection ?
        starProps.horizontalDirection : RIGHT,
      animationFinish: starProps.animationFinish ?
        starProps.animationFinish : 10000,
      onLineInterception: starProps.onLineInterception ?
        starProps.onLineInterception : null,
      onDirectionChange: starProps.onDirectionChange ?
        starProps.onDirectionChange : null,
    };
    this.layer = layer;
    this.line = line;
    this.stage = stage;
    layer.add(this.konvaObject);
    this.konvaObject.cache();
    this.konvaObject.perfectDrawEnabled(false);
    this.konvaObject.listening(false);
    layer.batchDraw();
    this.animation = null;
  }

  animate() {
    this.animation = new Konva.Animation((frame) => {
      if (!this.konvaObject.parent) this.destroy();
      const velocity = (frame.timeDiff / 20) * this.options.acceleration;

      // gravity effects
      this.options.acceleration += (this.options.verticalDirection)*
        this.options.accelerationFrameChange;
      if (this.options.acceleration <= 0) {
        this.options.verticalDirection = DOWN;
        if (this.options.onDirectionChange) {
          this.options.onDirectionChange(this);
        }
      }

      // virtual coords change
      this.coords.x += (this.options.horizontalDirection) * velocity;
      this.coords.y += (this.options.verticalDirection) * this.options.angle *
        velocity;
      if (this.interceptsWithLine()) {
        this.options.verticalDirection = UP;
        this.options.angle -= this.options.angleInterceptionChange;
        if (this.options.onLineInterception) {
          this.options.onLineInterception(this);
        }
      }

      // real coords change
      this.konvaObject.x(this.coords.x);
      this.konvaObject.y(this.coords.y);

      // star left stage
      if (this.coords.x > this.stage.width()) {
        this.destroy();
      }
    }, this.layer);
    this.animation.start();
    // setTimeout(() => {
    //     this.animation.stop();
    // }, this.options.animationFinish);
  }

  interceptsWithLine() {
    return this.coords.y - this.line.angle * this.coords.x -
      this.line.offset >= 0;
  }

  destroy() {
    this.konvaObject.destroy();
    this.animation.stop();
  }
}
