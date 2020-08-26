import Konva from "konva";
import cStar from "./classes/cStar";
import "../img/bg.png";
import random from "random"

const width = window.innerWidth;
const stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: 700,
});
let imageLayer;
let animatedLayer;
const backLine = {
    angle: 0,
    offset: 0,
}

const UP = -1;
const DOWN = 1;
const LEFT = -1;
const RIGHT = 1;

function createBackground() {
    imageLayer = new Konva.Layer();

    const imageObj = new Image();
    imageObj.onload = function () {
        const yoda = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: 1920,
            height: 662,
        });

        // add the shape to the layer
        imageLayer.add(yoda);
        imageLayer.batchDraw();
    };
    imageObj.src = './img/bg.png';
    const x1 = 0;
    const x2 = 1920;
    const y1 = 450;
    const y2 = 662;
    backLine.offset = y1;
    backLine.angle = (y2 - y1) / (x2 - x1);
    const line = new Konva.Line({
        points: [x1, y1, x2, y2],
        stroke: 'red',
        strokeWidth: 15,
    })
    imageLayer.add(line)
    stage.add(imageLayer);
}

function createAnimatedLayer() {
    animatedLayer = new Konva.Layer();
    stage.add(animatedLayer);
}

function starIntercepts(newX, newY) {
    // simple linear algebra y - a*x - b = 0
    return newY - backLine.angle * newX - backLine.offset >= 0;
}

function createMiniStar(x, y) {
    const star = new Konva.Star(
        {
            x: x,
            y: y,
            outerRadius: 20,
            innerRadius: 10,
            stroke: 'white',
            fill: '#b5ff88',
            strokeWidth: 4,
            numPoints: 5,
            lineJoin: 'round',
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'black',
            shadowOpacity: 0.5,
            opacity: 0.8,
        });
    animatedLayer.add(star);
    animatedLayer.draw();
    let angle = random.uniform(1, 3)();
    let friction = 1;
    let verticalDirection = UP;
    let horizontalDirection = random.uniform(2, 3)() > 2.5 ? LEFT : RIGHT;
    const anim = new Konva.Animation(function (frame) {
        let velocity = (frame.timeDiff / 20) * friction;
        // gravity effects
        // mini star always go up
        friction -= 0.01;
        if (horizontalDirection === LEFT) {
            x -= velocity;
        } else {
            x += velocity;
        }
        y += (verticalDirection) * angle * velocity;
        star.x(x);
        star.y(y);
        if (friction <= 0) {
            star.destroy();
        }
    }, animatedLayer);
    anim.start();
    setTimeout(() => {
        anim.stop();
    }, 3000);
}

function createStar() {
    const baseX = random.uniform(100, 900)();
    const baseY = 50;
    const star = new Konva.Star(
        {
            x: baseX,
            y: baseY,
            outerRadius: 40,
            innerRadius: 20,
            stroke: '#005500',
            fill: '#b5ff88',
            strokeWidth: 4,
            numPoints: 5,
            lineJoin: 'round',
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'black',
            shadowOpacity: 0.5,
            opacity: 0.8,
        }
    );
    animatedLayer.add(star);
    animatedLayer.draw();
    let direction = 1;
    let friction = 1;
    let angle = random.float(1, 2.5);
    let x = baseX;
    let y = baseY;
    const anim = new Konva.Animation(function (frame) {
        // const t = frame.time / 8;
        let velocity = (frame.timeDiff / 20) * friction;
        // gravity effects
        // console.log(velocity)
        if (direction === 1) {
            friction += 0.1;
        } else {
            friction -= 0.1;
            if (friction <= 0) {
                direction = 1;
            }
        }
        x += velocity;
        y += (direction) * angle * velocity;
        if (starIntercepts(x, y)) {
            direction = -1;
            angle -= 0.2
            const miniStars = random.int(1, 3);

            createMiniStar(x - 50, y - 100);
        }
        star.x(x);
        star.y(y);
        if (x > stage.width()) {
            star.destroy();
        }
    }, animatedLayer);
    anim.start();
    setTimeout(() => {
        anim.stop();
    }, 10000);
}

function createStarT() {
    const baseX = random.uniform(100, 900)();
    const baseY = 50;
    const star = new cStar({
            x: baseX,
            y: baseY,
            outerRadius: 40,
            innerRadius: 20,
            stroke: '#005500',
            fill: '#b5ff88',
            strokeWidth: 4,
            numPoints: 5,
            lineJoin: 'round',
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowBlur: 10,
            shadowColor: 'black',
            shadowOpacity: 0.5,
            opacity: 0.8,
        }, {
        onLineInterception: (coords)=>{
            const miniStar = new cStar({
                x: coords.x - 100,
                y: coords.y - 100,
                outerRadius: 20,
                innerRadius: 10,
                stroke: '#005500',
                fill: '#f4a663',
                strokeWidth: 4,
                numPoints: 5,
                lineJoin: 'round',
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                shadowBlur: 10,
                shadowColor: 'black',
                shadowOpacity: 0.5,
                opacity: 0.8,
            },{
                accelerationFrameChange: 0.01,
                verticalDirection: UP,

            })
        }
        },
        animatedLayer, stage, backLine);
    star.animate();
}

function start() {
    setInterval(() => {
        createStarT();
    }, 2000)
}

createBackground();
createAnimatedLayer();
start();
