import Konva from 'konva';
import CStar from './CStar';
import {LEFT, RIGHT, UP, LINE_RATIO} from '../directions';
import random from 'random';

export class Canvas {
  constructor(id, text, img) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.id = id;

    this.stage = new Konva.Stage({
      container: id,
      width: this.width,
      height: this.height + 20,
    });

    this.backLine = {
      angle: 0,
      offset: 0,
    };

    this.displayed = true;

    this.imageLayer = null;
    this.animatedLayer = null;
    this.textLayer = null;

    this.img = img;
    this.text = text;

    this.init();
  }

  createBackground() {
    this.imageLayer = new Konva.Layer();

    const imageObj = new Image();
    imageObj.onload = () => {
      const yoda = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: this.width,
        height: this.height,
      });

      // add the shape to the layer
      this.imageLayer.add(yoda);
      this.imageLayer.batchDraw();
    };
    imageObj.src = this.img;
    const x1 = 0;
    const x2 = this.width;
    const y1 = this.height*LINE_RATIO;
    const y2 = this.height;
    this.backLine.offset = y1;
    this.backLine.angle = (y2 - y1) / (x2 - x1);
    const line = new Konva.Line({
      points: [x1, y1, x2, y2],
      stroke: '#ED5E5C',
      strokeWidth: 10,
    });
    this.imageLayer.add(line);
    this.stage.add(this.imageLayer);
  }

  createAnimatedLayer() {
    this.animatedLayer = new Konva.Layer();
    this.stage.add(this.animatedLayer);
  }

  createTextLayer() {
    this.textLayer = new Konva.Layer();
    const simpleLabel = new Konva.Label({
      x: this.stage.width() / 2,
      y: this.stage.height() / 3,
    });

    // simple2Label.add(
    //     new Konva.Tag({
    //         fill: '#191A1D',
    //     })
    // );

    simpleLabel.add(
        new Konva.Text({
          text: this.text,
          fontSize: 50,
          fontFamily: 'Montserrat',
          fill: '#FFFFFF',
          align: 'center',
        }),
    );
    simpleLabel.offsetX(simpleLabel.width() / 2);
    simpleLabel.offsetY(simpleLabel.height() / 2);
    this.textLayer.add(simpleLabel);
    this.stage.add(this.textLayer);
  }

  init() {
    this.createBackground();
    this.createAnimatedLayer();
    this.createTextLayer();

    document.addEventListener('visibilitychange', (e) => {
      this.displayed = !document.hidden;
      if (!this.displayed) this.animatedLayer.destroyChildren();
    });
    document.addEventListener('scroll', ()=>{
      const canvas = document.getElementById(this.id);
      const rect = canvas && canvas.getBoundingClientRect();
      this.displayed = rect.bottom > 0;
      if (!this.displayed) this.animatedLayer.destroyChildren();
    });
  }

  createStar() {
    const baseX = random.int(10, 400);
    const baseY = 50;
    const star = new CStar({
      x: baseX,
      y: baseY,
      outerRadius: 20,
      innerRadius: 10,
      fill: '#FFFFFF',
      strokeWidth: 4,
      numPoints: 5,
      lineJoin: 'round',
      shadowOpacity: 0.5,
    }, {
      onLineInterception: (star) => {
        const starCount = random.int(1, 4);
        for (let i = 0; i < starCount; i++) {
          const miniStar = new CStar({
            x: star.coords.x + random.int(-100, 100),
            y: star.coords.y - random.int(30, 100),
            outerRadius: 10,
            innerRadius: 5,
            fill: '#FFFFFF',
            strokeWidth: 4,
            numPoints: 5,
            lineJoin: 'round',
          }, {
            accelerationFrameChange: 0.01,
            verticalDirection: UP,
            horizontalDirection: random.float(1, 2) > 1.5 ? LEFT : RIGHT,
            onDirectionChange: (star) => {
              star.destroy();
            },
          }, this.animatedLayer, this.stage, this.backLine);
          miniStar.animate();
        }
      },
    },
    this.animatedLayer, this.stage, this.backLine);
    star.animate();
  }
}
