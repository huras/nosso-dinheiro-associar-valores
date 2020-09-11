// =================================================== External Funcitons


function loadNewScene() {
  alert("loadNewScene está vazio");
}

function onFinishGame() {
  console.log("undefined function");
}

function showResults() {
  console.log("undefined function");
  engine.engineState = engineStates.RESULT;
}

function setFrag(frag) {
  engine.frag = frag;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function somEnunciado() {
  if (sounds.sfx.ingameEnunciado) { // Dá play num som
    sounds.sfx.ingameEnunciado.currentTime = 0;
    sounds.sfx.ingameEnunciado.play();
    sounds.sfx.ingameEnunciado.muted = false;
  }
}

function dragEnd(ev) {
  return;
  var data = lala;
  if (lala != undefined) {
    //console.log(data)
    if (!engine.contaHUD.checaConta(parseInt(data))) {
      engine.onVacilarResposta()
    }
  }
  lala = undefined;
}

function dragStart(ev) {
  const moedaValor = ev.target.getAttribute('valor')
  ev.dataTransfer.setData("valor", moedaValor);
  ev.dataTransfer.setData("coinElement", ev.target);

  if (window.mobileAndTabletCheck()) {
    const img = new Image();
    img.src = ev.target.querySelector('img').getAttribute('src');
    ev.dataTransfer.setDragImage(img, 35, 35);
  }
}

function drop(ev) {
  ev.preventDefault();

  var moeda = parseInt(ev.dataTransfer.getData("valor"));
  var posicao = ev.target.getAttribute('posicaoPorquinho')
  var porco = (rodadas[rodadaAtual])[posicao]
  porco.element = ev.target.parentElement
  // alert(data)
  // if (engine.onDarResposta(parseInt(data))) {
  //   ev.target.innerHTML = data;
  //   ev.target.classList = ev.dataTransfer.getData("color");
  //   ev.target.classList.add('local-resp')
  // }
  // lala = undefined;  

  if (porco.concluido != true)
    regra1(moeda, porco)
}

var loadedData = undefined;
function loadPreviousStageData(dados) {

  if (engine) {
    if (loadedData != undefined) {
      if (loadedData.repescagens == undefined) {
        engine.repescagens = 0;
      } else {
        engine.repescagens = loadedData.repescagens + 1;
      }

      var maxJogadas = repescagens.length - 1;
      document.getElementById('vezes-r').innerHTML = (maxJogadas - engine.repescagens);
      if (engine.repescagens >= maxJogadas) {
        document.getElementById('btn-repescar').style.display = 'none';
      }

      console.log(engine.repescagens);
    }
  }
}

// =================================================== Engine Base

const jogada = (valor) => {
  engine.onDarResposta(valor)
}

// =================================================== Engine Base

const drawColliders = false;
const debugEngine = false;
const revivePrice = 1;
var revives = 3;
var engineLife = 0;

const canvas = document.getElementById("canvas");
const canvasInt = new CanvasInterface({
  canvas: canvas,
  pixelBeauty: false
})

const engineStates = {
  StagePlaying: 0,
  LOADING: 1,

  WAITING_NEW_SCENE: 99,
};

class GameEngine {
  constructor(ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.engineState = undefined;
    this.animationCounter = 0;
    this.lastExecution = undefined;

    this.fpsBuffer = [];
    this.maxFPSBuffer = 10;
  }

  registerEvents() {
    canvas.addEventListener(
      "mousedown",
      (event) => {
        this.touchOrClickCanvas(event, true);
      },
      false
    );
    canvas.addEventListener(
      "touchstart",
      (event) => {
        this.touchOrClickCanvas(event, true);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      (event) => {
        this.touchOrClickCanvas(event, false);
        this.botaoClicado = false;
      },
      false
    );
    canvas.addEventListener(
      "touchend",
      (event) => {
        this.touchOrClickCanvas(event, false);
        this.botaoClicado = false;
      },
      false
    );
  }

  changeState(newState) {
    switch (newState) {
      case engineStates.StagePlaying:
        this.hasGameloop = true;
        this.engineState = newState;
        break;
      case engineStates.LOADING:
        this.engineState = newState;
        break;
      case engineStates.WAITING_NEW_SCENE:
        this.hasGameloop = false;
        this.engineState = newState;
        break;

      default:
        break;
    }
  }

  start() {
    if (debugEngine)
      console.log('Engine iniciada!');

    showHUDs();
    document.querySelector('body').classList.add('fundo-money')

    this.changeState(engineStates.StagePlaying);
    this.gameLoop();
    somEnunciado();
  }

  gameLoop() {
    var deltaTime = 0;
    if (this.lastExecution != undefined) {
      deltaTime = Math.abs(performance.now() - this.lastExecution) / 1000; //tempo em segundos
    }
    this.lastExecution = performance.now();

    this.layout = window.mobileAndTabletCheck() ? "mobile" : "desktop";
    this.layout2 = window.mobileAndTabletCheck() ? "m" : "d";

    // this.fps = 1 / (deltaTime / 1000);
    // if (this.fpsBuffer.length + 1 > this.fpsmaxFPSBuffer) {
    //   this.fpsBuffer.splice(0, 1);
    // }
    // if (this.fps != Infinity)
    //   this.fpsBuffer.push({ fps: this.fps, deltaTime: deltaTime });

    this.tempDeBotaoClicado++;
    this.animationCounter++;
    if (this.animationCounter > 9999999) {
      this.animationCounter = 0;
    }

    // this.update(deltaTime / (1 / 30));
    this.update(1);

    if (this.hasGameloop) {
      window.requestAnimationFrame(() => {
        this.hasGameloop = true;
        this.gameLoop();
      });
    }
  }

  touchOrClickCanvas(event, clickValue = true) {

    // Get X and Y dop mouse / toque
    var x = 0;
    if (event.touches) {
      if (event.touches.length > 0)
        x = event.touches[0].pageX
      else
        x = event.pageX;
    }
    else
      x = event.pageX;

    var y = event.touches ? event.touches.length > 0 ? event.touches[0].pageY : event.pageY
      : event.pageY;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // this.checkEnunciadoBtnClick(x, y);

    // Frescuras pra possibilitar que a leitura do toque / clique seja impedida
    // if (document.fullscreenElement == null && this.layout == 'mobile') {
    //   return;
    // }

    // if (this.mayDrag == false) {
    //   return;
    // }
    // if (this.mayReadClick == false)
    //   return;

    // Processa clique / desclique
    if (clickValue == true) {

    } else {

    }
  }

  // =========================== renderizar  

  onLoadStage(stage = 1) {
    this.engineLife = engineLife;
    this.currentStage = stage;
    this.currentScene = 'fase' + stage;
    this.firstFrame(stage);
    this.changeState(engineStates.StagePlaying);
    document.querySelector('.gameover-screen').style.display = 'none'; //Esconde tela de gameover
    // document.querySelector('.menu-screen').style.display = 'none'; //Esconde tela de menu
  }

  firstFrame(stageToLoad = 1) {
    // === Set Inputs
    this.inputManager = new InputManager({
      right: InputManager.Keys.Right_Arrow,
      left: InputManager.Keys.Left_Arrow,
      up: InputManager.Keys.Up_Arrow,
      down: InputManager.Keys.Down_Arrow,
    });

    // this.analogic = new TouchAnalogic({
    //   canvas: this.canvas,
    //   ctx: this.ctx,
    //   margin: 24,
    //   radius: 65,
    //   personalizedImage: {
    //     image: analogicCircle,
    //     scale: 0.1,
    //     arrow: chevronup
    //   }
    // });

    // === Set Layout    

    this.arcadeObjs = [];

    // === Set HUD
    this.crystalCounter = new HUDCounter(revives, 'txt_qtd-moedas');
    this.frag = new FragManager();
    this.heartHUD = new HeartHUD(3, ['#vida1', '#vida2', '#vida3'], args => { onGameOver() }, 3); // this.heartHUD = new HeartHUD(3, ['#vida1', '#vida2', '#vida3']);
    this.contaHUD = new ContaHUD({ selector: '#continha' });

    document.querySelector('.certo-ou-errado .certo').classList.add('escondido')
    document.querySelector('.certo-ou-errado .errado').classList.add('escondido')

    // === Eventos importantes no jogo
    this.onDarResposta = (respostaDada) => {

      var ret = this.contaHUD.conta.resposta == respostaDada;
      if (ret) {
        this.onAcertarQuestao(respostaDada, this.contaHUD.conta.resposta, this.contaHUD.conta.valores)
      } else {
        this.onErrarQuestao(respostaDada, this.contaHUD.conta.resposta, this.contaHUD.conta.valores)
      }

      return ret
    }

    this.onLoadPergunta = (pergunta) => {
      this.contaHUD.setOp(pergunta)

      // var pergunta = JSON.parse(JSON.stringify(this.perguntas[this.perguntaAtual]));

      // pergunta.o.push(pergunta.r)
      // pergunta.o = shuffle(pergunta.o)
    }

    this.onVacilarResposta = () => {
      mostraCertoOuErrado("atencao")
      if (sounds.sfx.wrongAnswer) { // Dá play num som
        sounds.sfx.wrongAnswer.currentTime = 0;
        sounds.sfx.wrongAnswer.play();
        sounds.sfx.wrongAnswer.muted = false;
      }
    }

    this.onAcertarQuestao = (answerGiven, rightAnswer, questionString) => {
      this.frag.incluirAcerto({
        questionString: questionString,
        rightAnswer: rightAnswer,
        answerGiven: answerGiven
      });

      mostraCertoOuErrado(true)

      if (sounds.sfx.rightAnswer) { // Dá play num som
        sounds.sfx.rightAnswer.currentTime = 0;
        sounds.sfx.rightAnswer.play();
        sounds.sfx.rightAnswer.muted = false;
      }

      setTimeout(() => {
        document.querySelector('.money-pieces').classList.add('rolarEsquerda')
        document.querySelector('#alternativas-target').classList.add('rolarDireita')
      }, 2500)

      rodadaAtual++;
      setTimeout(() => {
        if (rodadaAtual >= rodadas.length) {
          engine.onWinGame();
        } else {
          montaPergunta(rodadas[rodadaAtual]);
          document.querySelector('.money-pieces').classList.remove('rolarEsquerda')
          document.querySelector('#alternativas-target').classList.remove('rolarDireita')
        }
      }, 3500)
    }
    this.onErrarQuestao = (answerGiven, rightAnswer, questionString, removeLife = true) => {
      this.frag.incluirErro({
        questionString: questionString,
        rightAnswer: rightAnswer,
        answerGiven: answerGiven
      });

      mostraCertoOuErrado(false)

      engine.heartHUD.applyDamage(1);
      engine.heartHUD.updateHUD();

      if (sounds.sfx.wrongAnswer) { // Dá play num som
        sounds.sfx.wrongAnswer.currentTime = 0;
        sounds.sfx.wrongAnswer.play();
        sounds.sfx.wrongAnswer.muted = false;
      }
    }
    const onColetarCrystal = (crystalValue, col) => {
      col.mustRender = true;
      col.activeCollider = false;
      const icon = document.querySelector('#crystal-icon');
      var clientRectangle = icon.getBoundingClientRect();
      col.animateToCounter = {
        rect: clientRectangle,
        speed: 10,
      };

      switch (crystalValue) {
        case 1:
          this.crystalCounter.increase(1);

          if (sounds.sfx.crystalPickup) {
            sounds.sfx.crystalPickup.currentTime = 0;
            sounds.sfx.crystalPickup.play();
            sounds.sfx.crystalPickup.muted = false;
            sounds.sfx.crystalPickup.volume = 0.35;
          }
          break;
        case 5:
          this.crystalCounter.increase(5);

          if (sounds.sfx.safiraPickup) {
            sounds.sfx.safiraPickup.currentTime = 0;
            sounds.sfx.safiraPickup.play();
            sounds.sfx.safiraPickup.muted = false;
            sounds.sfx.safiraPickup.volume = 0.45;
          }
          break;

        default:
          break;
      }


    }
    const onGameOver = () => {
      console.log('guemeouver')
      engineLife++;

      document.querySelector('.gameover-screen').style.display = 'flex'; //Exibe tela de gameover

      // Checa se jogador tem dinheiro o suficiente para reviver

      if (this.crystalCounter.counter < revivePrice) {
        document.querySelector(".continuar-button").style.display = 'none'
      } else {
        document.querySelector(".continuar-button").style.display = 'flex'
      }

      // sounds.sfx.nakaOST.play();
      // this.engineSoundOn = false;
    }
    this.onPauseGame = () => {
      this.gamepaused = true;
      // console.log('pause')
      document.querySelector('.pause-btn').style.display = 'none'; //Bloqueia botão de pausa
      document.querySelector('.pause-screen').style.display = 'flex'; //Exibe tela de pausa


    }
    this.onUnpauseGame = () => {
      this.gamepaused = false;
      // console.log('unpause')
      document.querySelector('.pause-btn').style.display = 'flex'; //Libera botão de pausa
      document.querySelector('.pause-screen').style.display = 'none'; //Esconde tela de pausa


    }
    this.onWinGame = () => {
      document.querySelector('.result-screen').style.display = 'flex'; //Exibe a tela de resultado

      document.querySelector('.rodada').classList.add('hidden');

      // var percentage = (this.acertosHUD.slots.length + this.heartHUD.hearts) / (this.acertosHUD.slots.length + this.heartHUD.maxHearts)
      var percentage = this.frag.getPercentage();
      document.querySelector('#nota-final').innerHTML = percentage.toFixed(0) + '%';
      showScreen('.result-screen');
      console.log("You're a win!");

    }
    this.tryToBuyRevive = () => {
      if (this.crystalCounter.counter >= revivePrice) {
        this.crystalCounter.decrease(revivePrice);
        this.onRevive();
      }
    }
    this.onRevive = () => {
      this.heartHUD.recoverDamage(3);
      document.querySelector('.gameover-screen').style.display = 'none'; //Exibe tela de gameover

      document.querySelector('.money-pieces').classList.remove('rolarEsquerda')
      document.querySelector('#alternativas-target').classList.remove('rolarDireita')
    }
    this.onResetGame = () => {
      // document.querySelector('.result-screen').style.display = 'none'; //Esconde a tela de resultado
      this.closeAllScreens();
      this.firstFrame();
    }
    this.closeAllScreens = () => {
      document.querySelector('.pause-screen').style.display = 'none'; //Esconde tela
      document.querySelector('.gameover-screen').style.display = 'none';
      document.querySelector('.result-screen').style.display = 'none';
      document.querySelector('.menu-screen').style.display = 'none';
    }
    this.irParaMenuPrincipal = () => {
      this.hasGameloop = false;
      onGameOver();
      this.onPauseGame();
      this.changeState(engineStates.WAITING_NEW_SCENE);
      this.closeAllScreens();
      document.querySelector('.menu-screen').style.display = 'flex'; //Esconde tela de menu
    }
    this.onRepescagem = () => {
      document.querySelector('.money-pieces').classList.remove('rolarEsquerda')
      document.querySelector('#alternativas-target').classList.remove('rolarDireita')
      this.frag.reset();
    }

    // =========================== Filminho inicial   
  }

  update(deltaTime) {
    if (this.layout2 == 'm') {
      document.body.classList.add("mobile");
    }

    // console.log(this.currentScene)
    this.generalScale = 1;
    this.layoutIsMobile = window.mobileAndTabletCheck();

    if (this.currentScene == 'fase1') {
      // Define number of Lanes for Layout
      // Advance or Generate Layout
      if (this.gamepaused != true) {

        if (this.crystalCounter)
          this.crystalCounter.updateHUD();
      }

      this.tryRenderThings();
    }
  }

  tryRenderThings() {
    //Draw Cenario
    // this.ceu.render(); // Sky BG    
    // this.layeredBackground.render(); // Layered BG
    if (this.arcadeObjs) {
      this.arcadeObjs.map(obj => {
        obj.render();
      })
    }
    //Draw Enfeites        

    //Obstacles 
    //Pickups    
    //Draw Equation Progress
    //Draw Score
    // this.DesenhaFPS();

    // this.analogic.render();
  }

  DesenhaFPS() {
    var fontSize = 36;
    this.ctx.font = fontSize + "px sans-serif";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 1;

    var mediaFPS = 0;
    var mediaDeltaTime = 0;

    this.fpsBuffer.map(amostra => {
      mediaFPS += amostra.fps;
      mediaDeltaTime += amostra.deltaTime;
    })

    if (this.fpsBuffer.length > 0) {
      mediaFPS = mediaFPS / this.fpsBuffer.length;
      mediaDeltaTime = mediaDeltaTime / this.fpsBuffer.length;
    }

    // this.ctx.fillText(mediaFPS.toFixed(0) + ' FPS, ' + (mediaDeltaTime * 1000).toFixed(1) + 'ms, ', 15, 25, this.canvas.width);
    // this.ctx.strokeText(mediaFPS.toFixed(0) + ' FPS, ' + (mediaDeltaTime * 1000).toFixed(1) + 'ms, ', 15, 25, this.canvas.width);

    this.ctx.fillText(this.fps.toFixed(0) + ' FPS', 15, 25, this.canvas.width);
    this.ctx.strokeText(this.fps.toFixed(0) + ' FPS', 15, 25, this.canvas.width);
  }
  // ==================================
}

// ===========================================================================================================

const forceFullscreen = true;
var forcedOrientation = undefined;
canvas.addEventListener("click", function () {
  if (!document.fullscreenElement && forceFullscreen) {
    openFullscreen(document.querySelector('body'));
    // return;
    if (forcedOrientation) {
      if (screen.orientation.lock) {
        screen.orientation.lock(forcedOrientation);
      }
      else {
        screen.lockOrientationUniversal = screen.orientation.lock || screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        screen.lockOrientationUniversal(forcedOrientation)
      }
    }
  }
}, false);

// ========================================= Carrega recursos
var sheetLoader = new SheetLoader();
// Scenery

// UI
const chevronup = sheetLoader.queueSheet('../../img/game/chevron-up-solid.svg');
const analogicCircle = sheetLoader.queueSheet('../../img/ui/analogicCircle.png');
// const fundo50reais = sheetLoader.queueSheet('../../img/game/fundo50reais.png');


// ======================= Audio Loading
var sounds = {
  desbloqueados: false,
  sfx: {
    crystalPickup: document.getElementById("SFX-crystalPickup"),
    checkpointPickup: document.getElementById("SFX-checkpointPickup"),
    safiraPickup: document.getElementById("SFX-safiraPickup"),
    // nakaOST: document.getElementById("OST-naka"),
    rightAnswer: document.getElementById("SFX-rightAnswer"),
    wrongAnswer: document.getElementById("SFX-wrongAnswer"),
    ingameEnunciado: document.getElementById("ingame-enunciado"),
  },
  ost: {

  }
}
var ostStarted = false;
function startOST() {
  if (!ostStarted) {
    ostStarted = true;
    sounds.sfx.nakaOST.play();
    sounds.sfx.nakaOST.muted = false;
    sounds.sfx.nakaOST.play();
    sounds.sfx.nakaOST.muted = false;
    sounds.sfx.nakaOST.volume = 0.5;
  }
}
var ativarSounds = () => {
  startOST();
  engine.engineAudioLoop();

  if (!sounds.allSoundsDescloqueados) {
    var soundsToDesbloquear = 0;
    var soundsDesbloqueados = 0;
    for (var sound in sounds.sfx) {
      if (Object.prototype.hasOwnProperty.call(sounds.sfx, sound)) {
        soundsToDesbloquear++;
        if (!sound.desbloqueado) {
          soundsDesbloqueados++;
          sound.currentTime = 0.99 * sound.duration;
          sound.play();
          // sound.volume = 0.6;
          sound.muted = false;
          sound.desbloqueado = true;
        } else {
          soundsDesbloqueados++;
        }
      }
      if (soundsToDesbloquear == soundsDesbloqueados) {
        sounds.allSoundsDescloqueados = true;
      }
    }
  }
}
const showScreen = (screenSelector) => {
  document.querySelector(screenSelector).style.display = 'flex';
}

const hideScreen = (screenSelector) => {
  document.querySelector(screenSelector).style.display = 'none';
}

const mostraCertoOuErrado = (valor, callback, timeout = 2500) => {
  escondeCertoErrado();
  if (valor == 'certo' || valor == true) { //  Certo
    document.querySelector('.certo-ou-errado .errado').classList.add('escondido')
    setTimeout(() => {
      document.querySelector('.certo-ou-errado .certo').classList.add('escondido')

      if (callback) {
        callback();
      }
    }, timeout);

    var certo = document.querySelector('.certo-ou-errado .certo')
    certo.classList.remove('escondido')
  } else if (valor == 'errado' || valor == false) { // Errado

    document.querySelector('.certo-ou-errado .errado').classList.remove('escondido')
    setTimeout(() => {
      document.querySelector('.certo-ou-errado .errado').classList.add('escondido')

      if (callback) {
        callback();
      }
    }, timeout)
    // escondeCertoErrado();

  } else if (valor == 'atencao') {
    document.querySelector('.certo-ou-errado .atencao').classList.remove('escondido')
    setTimeout(() => {
      document.querySelector('.certo-ou-errado .atencao').classList.add('escondido')

      if (callback) {
        callback();
      }
      escondeCertoErrado();
    }, timeout)

  }
};

const escondeCertoErrado = () => {
  document.querySelector('.certo-ou-errado .certo').classList.add('escondido')
  document.querySelector('.certo-ou-errado .errado').classList.add('escondido')
  document.querySelector('.certo-ou-errado .atencao').classList.add('escondido')
}

// window.addEventListener('load', () => {
//   // window.addEventListener('mousemove', () => {
//   //   // ativarSounds();
//   //   startOST();
//   // })
//   // window.addEventListener('touchstart', () => {
//   //   // ativarSounds();
//   //   startOST();
//   // })
// })

var repescadasFeitas = 0
const montaRepescagem = (repescagem) => {
  engine.onRepescagem();
  hideScreen('.result-screen')
  rodadaAtual = 0;
  rodadas = shuffle(repescagem)
  montaPergunta(rodadas[rodadaAtual])

  var maxJogadas = repescagens.length - 1;
  var vezesWrapper = document.getElementById('vezes-r');
  vezesWrapper.innerHTML = (maxJogadas - repescadasFeitas);
  if (repescadasFeitas >= maxJogadas) {
    document.getElementById('btn-repescar').style.display = 'none';
  }
  repescadasFeitas += 1
}

const proximaRepescagem = () => {
  repescagemAtual++
  montaRepescagem(repescagens[repescagemAtual])
}

Math.random();

var repescagemAtual = 0
var repescagens = shuffle([
  [ //repescagem 0

    //rodada1
    {
      valores: [500, 1000, 50],
      alternativas: [125, 85, 75, 1250]
    },

    //rodada2
    {
      valores: [500, 1000],
      alternativas: [1100, 2000, 1500, 1050]
    },

    //rodada3
    {
      valores: [200, 200, 50, 5],
      alternativas: [375, 455, 475, 500]
    },

    //rodada4
    {
      valores: [50, 10, 500, 5],
      alternativas: [470, 565, 535, 550]
    },
  ],

  [ //repescagem 1

    //rodada1
    {
      valores: [200, 1000, 50],
      alternativas: [1250, 850, 750, 1205]
    },

    //rodada2
    {
      valores: [500, 25, 200],
      alternativas: [555, 6100, 725, 650]
    },

    //rodada3
    {
      valores: [200, 2000, 10, 10, 25],
      alternativas: [2245, 2205, 2175, 2155]
    },

    //rodada4
    {
      valores: [1000, 2000, 100, 5],
      alternativas: [3105, 2590, 2675, 3030]
    },

  ],

  [ //repescagem 2

    //rodada1
    {
      valores: [200, 50, 500],
      alternativas: [555, 6100, 725, 650]
    },

    //rodada2
    {
      valores: [200, 50, 1000],
      alternativas: [555, 625, 1025, 1250]
    },

    //rodada3
    {
      valores: [25, 2000, 10, 10, 25],
      alternativas: [2245, 2205, 2175, 2155]
    },

    //rodada4
    {
      valores: [500, 2000, 100, 5],
      alternativas: [3105, 3130, 2605, 3030]
    },

  ],

]);

var letrasPerguntas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var rodadas = []
var rodadaAtual = 0
const baseAddress = '../../';

function montaPergunta(pergunta) {
  pergunta.resposta = pergunta.valores.reduce((acc, val) => {
    return acc += val;
  })
  if (pergunta.alternativas.indexOf(pergunta.resposta) == -1) {
    pergunta.alternativas[0] = pergunta.resposta;
  }

  var target = document.querySelector('#alternativas-target');
  target.innerHTML = "";
  target.classList.remove('rolarDireita');

  const template = document.getElementById('alternativa');
  pergunta.alternativas = shuffle(pergunta.alternativas);
  pergunta.alternativas = shuffle(pergunta.alternativas);
  pergunta.alternativas.map((alternativa, i) => {

    var clone = template.content.cloneNode(true);
    clone.querySelector('.value-wrapper').innerHTML = letrasPerguntas[i] + ') R$ ' + (alternativa / 100).toFixed(2).replace('.', ',');
    clone.querySelector('.key').onclick = () => {
      jogada(alternativa);
    }

    target.appendChild(clone);
  })

  var rodadaText = document.querySelector('.rodada');
  rodadaText.classList.remove('hidden');
  rodadaText.innerHTML = "Rodada " + (rodadaAtual + 1) + " de " + rodadas.length;

  var cashTarget = document.querySelector('.money-pieces');
  cashTarget.innerHTML = "";

  pergunta.valores = shuffle(pergunta.valores);
  pergunta.valores = pergunta.valores.sort((a, b) => {
    return a > b ? -1 : a < b ? 1 : 0;
  })
  pergunta.valores.map(valor => {
    const el = document.createElement('img')


    if (valor <= 100) { // moeda
      el.setAttribute('src', baseAddress + 'img/game/' + valor + 'cents.png');
      el.classList.add('coin');
      el.classList.add('v' + valor);
    } else { //nota
      el.setAttribute('src', baseAddress + 'img/game/n-' + (valor / 100) + '.png');
      el.classList.add('nota');
    }

    cashTarget.appendChild(el);
  })

  engine.onLoadPergunta(pergunta);
}

const showHUDs = () => {
  const noInteractionHud = document.querySelector('.noInteractionHUD');
  if (noInteractionHud) {
    noInteractionHud.style.display = 'flex';
  }

  const interactableHUD = document.querySelector('.interactableHUD');
  if (interactableHUD) {
    interactableHUD.style.display = 'flex';
  }
}


let engine = new GameEngine(canvas.getContext('2d'), canvas);
sheetLoader.loadSheetQueue(() => {
  if (debugEngine)
    console.log('Imagens carregadas!');

  engine.start();
  engine.onLoadStage(1)
  montaRepescagem(repescagens[0])
});
