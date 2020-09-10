"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

var AnimationObjectTypes = {
  NONE: -1,
  IMAGE: 0
};

var AnimationObject = /*#__PURE__*/function () {
  function AnimationObject(type, keyframe) {
    var _this = this;

    _classCallCheck(this, AnimationObject);

    this.type = type;
    this.id = keyframe.targetID;

    switch (this.type) {
      case AnimationObjectTypes.IMAGE:
        {
          this.imgLoaded = false;
          this.image = new Image();
          this.image.src = "./img/" + keyframe.src;
          this.image.addEventListener('load', function () {
            _this.imgLoaded = true;
          });
          this.transform = keyframe.transform;
        }
    }
  }

  _createClass(AnimationObject, [{
    key: "render",
    value: function render(canvas, usedContext, deltaTime, currentTime) {
      var expectedWidth = 1024;
      var expectedHeight = 700;
      var scale = {
        x: canvas.width / expectedWidth,
        y: canvas.height / expectedHeight
      };

      switch (this.type) {
        case AnimationObjectTypes.IMAGE:
          {
            if (this.imgLoaded) {
              usedContext.save();

              if (this.keyframeTween && !this.keyframeTween.started) {
                this.keyframeTween.started = true;
                this.keyframeTween.timePassed = 0;
              }

              var centerPoint = {
                x: this.transform.x(this.image, canvas, scale, this.transform),
                y: this.transform.y(this.image, canvas, scale, this.transform)
              };
              var opacity = this.transform.opacity ? this.transform.opacity() : 1;

              if (this.keyframeTween) {
                var currentTween = this.keyframeTween.tween[0];
                var fraction = (currentTime - this.keyframeTween.doAt) / currentTween.delay;
                if (fraction > 1) fraction = 1;
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

              usedContext.translate(centerPoint.x, centerPoint.y); // if (this.transform.r) {
              // }

              usedContext.globalAlpha = opacity;
              usedContext.drawImage(this.image, 0, 0, this.transform.w(this.image, canvas, scale, this.transform), this.transform.h(this.image, canvas, scale, this.transform));
              usedContext.restore();
            }
          }
          break;
      }
    }
  }, {
    key: "setTweenKeyframe",
    value: function setTweenKeyframe(keyframe) {
      this.keyframeTween = keyframe;
    }
  }]);

  return AnimationObject;
}();

var engineStates = {
  NONE: -1,
  START: 0,
  PLAYING: 1,
  FINISHED: 2
};

var AnimationEngine = /*#__PURE__*/function () {
  function AnimationEngine(keyframes, canvas) {
    _classCallCheck(this, AnimationEngine);

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

  _createClass(AnimationEngine, [{
    key: "play",
    value: function play() {
      this.timeScale = this.lastTimeScale;
    }
  }, {
    key: "pause",
    value: function pause() {
      this.lastTimeScale = this.timeScale;
      this.timeScale = 0;
    }
  }, {
    key: "start",
    value: function start() {
      this.engineState = engineStates.START;
      this.gameLoop();
    }
  }, {
    key: "newFrame",
    value: function newFrame() {
      var deltaTime = Math.abs(performance.now() - this.lastExecution) / 1000; //tempo em segundos

      this.lastExecution = performance.now();
      this.gameLoop(deltaTime);
    }
  }, {
    key: "playKeyframe",
    value: function playKeyframe(keyframe) {
      switch (keyframe.action) {
        case Actions.SpawnImage:
          {
            var novaImagem = new AnimationObject(AnimationObjectTypes.IMAGE, keyframe);
            this.animationObjects.push(novaImagem);
          }
          break;

        case Actions.TransformImage:
          {
            this.animationObjects.map(function (obj) {
              if (keyframe.targetID == obj.id) {
                obj.setTweenKeyframe(keyframe);
              }
            });
          }
          break;

        case Actions.EndAnimation:
          {
            console.log('fim!');
            this.engineState = engineStates.FINISHED;
          }
          break;
      }

      keyframe.played = true;
    }
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      var _this2 = this;

      var deltaTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.timeCounter += deltaTime * this.timeScale; // if (this.timeCounter < 0) {
      //   document.querySelector('.carregando').style.display = 'flex';
      // } else {
      //   document.querySelector('.carregando').style.display = 'none';
      // }
      // Evolve States

      switch (this.engineState) {
        case engineStates.START:
          {
            this.engineState = engineStates.PLAYING;
          }
          break;

        case engineStates.PLAYING:
          {
            this.keyframes.map(function (frame) {
              if (!frame.played) {
                if (frame.doAt <= _this2.timeCounter) {
                  _this2.playKeyframe(frame);
                }
              }
            });
          }
          break;

        case engineStates.FINISHED:
          {
            document.getElementById('nextPage').style.display = 'flex';
          }
          break;
      } // Prints State


      this.animationObjects.map(function (obj) {
        obj.render(_this2.canvas, _this2.ctx, deltaTime, _this2.timeCounter);
      });
      window.requestAnimationFrame(function () {
        _this2.newFrame();
      });
    }
  }]);

  return AnimationEngine;
}();

var Actions = {
  Empty: -1,
  SpawnImage: 0,
  TransformImage: 1,
  PlayAudio: 2,
  HideImage: 3,
  EndAnimation: 4
};