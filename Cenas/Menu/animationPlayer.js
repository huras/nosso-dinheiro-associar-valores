function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

const AnimationObjectTypes = {
  NONE: -1,
  IMAGE: 0,
};
class AnimationObject {
  constructor(type, keyframe) {
    this.type = type;
    this.id = keyframe.targetID;

    switch (this.type) {
      case AnimationObjectTypes.IMAGE: {
        this.imgLoaded = false;
        this.image = new Image();
        this.image.src = "./img/" + keyframe.src;
        this.image.addEventListener('load', () => {
          this.imgLoaded = true;
        });
        this.transform = keyframe.transform;
      }
    }
  }

  render(canvas, usedContext, deltaTime, currentTime) {
    const expectedWidth = 1024;
    const expectedHeight = 700;

    const scale = {
      x: canvas.width / expectedWidth,
      y: canvas.height / expectedHeight,
    }


    switch (this.type) {
      case AnimationObjectTypes.IMAGE: {
        if (this.imgLoaded) {
          usedContext.save();

          if (this.keyframeTween && !this.keyframeTween.started) {
            this.keyframeTween.started = true;
            this.keyframeTween.timePassed = 0;
          }

          var centerPoint = {
            x: this.transform.x(this.image, canvas, scale, this.transform),
            y: this.transform.y(this.image, canvas, scale, this.transform)
          }

          var opacity = (this.transform.opacity) ? this.transform.opacity() : 1;

          if (this.keyframeTween) {
            const currentTween = this.keyframeTween.tween[0];

            var fraction = (currentTime - this.keyframeTween.doAt) / currentTween.delay;
            if (fraction > 1)
              fraction = 1;

            var tweenTransform = currentTween.transform;

            if (tweenTransform.x) {
              centerPoint.x = lerp(centerPoint.x, tweenTransform.x(this.image, canvas, scale, tweenTransform), fraction);
            }
            if (tweenTransform.y) {
              centerPoint.y = lerp(centerPoint.y, tweenTransform.y(this.image, canvas, scale, tweenTransform), fraction);
            }
            if (tweenTransform.opacity) {
              opacity = lerp(opacity, tweenTransform.opacity(), fraction);
            }

            if (fraction == 1) {
              this.keyframeTween = undefined;
              if (tweenTransform.x) {
                this.transform.x = tweenTransform.x;
              }
              if (tweenTransform.y) {
                this.transform.y = tweenTransform.y;
              }
              if (tweenTransform.opacity) {
                this.transform.opacity = tweenTransform.opacity;
              }
            }
          }

          usedContext.translate(
            centerPoint.x,
            centerPoint.y
          );

          // if (this.transform.r) {

          // }

          usedContext.globalAlpha = opacity;
          usedContext.drawImage(
            this.image,

            0,
            0,
            this.transform.w(this.image, canvas, scale, this.transform),
            this.transform.h(this.image, canvas, scale, this.transform),
          );

          usedContext.restore();
        }
      } break;
    }
  }

  setTweenKeyframe(keyframe) {
    this.keyframeTween = keyframe;
  }
}

const engineStates = {
  NONE: -1,
  START: 0,
  PLAYING: 1,
  FINISHED: 2,
};
class AnimationEngine {

  constructor(keyframes, canvas) {
    this.engineState = engineStates.NONE;
    this.keyframes = keyframes;
    this.timeCounter = -0.5; // in seconds
    this.lastExecution = performance.now();
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.timeScale = 0;
    this.lastTimeScale = 1;

    this.animationObjects = [];
  }

  play() {
    this.timeScale = this.lastTimeScale;
  }

  pause() {
    this.lastTimeScale = this.timeScale;
    this.timeScale = 0;
  }

  start() {
    this.engineState = engineStates.START;
    this.gameLoop();
  }

  newFrame() {
    var deltaTime = Math.abs(performance.now() - this.lastExecution) / 1000; //tempo em segundos
    this.lastExecution = performance.now();
    this.gameLoop(deltaTime);
  }

  playKeyframe(keyframe) {

    switch (keyframe.action) {
      case Actions.SpawnImage: {
        var novaImagem = new AnimationObject(AnimationObjectTypes.IMAGE, keyframe);
        this.animationObjects.push(novaImagem);
      } break;

      case Actions.TransformImage: {
        this.animationObjects.map(obj => {
          if (keyframe.targetID == obj.id) {
            obj.setTweenKeyframe(keyframe);
          }
        })
      } break;

      case Actions.EndAnimation: {
        console.log('fim!');
        this.engineState = engineStates.FINISHED;
      } break;
    }

    keyframe.played = true;
  }

  gameLoop(deltaTime = 0) {
    this.timeCounter += deltaTime * this.timeScale;

    // if (this.timeCounter < 0) {
    //   document.querySelector('.carregando').style.display = 'flex';
    // } else {
    //   document.querySelector('.carregando').style.display = 'none';
    // }

    // Evolve States
    switch (this.engineState) {
      case engineStates.START: {
        this.engineState = engineStates.PLAYING;
      } break;
      case engineStates.PLAYING: {

        this.keyframes.map(frame => {
          if (!frame.played) {
            if (frame.doAt <= this.timeCounter) {
              this.playKeyframe(frame);
            }
          }
        })

      } break;
      case engineStates.FINISHED: {
        document.getElementById('nextPage').style.display = 'flex';
      } break;
    }

    // Prints State
    this.animationObjects.map(obj => {
      obj.render(this.canvas, this.ctx, deltaTime, this.timeCounter);
    })

    window.requestAnimationFrame(() => {
      this.newFrame();
    });
  }
}

const Actions = {
  Empty: -1,
  SpawnImage: 0,
  TransformImage: 1,
  PlayAudio: 2,
  HideImage: 3,
  EndAnimation: 4
};