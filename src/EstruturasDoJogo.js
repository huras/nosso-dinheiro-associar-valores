// Touch screen analogic
class TouchAnalogic {
  constructor(options) {
    this.draging = false,
      this.deadZonePercent = 0.35

    this.isClickStart = true;
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.margin = options.margin;
    this.radius = options.radius;
    this.personalizedImage = options.personalizedImage;
    this.circle = {
      x: canvas.width - this.margin - this.radius,
      y: canvas.height - this.margin - this.radius,
      r: this.radius,
    }

    this.registerEvents();
  }

  registerEvents() {
    this.canvas.addEventListener('touchstart', (event) => {
      this.filterXY(event, true);
    });
    this.canvas.addEventListener('touchmove', (event) => {
      this.filterXY(event, !this.isClickStart);
    });

    this.canvas.addEventListener('touchend', (event) => {
      this.filterXY(event, false);
    });

    if (!window.mobileAndTabletCheck()) {
      this.canvas.addEventListener('mousedown', (event) => {
        this.filterXY(event, true);
      });
      this.canvas.addEventListener('mouseup', (event) => {
        this.filterXY(event, false);
      });
      this.canvas.addEventListener('mousemove', (event) => {
        this.filterXY(event, !this.isClickStart);
      });
    }
  }

  filterXY(event, clickValue) {
    var x = 0;
    if (event.touches) {
      if (event.touches.length > 0)
        x = event.touches[0].pageX
      else
        x = event.pageX;
    }
    else
      x = event.pageX;

    var y = event.touches
      ? event.touches.length > 0
        ? event.touches[0].pageY
        : event.pageY
      : event.pageY;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // Processa clique / desclique
    if (clickValue == true) {
      this.checkTouch(x, y);
      this.isClickStart = false;
    } else {
      this.checkUntouch(x, y);
      this.isClickStart = true;
    }
  }

  checkTouch(x, y) {
    if (!this.draging) {
      if (this.isClickStart) {
        this.circle.x = x;
        this.circle.y = y;
      }
      this.draging = true;

      // const touchDist = Vector2.distance({ x: x, y: y }, { x: this.circle.x, y: this.circle.y });
      // if (touchDist > this.deadZonePercent * this.circle.r) {
      //   // console.log(touchDist, this.circle, touchDist <= this.circle);

      //   if (this.circle && Physics.pointCircle({ x: x, y: y }, this.circle)) {
      //     this.draging = true;
      //   }
      // } else {
      //   this.draging = false;
      //   this.currentDirection = undefined;
      // }
    }

    if (this.draging) {
      let dir = { x: 0, y: 0 };

      dir.x = x - (this.circle.x);
      dir.y = y - (this.circle.y);

      const currDirVec = new Vector2(dir.x, dir.y);
      const currMagnitude = currDirVec.magnitude();
      // console.log(currDirVec);
      if (currMagnitude > this.circle.r) {
        dir.x = (dir.x / currMagnitude) * this.circle.r;
        dir.y = (dir.y / currMagnitude) * this.circle.r;
      }

      this.currentDirection = dir;
    }
  }

  checkUntouch(x, y) {
    this.currentDirection = { x: 0, y: 0 };
    this.draging = false;
  }

  render() {

    if (this.draging && this.currentDirection) {

      this.ctx.beginPath();
      this.ctx.arc(this.circle.x, this.circle.y, this.circle.r, 0, 2 * Math.PI);
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = "rgb(255,255,255, 0.6)";
      this.ctx.stroke();
      this.ctx.fillStyle = "rgb(0,0,0, 0.2)";
      this.ctx.fill();
      this.ctx.beginPath();

      if (this.personalizedImage && this.personalizedImage.arrow) {
        const divisions = 4;
        const degrees = 360 / divisions;
        const size = {
          w: this.circle.r * 0.2,
          h: this.circle.r * 0.2
        }
        this.ctx.save();
        this.ctx.translate(this.circle.x, this.circle.y);
        for (var i = 0; i < divisions; i++) {
          this.ctx.rotate(degrees_to_radians(i * degrees));
          this.ctx.drawImage(
            this.personalizedImage.arrow,
            -0.5 * size.w, -this.circle.r * 0.75 - 0.5 * size.h,
            size.w, size.h
          )
        }
        this.ctx.restore();
      }

      var directionTouse = this.currentDirection;

      // const angle = Vector2.angleBetween(new Vector2(analogicCircle.r, analogicCircle.r), new Vector2(directionTouse.x, directionTouse.y));
      // const maxX = Math.cos(angle) * analogicCircle.r;
      // const maxY = Math.sin(angle) * analogicCircle.r;
      // console.log(angle);
      // if (Math.abs(directionTouse.x) > Math.abs(maxX))
      //   directionTouse.x = maxX;

      // if (Math.abs(directionTouse.y) > Math.abs(maxY))
      //   directionTouse.y = maxY;

      // if (directionTouse.x > analogicCircle.r)
      //   directionTouse.x = analogicCircle.r
      // else if (directionTouse.x < -analogicCircle.r)
      //   directionTouse.x = -analogicCircle.r

      // if (directionTouse.y > analogicCircle.r)
      //   directionTouse.y = analogicCircle.r
      // else if (directionTouse.y < -analogicCircle.r)
      //   directionTouse.y = -analogicCircle.r

      this.ctx.beginPath();
      this.ctx.arc(this.circle.x, this.circle.y, this.circle.r * this.deadZonePercent, 0, 2 * Math.PI);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgb(0,0,0, 0.2)";
      this.ctx.stroke();
      this.ctx.fillStyle = "rgb(0,0,0, 0.2)";
      this.ctx.fill();

      if (this.personalizedImage && this.personalizedImage.image) {
        var fw = 2 * this.circle.r * (1 - this.deadZonePercent) * 3 / 4;
        var fh = 2 * this.circle.r * (1 - this.deadZonePercent) * 3 / 4;
        this.ctx.drawImage(this.personalizedImage.image,
          this.circle.x + directionTouse.x - 0.5 * fw, this.circle.y + directionTouse.y - 0.5 * fh,
          fw, fh
        );
      } else {

        this.ctx.arc(this.circle.x + directionTouse.x, this.circle.y + directionTouse.y, this.circle.r * (1 - this.deadZonePercent) * 3 / 4, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "rgb(255,255,255, 0.9)";
        this.ctx.stroke();
        this.ctx.fillStyle = "rgb(255,255,255, 0.7)";
        this.ctx.fill();
      }


    } else {
      // this.ctx.beginPath();
      // this.ctx.arc(this.circle.x, this.circle.y, this.circle.r * this.deadZonePercent, 0, 2 * Math.PI);
      // this.ctx.lineWidth = 1;
      // this.ctx.strokeStyle = "rgb(255,255,255, 0.4)";
      // this.ctx.stroke();
      // this.ctx.fillStyle = "rgb(255,255,255, 0.4)";
      // this.ctx.fill();
    }
  }
}

// Nave 2D
class Nave2D {
  constructor(options) {
    this.position = options.position;
    this.initialPosition = options.initialPosition || { x: () => { return this.position.x }, y: () => { return this.position.y } };
    this.pivot = options.pivot;
    this.image = options.image;
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.zoom = options.zoom || 1;
    this.pivotalRotation = 0;
    this.centralRotation = 0;

    this.accel = options.accel || { x: 0.085, y: 0.0370 };
    this.speed = options.speed || { x: 0, y: 0 };
    this.maxSpeed = options.maxSpeed || { x: 5, y: 7.5 };
    this.iddleFriction = options.iddleFriction || { x: 0.95, y: 0.85 };
    this.rockets = options.rockets || [];
    this.rocketTurnedOnDelay = 30;
    this.turnedOn = false;
  }

  drawNave() {

    var maxWidth = 80;
    if (engine.layout == 'mobile') {
      maxWidth = canvas.width * 0.155;
    }

    const scale = this.zoom;
    var finalW = maxWidth * scale;
    var finalH = (maxWidth / this.image.width) * this.image.height * scale;

    var positionToUse = this.position;
    if (!this.turnedOn && !this.keepPosition) {
      positionToUse = {
        x: this.initialPosition.x(),
        y: this.initialPosition.y(),
      }

      this.position = positionToUse;
    }

    this.ctx.save();
    this.ctx.translate(positionToUse.x, positionToUse.y);
    this.ctx.rotate(degrees_to_radians(this.pivotalRotation + (this.speed.x / this.maxSpeed.x) * 25));

    if (this.turnedOn) {

      if (this.movingLeft > 0) {
        this.rockets.right.map(rocket => {
          rocket.render(scale, finalW, finalH);
        })
      }

      if (this.movingRight > 0) {
        this.rockets.left.map(rocket => {
          rocket.render(scale, finalW, finalH);
        })
      }

      if (this.speed.y <= 0.5) {
        this.rockets.central.map(rocket => {
          rocket.render(scale, finalW, finalH, { x: 1, y: 1 + 2 * Math.abs(this.speed.y / this.maxSpeed.y) }, true);
        })
      }
    }

    var fx = -this.pivot.x * finalW;
    var fy = -this.pivot.y * finalH;

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,

      fx,
      fy,
      finalW,
      finalH,
    );

    fx += positionToUse.x;
    fy += positionToUse.y;

    this.rectCollider = {
      x: fx,
      y: fy,
      w: finalW,
      h: finalH
    };

    this.ctx.restore();

    if (this.movingLeft < 0) {
      this.movingLeft = 0;
    }
    if (this.movingRight < 0) {
      this.movingRight = 0;
    }
  }

  fisica(deltaTime = 1) {
    const scale = this.zoom;

    var maxWidth = 100;
    if (engine.layout == 'mobile') {
      maxWidth = canvas.width * 0.15;
    }

    // Obedece velocidade maxima
    if (Math.abs(this.speed.x) > this.maxSpeed.x)
      this.speed.x = Math.sign(this.speed.x) * this.maxSpeed.x;
    if (Math.abs(this.speed.y) > this.maxSpeed.y)
      this.speed.y = Math.sign(this.speed.y) * this.maxSpeed.y;


    // Move nave
    this.position.x += this.speed.x * deltaTime * scale;
    this.position.y += this.speed.y * deltaTime * scale;

    // Impede passar peras paredes laterais horizontais
    var finalW = maxWidth * scale;
    if (this.position.x - finalW * 0.5 < 0) {
      this.position.x = finalW * 0.5;
      this.speed.x *= -0.35;
    } else if (this.position.x + finalW * 0.5 > this.canvas.width) {
      this.position.x = this.canvas.width - finalW * 0.5;
      this.speed.x *= -0.35;
    }

    // Impede passar pelas laterais verticais
    var finalH = (maxWidth / this.image.width) * this.image.height * scale;
    if (this.position.y - finalH < 0) {
      this.position.y = finalH;
      this.speed.y *= -0.35;
    }
    else if (this.position.y > this.canvas.height) {
      this.position.y = this.canvas.height;
      this.speed.y *= -0.35;
    }

    this.movingLeft--;
    this.movingRight--;
  }

  readMovimentation(inputmanager, keys = { up: InputManager.Keys.Up_Arrow, left: InputManager.Keys.Left_Arrow, right: InputManager.Keys.Right_Arrow, down: InputManager.Keys.Down_Arrow }) {
    if (!this.turnedOn)
      return;

    if (inputmanager.isPressed(keys.left)) {
      if (this.speed.x > 0) {
        this.speed.x *= this.iddleFriction.x;
      }
      this.speed.x -= this.accel.x;
      this.movingLeft = this.rocketTurnedOnDelay;
    } else if (inputmanager.isPressed(keys.right)) {
      if (this.speed.x < 0) {
        this.speed.x *= this.iddleFriction.x;
      }
      this.speed.x += this.accel.x;
      this.movingRight = this.rocketTurnedOnDelay;

    } else {
      if (this.speed.x > 0.5) {
        this.movingLeft = 2;
        this.movingRight = 0;
      } else if (this.speed.x < -0.5) {
        this.movingRight = 2;
        this.movingLeft = 0;
      }

      this.speed.x *= this.iddleFriction.x;
    }

    if (inputmanager.isPressed(keys.up)) {
      if (this.speed.y > 0) {
        this.speed.y *= this.iddleFriction.y;
      }
      this.speed.y -= this.accel.y;
      this.movingRight = this.rocketTurnedOnDelay * 0.5;
      this.movingLeft = this.rocketTurnedOnDelay * 0.5;
    } else if (inputmanager.isPressed(keys.down)) {
      if (this.speed.y < 0) {
        this.speed.y *= this.iddleFriction.y;
      }
      this.speed.y += this.accel.y;
    } else {
      this.speed.y *= this.iddleFriction.y;
    }
  }

  readTouchMovimentation(analogic) {
    if (!this.turnedOn)
      return;
    // if (analogic.currentDirection)
    //   console.singleLog(analogic);

    if (analogic.currentDirection && analogic.currentDirection.x > analogic.deadZonePercent) {
      if (this.speed.x < 0) {
        this.speed.x *= this.iddleFriction.x;
      }
      this.speed.x += this.accel.x * analogic.currentDirection.x / analogic.radius;
      this.movingRight = this.rocketTurnedOnDelay;
    } else if (analogic.currentDirection && analogic.currentDirection.x < -analogic.deadZonePercent) {
      if (this.speed.x > 0) {
        this.speed.x *= this.iddleFriction.x;
      }
      this.speed.x += this.accel.x * analogic.currentDirection.x / analogic.radius;
      this.movingLeft = this.rocketTurnedOnDelay;
    } else {
      if (this.speed.x > 0.5) {
        this.movingLeft = 2;
        this.movingRight = 0;
      } else if (this.speed.x < -0.5) {
        this.movingRight = 2;
        this.movingLeft = 0;
      }

      this.speed.x *= this.iddleFriction.x;
    }

    if (analogic.currentDirection && analogic.currentDirection.y > analogic.deadZonePercent) {
      if (this.speed.y < 0) {
        this.speed.y *= this.iddleFriction.y;
      }
      this.speed.y += this.accel.y * analogic.currentDirection.y / analogic.radius;
    } else if (analogic.currentDirection && analogic.currentDirection.y < -analogic.deadZonePercent) {
      if (this.speed.y > 0) {
        this.speed.y *= this.iddleFriction.y;
      }
      this.speed.y += this.accel.y * analogic.currentDirection.y / analogic.radius;
      this.movingRight = this.rocketTurnedOnDelay * 0.5;
      this.movingLeft = this.rocketTurnedOnDelay * 0.5;
    } else {
      this.speed.y *= this.iddleFriction.y;
    }
  }
}

//  Fundo com gradiente
class BGGradiente {
  constructor(tween, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.height = 0;
    this.tween = tween;
    this.mayRise = false;
    this.reachedKeyframes = [];
  }

  render() {
    if (this.tween && this.tween.length > 0) {
      const w = this.canvas.width;
      const h = this.canvas.height;

      var gradient = this.ctx.createLinearGradient(w * 0.5, h, w * 0.5, 0);

      var colorPositions = [];
      var colors = [];

      var currentFrame = this.getCurrentCeuKeyframe(this.height);
      const nextFrameIdx = this.tween.indexOf(currentFrame) + 1;
      var nextKeyFrame = this.tween[nextFrameIdx];

      if (this.reachedKeyframes.indexOf(currentFrame) == -1) {
        this.reachedKeyframes.push(currentFrame)
        if (currentFrame.onReach)
          currentFrame.onReach();
      }

      if (nextKeyFrame) {

        var lerpRatio = (this.height - currentFrame.keyframe) / (nextKeyFrame.keyframe - currentFrame.keyframe);
        if (lerpRatio == NaN || lerpRatio == Infinity)
          lerpRatio = 1

        currentFrame.points.map(point => {
          if (point.position != undefined) {
            const nextPoint = this.getPointByID(nextKeyFrame.points, point.id)
            const currPoint = this.getPointByID(currentFrame.points, point.id)

            if (nextPoint.position != undefined) {
              var lerpedPosition = lerp(currPoint.position, nextPoint.position, lerpRatio);
              var lerpedR = lerp(currPoint.color.r, nextPoint.color.r, lerpRatio);
              var lerpedG = lerp(currPoint.color.g, nextPoint.color.g, lerpRatio);
              var lerpedB = lerp(currPoint.color.b, nextPoint.color.b, lerpRatio);

              gradient.addColorStop(lerpedPosition, 'rgb(' + lerpedR + ',' + lerpedG + ',' + lerpedB + ')');
            } else {
              gradient.addColorStop(point.position, 'rgb(' + point.color.r + ',' + point.color.g + ',' + point.color.b + ')');
            }
          }
        });

      } else {
        currentFrame.points.map(point => {
          if (point.position != undefined) {
            gradient.addColorStop(point.position, 'rgb(' + point.color.r + ',' + point.color.g + ',' + point.color.b + ')');
          }
        })
      }

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, w, h);
    }

    if (this.mayRise == true)
      this.height++;
    // console.log(this.height, currentFrame);
  }
  getPointByID(points, target) {
    var retorno = undefined

    points.map(point => {
      if (point.id == target)
        retorno = point
    })

    return retorno;
  }
  getCurrentCeuKeyframe(counter) {
    var retorno = undefined;
    this.tween.map(item => {
      if ((item.firstFrame) || counter >= item.keyframe) {
        retorno = item;
      }
    });

    return retorno;
  }
}

class ParticleFall {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = options.ctx;

    this.amount = options.amount || 0;
    this.generationParams = options.generationParams || {};

    this.fallBehaviour = options.fallBehaviour || (() => { console.log("Empty Fuction") });
    this.generateBehaviour = options.generateBehaviour || (() => { console.log("Empty Fuction") });
    this.resetTest = options.resetTest || (() => { console.log("Empty Fuction") });
    this.fallCondition = options.fallCondition || (() => { console.log("Empty Fuction"); return false; });

    this.maxWidth = options.maxWidth;

    this.particles = [];
    this.fillParticles();
  }

  increaseAmount(numberOfNewParticles) {
    this.amount += numberOfNewParticles;
    this.fillParticles();
  }

  fillParticles() {
    while (this.particles.length < this.amount) {
      this.particles.push(this.generateBehaviour({}, this.generationParams));
    }
  }

  render() {
    this.fillParticles();

    if (this.fallCondition()) {
      this.particles.map(particle => {
        this.fallBehaviour(particle, this.canvas);
      });
    }

    this.particles.map(particle => {
      if (this.resetTest(particle, this.canvas)) {
        particle = this.generateBehaviour(particle, this.generationParams);
      }

      var maxWidth = this.maxWidth;
      if (engine.layout == 'mobile') {
        maxWidth = canvas.width * 0.15;
      }

      const scale = particle.scale;
      var finalW = particle.image.width * scale;
      var finalH = particle.image.height * scale;

      this.ctx.save();
      if (particle.alpha) {
        this.ctx.globalAlpha = particle.alpha;
      }
      this.ctx.translate(particle.position.x, particle.position.y);
      this.ctx.rotate(degrees_to_radians(particle.rotation));
      this.ctx.drawImage(
        particle.image,
        0,
        0,
        particle.image.width,
        particle.image.height,

        -particle.pivot.x * finalW,
        -particle.pivot.y * finalH,
        finalW,
        finalH,
      );
      if (particle.alpha) {
        this.ctx.globalAlpha = 1;
      }
      this.ctx.restore();
    })
  }
}

class ParticleFire {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.position = options.position;
    this.scale = options.scale;
    this.image = options.image;
    this.animCounter = 0;

    this.defaultDelay = 2;
    this.currentState = 0;
    this.delayCounter = 0;
    this.states = [
      {
        sx: 0.75,
        sy: 0.5,
        delay: this.defaultDelay
      },
      {
        sx: 0.75,
        sy: 1,
        delay: this.defaultDelay
      },
      {
        sx: 1.1,
        sy: 0.7,
        delay: this.defaultDelay
      },
      {
        sx: 1,
        sy: 1,
        delay: this.defaultDelay
      },
      {
        sx: 0.6,
        sy: 0.6,
        delay: this.defaultDelay
      },
      {
        sx: 0.1,
        sy: 1.5,
        delay: this.defaultDelay
      },
      {
        sx: 0.25,
        sy: 0.8,
        delay: this.defaultDelay
      },

      {
        sx: 1.5,
        sy: 0.5,
        delay: this.defaultDelay
      },

    ]
  }

  render(s, w, h, extraS = { x: 1, y: 1 }, randomNextFrame = false) {
    this.delayCounter++;
    if (this.delayCounter > this.states[this.currentState].delay) {
      this.delayCounter = randomInt(0, 1);


      this.currentState++;

      if (this.currentState >= this.states.length) {
        if (randomNextFrame) {
          if (randomInt(0, 10) > 5) {
            this.currentState = randomInt(0, this.states.length - 1);
          } else {
            this.currentState = 0;
          }
        } else {
          this.currentState = 0;
        }
      }
    }

    const currFrame = this.states[this.currentState];
    // console.log(currFrame);
    this.ctx.save();
    this.ctx.translate(this.position.x * w, this.position.y * h);

    const myScaler = 0.20;
    var finalW = this.image.width * this.scale.x * s * currFrame.sx * myScaler * extraS.x;
    var finalH = this.image.height * this.scale.y * s * currFrame.sy * myScaler * extraS.y;

    this.ctx.drawImage(this.image, -0.5 * finalW, 0,
      finalW, finalH);
    this.ctx.restore();
    this.animCounter++;
  }
}

class MultilayerBackground {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.layers = options.layers || [];
    this.riseSpeed = options.riseSpeed || 1;
    this.currentHeight = options.currentHeight || 0;
    this.depth = options.depth || 100;
    this.backgroundSpeed = options.backgroundSpeed || 1;
    this.frontSpeed = options.frontSpeed || 1;
  }

  render() {
    if (this.mayRise == true) {
      this.currentHeight += this.riseSpeed;
    }

    const depth = this.depth;
    const speedInterval = this.frontSpeed - this.backgroundSpeed;
    const currHeigth = this.currentHeight;

    this.layers.map(layer => {
      this.ctx.save();
      var fW = layer.sizes.x(layer), fH = layer.sizes.y(layer);

      if (layer.responsive) {
        const scaler = layer.responsive(fW, fH);
        fW *= scaler;
        fH *= scaler;
      }

      const depthRate = (depth - layer.depth) / depth;


      this.ctx.translate(0, depthRate * currHeigth * speedInterval);
      this.ctx.translate(layer.screenPivot.x * this.canvas.width, layer.screenPivot.y * this.canvas.height);
      this.ctx.translate(layer.offset.x * layer.scale, layer.offset.y * layer.scale);
      this.ctx.drawImage(layer.image,
        layer.pivot.x * -fW, layer.pivot.y * -fH,
        fW, fH
      );
      this.ctx.restore();
    })
  }
}

class ObjectLayoutReader {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.imgScale = options.imgScale || [];
    this.coordScale = options.coordScale || 0;
    this.currLayoutIdx = options.currLayoutIdx || 0;
    this.currentOffset = options.currentOffset || { x: 0, y: 0 };
    this.layoutSrc = options.layoutSrc || null;
    this.chooseNextChallenge = options.chooseNextChallenge || null;
    this.layoutsToUse = options.layoutsToUse || null;
    this.objectPrefabs = options.objectPrefabs || [];
    this.mayRise = false;
    this.hasLoaded = false;
    this.velocidade = options.velocidade || 3.5;
  }

  readChallenges() {
    this.layoutReader = new ShipLayoutReader();
    this.layoutReader.load(this.layoutSrc);
    this.transformObjectsValues();
    this.hasLoaded = this.layoutReader.hasLoaded;
    if (this.challengePool.length > 0 && this.chooseNextChallenge) {
      this.chooseNextChallenge();
    }
  }

  transformObjectsValues() {
    // Get Challenges
    // this.currLayoutIdx = this.layoutReader.challenges.length - 1;
    this.layoutReader.challenges.map((challenge, i, arr) => {
      challenge.objects.map((obj, j) => {

        this.objectPrefabs.map(prefab => {
          if (obj.properties.type == prefab.typename) {
            obj.image = prefab.image;
            obj.scale = prefab.scale;
            obj.pivot = prefab.pivot;
            obj.update = prefab.update || null;
            obj.oncollect = prefab.oncollect || null;
            obj.destroy = prefab.destroy || null;
            obj.ondestroy = prefab.ondestroy || null;
            obj.personalRender = prefab.personalRender || null;
            obj.transformed = true;
            obj.mustRender = true;
            obj.prefab = prefab;
            obj.originalPosition = { x: obj.x, y: obj.y }
            // console.log(obj.properties.type, prefab.typename, obj.properties.type == prefab.typename, obj)
            // console.log(obj)
          } else if (obj.properties.type == 'spacing') {
            challenge.startingY = obj.y;
          }
        });
      })
    })
    this.challengePool = this.layoutReader.challenges;

    // Sort Challenges by checkpoint count
    this.challengesByCheckpoints = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: []
    };
    this.challengePool.map(challenge => {
      this.challengesByCheckpoints[challenge.properties.checkpoints].push(challenge);
    })

    // Get questions
    this.layoutReader.questions.map((stage, i, arr) => {
      stage.objects.map((obj, j) => {

        this.objectPrefabs.map(prefab => {
          if (obj.properties.type == prefab.typename) {
            obj.image = prefab.image;
            obj.scale = prefab.scale;
            obj.pivot = prefab.pivot;
            obj.update = prefab.update || null;
            obj.oncollect = prefab.oncollect || null;
            obj.destroy = prefab.destroy || null;
            obj.ondestroy = prefab.ondestroy || null;
            obj.personalRender = prefab.personalRender || null;
            obj.transformed = true;
            obj.mustRender = true;
            obj.prefab = prefab;
            obj.originalPosition = { x: obj.x, y: obj.y }
          } else if (obj.properties.type == 'spacing') {
            stage.startingY = obj.y;
          }
        });
      })
    })
    this.questionPool = this.layoutReader.questions;
  }

  randomNextChallenge() {
    return this.randomNextStage(this.challengePool);
  }

  randomNextQuestion() {
    return this.randomNextStage(this.questionPool, 0);
  }

  randomNextStage(stagePool, yOffset = 0.15) {
    const oldLayout = this.currentChallenge || undefined;
    var tempLayout = undefined;
    // do {
    const tempIdx = randomInt(0, stagePool.length);
    if (tempIdx >= stagePool.length)
      tempIdx = stagePool.length - 1;
    tempLayout = stagePool[tempIdx];
    // } while (tempLayout == oldLayout && this.stagePool.length > 1);
    // if (this.currLayoutIdx >= this.stagePool.length)
    //   this.currLayoutIdx = this.stagePool.length - 1;
    this.currentOffset.y = this.canvas.height * yOffset;

    this.setChallengeInMemory(tempLayout);
    return tempLayout;
  }

  randomNextChallengeByCheckpoints(maxCheckpointsWanted) {
    const targetChallengePool = [];

    for (var i = maxCheckpointsWanted; i >= 0; i--) {
      var targetChallengeGroup = this.challengesByCheckpoints[i];

      // console.log(targetChallengeGroup)

      targetChallengeGroup.map(challenge => {
        targetChallengePool.push(challenge);
      })

    }

    var tempNextChallenge = {}

    const oldName = this.currLayoutIdx;
    do {
      tempNextChallenge = targetChallengePool[randomInt(0, targetChallengePool.length)];
      // consolelog(tempNextChallenge);
    } while (targetChallengePool.length > 1 && tempNextChallenge.name == oldName);

    this.currentOffset.y = this.canvas.height * 0.33;

    this.setChallengeInMemory(tempNextChallenge);
    return this.currentChallenge;
  }

  setChallengeInMemoryByIndex(index) {
    const challengeToCopy = this.challengePool[index];
    this.setChallengeInMemory(challengeToCopy);
  }

  setChallengeInMemory(challenge) {
    var newCurrentChallenge = {
      objects: []
    };

    // console.log(challenge)
    const challengeToCopy = challenge;
    challengeToCopy.objects.map(item => {
      newCurrentChallenge.objects.push(Object.assign({}, item)); //Copia o desafio de um jeito sacana pra permitir modificação sem avacalhar o molde
    });
    newCurrentChallenge.crystalsCollected = 0;
    newCurrentChallenge.startingY = challengeToCopy.startingY;

    this.currentChallenge = newCurrentChallenge;
  }

  render() {
    if (this.hasLoaded) {
      const currentChallenge = this.currentChallenge;
      if (!currentChallenge)
        return;

      var smallerObjectY = Infinity;


      currentChallenge.objects.map(item => {
        if (item.transformed) {
          const currentY = (-item.y * this.coordScale) + this.currentOffset.y - currentChallenge.startingY;

          if (currentY < smallerObjectY)
            smallerObjectY = currentY;

          var fW = item.image.width * item.scale;
          var fH = item.image.height * item.scale;

          var layoutMaxWidth = this.canvas.width * 0.4;
          var layoutxOffset = this.canvas.width * 0.3
          if (window.mobileAndTabletCheck()) {
            layoutMaxWidth = this.canvas.width;
            layoutxOffset = 0;
          }
          var fx = (((item.x) + 8) / (15 * 16)) * layoutMaxWidth + layoutxOffset;
          var fy = currentY;

          var tempScale = 1;
          // if (fy < 0) {
          //   var z = fy * -1;
          //   tempScale = 0.09;
          //   // fx *= 0.03
          //   fy *= -0.12;
          //   fy -= this.canvas.height * 0.1;
          //   fH *= tempScale;
          //   fW *= tempScale;
          //   item.activeCollider = false;
          // } else {
          //   item.activeCollider = true;
          // }
          if (item.activeCollider == undefined)
            item.activeCollider = true;

          // console.singleLog([currentY, smallerObjectY, currentChallenge]);

          // console.log(currentY);
          fx += -item.pivot.x * fW;
          fy += -item.pivot.y * fH;

          item.rectCollider = {
            x: fx,
            y: fy,
            w: fW,
            h: fH
          }

          if (item.animateToCounter) { //Animação movendo e encolhendo para o contador
            if (!item.animateToCounter.orign) {
              item.animateToCounter.orign = {
                x: fx,
                y: fy
              }
            }

            fW *= 0.6;
            fH *= 0.6;

            var targetRect = {
              x: (this.canvas.width / 12) * 11,
              y: this.canvas.height
            };

            var xDist = targetRect.x - fx;
            var yDist = targetRect.y - fy;
            var dist = Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), 0.5);
            // console.log('hehe');
            var motion = {
              x: 0,
              y: 0
            }

            if (item.animateToCounter.orign.x < (targetRect.x - item.animateToCounter.speed))
              motion.x += item.animateToCounter.speed;
            else if (item.animateToCounter.orign.x > (targetRect.x + item.animateToCounter.speed))
              motion.x -= item.animateToCounter.speed;
            else {
              motion.x += xDist;
            }

            if (item.animateToCounter.orign.y < (targetRect.y - item.animateToCounter.speed))
              motion.y += item.animateToCounter.speed;
            else if (item.animateToCounter.orign.y > (targetRect.x + item.animateToCounter.speed))
              motion.y -= item.animateToCounter.speed;
            else {
              motion.y += yDist;
            }

            var tempDirectionTouse = {
              x: xDist / dist,
              y: yDist / dist,
            }
            item.animateToCounter.orign.x += motion.x * Math.abs(tempDirectionTouse.x);
            item.animateToCounter.orign.y += motion.y * Math.abs(tempDirectionTouse.y);

            fx = item.animateToCounter.orign.x;
            fy = item.animateToCounter.orign.y;

            dist = Math.pow(Math.pow(fx - targetRect.x, 2) + Math.pow(fy - targetRect.y, 2), 0.5);

            if (dist <= (item.animateToCounter.speed * 5.5)) {
              item.mustRender = false;
            }
          }

          if (item.mustRender == false) {

          } else {
            if (item.properties.forceNoRender) {
              item.activeCollider = false;
            } else {
              this.ctx.drawImage(item.image,
                fx,
                fy,
                fW,
                fH ,
              )

              if (item.update) {
                item.update(item);
              }
            }
          }

          if (fy - fH >= this.canvas.height && !item.destroyed && item.mustRender) {
            item.destroyed = true;
            if (item.ondestroy)
              item.ondestroy(item);
          }
        }

      })

      if (smallerObjectY > this.canvas.height) {
        this.mayChooseNextChallenge = true;
        if (this.chooseNextChallenge) {
          this.chooseNextChallenge();
        } else {
          this.randomNextChallenge();
        }
      } else {
        this.mayChooseNextChallenge = false;
      }
    }

    if (this.mayRise == true) {
      this.currentOffset.y += this.velocidade;
    }
  }

  checkcollision(rect) {
    var retorno = [];

    if (this.hasLoaded) {
      const currentChallenge = this.currentChallenge;
      if (currentChallenge) {
        currentChallenge.objects.map(item => {
          if (item.rectCollider && item.activeCollider) {
            if (Physics.rectRect(rect, item.rectCollider)) {
              retorno.push(item)
              // console.log(item);
            }
          }
        });
      }
    }

    return retorno;
  }
}

class ChallengeDynamicBuilder {
  constructor(options) {
    this.currentSpeed = options.currentSpeed || 1;
    this.currentCheckpointCount = options.currentCheckpointCount || 0;
    this.generateNewChallengeFromSkeleton = options.generateNewChallengeFromSkeleton || null;
    this.speedStep = options.speedStep || 0.3333; //Quantidade adicionada ou removida de acordo com o nivel de dificuldade
    this.possibleLayouts = [];
    this.chooseNextChallenge = options.chooseNextChallenge || null;
    this.buildChallenge = options.buildChallenge || null;
    this.buildQuestion = options.buildQuestion || null;
    this.param1Range = options.param1Range || [1]
    this.param2Range = options.param2Range || [1, 2, 3, 4, 5, 6, 7, 8, 9]
    this.difficultyInfo = {
      checkpoints: 1,
    };
    this.currentCheckpoints = options.currentCheckpoints || {
      param1: false,
      operation: false,
      param2: false,
      readyToBeSolved: false
    }
    this.updateHUD();
  }

  onCollectCheckpointPiece(piece) {
    if (piece.properties.checkpointValue == '÷') {
      this.currentCheckpoints.operation = piece.properties.checkpointValue;
    } else if (piece.properties.checkpointValue == '=') {
      this.currentCheckpoints.readyToBeSolved = piece.properties.checkpointValue;
    } else {
      if (this.param1Range.indexOf(piece.properties.checkpointValue) != -1 && this.currentCheckpoints.param1 == false) {
        this.currentCheckpoints.param1 = piece.properties.checkpointValue;
      } else {
        this.currentCheckpoints.param2 = piece.properties.checkpointValue;
      }
    }

    // console.log('checkpoint coletado!', piece);
    this.updateHUD();
  }

  decideNextChallenge() {
    console.log('empty function')
  }

  updateHUD() {
    var params = [
      this.currentCheckpoints.param2,
      this.currentCheckpoints.operation,
      this.currentCheckpoints.param1,
      this.currentCheckpoints.readyToBeSolved,
    ]
    var pieces = document.querySelectorAll('.checkpoint .piece');

    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
      if (!params[i]) {
        piece.classList.add('empty');
        piece.classList.add('black');
        piece.innerHTML = '?';
      } else {
        piece.classList.remove('empty');
        piece.classList.remove('black');
        piece.innerHTML = params[i];
      }
    }

    this.updateCheckpointCounter();
  }

  resetCheckpointCounter() {
    this.currentCheckpoints.param1 = false
    this.currentCheckpoints.param2 = false
    this.currentCheckpoints.operation = false
    this.currentCheckpoints.readyToBeSolved = false
    this.updateHUD();
  }

  updateCheckpointCounter() {
    this.currentCheckpointCount = 0;
    if (this.currentCheckpoints.param1 != false)
      this.currentCheckpointCount++;
    if (this.currentCheckpoints.param2 != false)
      this.currentCheckpointCount++;
    if (this.currentCheckpoints.operation != false)
      this.currentCheckpointCount++;
    if (this.currentCheckpoints.readyToBeSolved != false)
      this.currentCheckpointCount++;
  }

  evaluatePlayerAbilityInLastChallenge(report = {
    percentageOfCrystals: 0,
    percentageOfCheckpoints: 0,
    HP: 0
  }) {

  }
}

class HUDCounter {
  constructor(initialAmount, elementID) {
    this.counterToShow = -1;
    this.counter = initialAmount;
    this.element = document.getElementById(elementID);

    this.animationDelayCounter = 0;
    this.animationDelay = 11;
    this.updateHUD();
  }

  increase(amount) {
    this.counter += amount;
    // this.updateHUD();
  }

  decrease(amount) {
    this.counter -= amount;
    // this.updateHUD();
  }

  updateHUD() {
    this.animationDelayCounter++;
    if (this.animationDelayCounter > this.animationDelay) {
      this.animationDelayCounter = 0;
      if (this.counterToShow != this.counter) {
        this.counterToShow = Math.round(lerp(this.counterToShow, this.counter, 0.5));
        if (Math.abs(this.counterToShow - this.counter) <= 2) {
          this.counterToShow = this.counter;
        }
        this.element.innerHTML = this.counterToShow;
      }
    }
  }
}

class FragManager {
  constructor() {
    this.reset();
  }
  reset() {
    this.acertos = 0;
    this.erros = 0;

    this.rightQuestions = [];
    this.wrongQuestions = [];
  }

  incluirAcerto(question) {
    this.acertos++;
    this.rightQuestions.push(question);
  }

  incluirErro(question) {
    this.erros++;
    this.wrongQuestions.push(question);
  }

  getPercentage() {
    return (this.acertos / (this.erros + this.acertos)) * 100;
  }
}

class HeartHUD {
  constructor(heartAmount, selectors, onDie, currentAmount = 1) {
    this.maxHearts = heartAmount;
    this.hearts = currentAmount;
    this.selectors = selectors;
    this.onDie = onDie;
    this.updateHUD();
  }

  applyDamage(amount) {
    this.hearts -= amount;
    if (this.hearts <= 0) {
      this.hearts = 0;
      if (this.onDie)
        this.onDie();
    }
    if (this.hearts > this.maxHearts)
      this.hearts = this.maxHearts

    this.updateHUD();
  }

  recoverDamage(amount) {
    this.hearts += amount;
    if (this.hearts >= this.maxHearts) {
      this.hearts = this.maxHearts;
    }
    this.updateHUD();
  }

  updateHUD() {
    if (!this.heartElements) {
      this.heartElements = [];
      this.selectors.map(selector => {
        this.heartElements.push(document.querySelector(selector));
      })
      this.heartElements.sort((a, b) => {
        const vA = parseInt(a.getAttribute('ordem'));
        const vB = parseInt(b.getAttribute('ordem'));
        if (vA > vB) {
          return 1;
        } else if (vA < vB) {
          return -1;
        }
        return 0;
      });
      // console.log(this.heartElements);
    }

    var heartElements = this.heartElements;

    var currentHeart = 1;
    heartElements.map(heart => {
      const hastEmpty = heart.classList.contains('empty');
      if (currentHeart > this.hearts && !hastEmpty) {
        heart.classList.add('empty');
      }
      else if (currentHeart <= this.hearts && hastEmpty) {
        heart.classList.remove('empty');
      }

      currentHeart++;
    })
  }
}

class AcertosHUD {
  constructor(questionSlotSelector, currentQuestion = 0, onWinCallback = null) {
    this.onWinCallback = onWinCallback;
    this.selector = questionSlotSelector;
    this.slots = document.querySelectorAll(this.selector);
    this.hasWon = false;
    this.data = [];

    for (var i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (this.data.length < currentQuestion) {
        this.data.push(true);
      }
      else
        this.data.push(undefined);
    }
    this.currentQuestion = currentQuestion;
    this.updateHUD();
  }

  checkWin() {
    if (this.hasWon == false) {
      console.log(this.currentQuestion, this.data.length)
      if (this.currentQuestion >= this.data.length) {
        this.hasWon = true;
        if (this.onWinCallback)
          this.onWinCallback();
      }
    }
  }

  pushRightQuestion() {
    if (this.currentQuestion < this.data.length)
      this.data[this.currentQuestion] = true;
    this.currentQuestion++;
    this.checkWin();
  }

  pushWrongQuestion() {
    if (this.currentQuestion < this.data.length)
      this.data[this.currentQuestion] = false;
    this.currentQuestion++;
    this.checkWin();
  }

  clearHUD() {
    this.currentQuestion = 0;
    for (var i = 0; i < this.slots.length; i++) {
      this.data[i] = undefined
      this.slots[i].classList.remove('wrong');
      this.slots[i].classList.remove('correct');
    }
  }

  updateHUD() {
    for (var i = 0; i < this.slots.length; i++) {
      if (this.data[i] == true && !this.slots[i].classList.contains('correct')) {
        this.slots[i].classList.add('correct');
      } else if (this.data[i] == false && !this.slots[i].classList.contains('wrong')) {
        this.slots[i].classList.add('wrong');
      }
    }
  }
}

class RocketCounterHUD {
  constructor(selector, secondsLeft = 1) {
    this.selector = selector;
    this.lastInitialSecondsLeft = secondsLeft;
    this.secondsLeft = this.lastInitialSecondsLeft;
    this.txt = document.querySelector(this.selector);
    this.txt.innerHTML = this.secondsLeft
    this.txt.style.display = 'flex';
    this.txt.classList.remove('started');
  }

  start(onFinishcallback) {
    this.onFinishcallback = onFinishcallback;
    this.txt.classList.add('started');
    for (var i = 0; i < 10; i++) {
      this.txt.classList.remove('t' + i);
    }
    this.txt.classList.add('t' + this.secondsLeft);

    setTimeout(() => {
      this.countDown();
    }, 1000)
  }

  countDown() {
    this.txt.classList.remove('t' + this.secondsLeft);
    this.secondsLeft -= 1;
    this.txt.classList.add('t' + this.secondsLeft);
    this.txt.innerHTML = this.secondsLeft

    if (this.secondsLeft < 0) {
      this.secondsLeft = this.lastInitialSecondsLeft;
      this.txt.innerHTML = this.secondsLeft
      this.txt.style.display = 'none';
      return;
    } else if (this.secondsLeft == 0) {
      this.txt.innerHTML = 'Vai!'
      this.onFinishcallback();
      setTimeout(() => {
        this.countDown();
      }, 2000)
      return;
    }

    setTimeout(() => {
      this.countDown();
    }, 1000)
  }
}

class AudioLooper {
  constructor(audios) {
    this.audios = audios;
    this.tempos = audios.length;
  }

  startLoop() {

  }

  stopLoop() {

  }
}

var instrucoes = (page = 0) => {
  var screens = document.querySelectorAll(".instruction-screen");
  for (var screen of screens) {
    screen.style.display = 'none';
  }

  if (page > 0 && page <= screens.length) {
    const targetSelector = ".instruction-page" + page + "-screen";
    document.querySelector(targetSelector).style.display = 'flex';
  }
}

class FaseManager {
  constructor(stages) {
    this.stages = stages;
  }
}

class ResponsiveRect {
  constructor(options) {
    this.rect = options.rect || { x: () => { return undefined }, y: () => { return undefined }, w: () => { return undefined }, h: () => { return undefined } };
  }

  getRect() {
    return {
      x: this.rect.x(this) || 0,
      y: this.rect.y(this) || 0,
      w: this.rect.w(this) || 0,
      h: this.rect.h(this) || 0,
    }
  }
}

class ArcadePhysicsObject {
  constructor(options) {
    this.position = options.position || { x: 0, y: 0 };
    this.scale = options.scale || { x: 1, y: 1 };
    this.rotation = options.rotation || 0;
    this.pivot = options.pivot || { x: 0.5, y: 0.5 };

    this.image = options.image || { x: 0.5, y: 0.5 };
    this.canvas = options.canvas || undefined;
    this.ctx = options.ctx || undefined;

    this.responsive = options.responsive || undefined;
    this.responsiveScaling = options.responsiveScaling || undefined;
    this.scaler = 1;
  }

  render() {
    this.ctx.save();
    var fW = this.scale.x * this.image.width, fH = this.scale.y * this.image.height;

    if (this.responsiveScaling) {
      this.scaler = this.responsiveScaling(fW, fH) || 1;
      fW *= this.scaler;
      fH *= this.scaler;
    }


    if (this.responsive) {
      this.responsive(this);
    }

    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(degrees_to_radians(this.rotation));
    // this.ctx.translate(layer.screenPivot.x * this.canvas.width, layer.screenPivot.y * this.canvas.height);
    // this.ctx.translate(layer.offset.x * layer.scale, layer.offset.y * layer.scale);
    this.ctx.drawImage(this.image,
      this.pivot.x * -fW, this.pivot.y * -fH,
      fW, fH
    );
    this.ctx.restore();
  }
}

class DistanceSteper {
  constructor(startPoint, endPoint, steps = 6, initialStep = 1) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.steps = steps;
    this.curentStep = initialStep;
    this.currentPosition = initialStep;
    this.easing = .02;
  }

  update() {
    if (this.curentStep != this.currentPosition) {

      var step = Math.sign(this.curentStep - this.currentPosition) *
        this.easing;
      var dist = (this.curentStep - this.currentPosition)
      if (Math.abs(step) > Math.abs(dist)) {
        step = dist;
      }
      this.currentPosition += step;
    }
    //console.log(this.currentPosition)
  }

  goToStep(valor) {
    this.curentStep = valor;
  }

  nextStep() {
    if (this.curentStep + 1 <= this.steps) {
      this.goToStep(this.curentStep + 1)
    }
  }
}

class ContaHUD {
  constructor(options = {}) {
    if (options.selector)
      this.element = document.querySelector(options.selector);
  }

  setOp(conta) {
    if (this.element) {
      this.element.innerHTML = conta.q;
    }

    // console.log(conta, this.element)
    this.conta = conta;
  }

  checaConta(valor) {
    if (this.conta.r == parseInt(valor)) {
      return true
    } else {
      return false
    }
  }
}

// ========================================================= HUDs

class CertoErradoVaciloHUD {
  constructor(args) {

  }
}