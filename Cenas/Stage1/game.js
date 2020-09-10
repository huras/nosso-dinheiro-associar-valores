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
    ev.dataTransfer.setDragImage(img, 25, 25);
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

      var maxJogadas = 2
      document.getElementById('vezes-r').innerHTML = (maxJogadas - engine.repescagens);
      if (engine.repescagens >= maxJogadas) {
        document.getElementById('btn-repescar').style.display = 'none';
      }

      console.log(engine.repescagens);
    }
  }
}

// =================================================== Engine Base
const regra1 = (moeda, cofre) => {

  if (cofre.moedasPermitidas.indexOf(moeda) == -1) {

    engine.heartHUD.applyDamage(1);
    engine.heartHUD.updateHUD();

    mostraCertoOuErrado(false)
    engine.onErrarQuestao(moeda, cofre.moedasPermitidas, cofre.espacoMaximo)


  } else {
    var totalAtual = 0;
    cofre.moedasDentro.map(item => {
      totalAtual += item;
    });

    if ((moeda + totalAtual) > cofre.espacoMaximo) {
      engine.onVacilarResposta()
    }
    else {
      engine.onAcertarQuestao(moeda, cofre.moedasPermitidas, cofre.espacoMaximo)
      mostraCertoOuErrado(true)
      cofre.moedasDentro.push(moeda)

      const coinTarget = cofre.element.querySelector('.coins-inside');
      const newCoin = document.createElement('div');
      var coinVal = moeda;
      if (coinVal > 99) {
        coinVal /= 100;
      }
      newCoin.innerHTML = coinVal;
      newCoin.classList.add('coin');
      newCoin.classList.add('m-' + moeda);
      coinTarget.appendChild(newCoin);

      regra2(moeda, cofre)
    }
  }
}


const regra2 = (moeda, cofre) => {

  var totalAtual = 0;
  cofre.moedasDentro.map(item => {
    totalAtual += item;
  });


  if (totalAtual == cofre.espacoMaximo) {
    cofre.concluido = true
    cofre.element.classList.add('porquinhoPronto')
    //renderi\zar porco conluido
    regra6(cofre)
  }
}

const regra6 = (cofre) => {
  var porcosAtual = rodadas[rodadaAtual];
  var porcosProntos = 0

  porcosAtual.map((porco) => {
    if (porco.concluido == true) {
      porcosProntos += 1
    }
  })

  if (porcosProntos == porcosAtual.length) {
    rodadaAtual++;
    setTimeout(() => {
      document.querySelector('.cofres').classList.add('rolarDireita')
    }, 2500)

    setTimeout(() => {
      if (rodadaAtual >= rodadas.length) {
        engine.onWinGame();
      } else {
        montarRodada(rodadas[rodadaAtual]);
        document.querySelector('.cofres').classList.remove('rolarDireita')
      }
    }, 3500)

    console.log(rodadaAtual)
  }
}

// =================================================== Engine Base

const drawColliders = false;
const debugEngine = false;
const revivePrice = 30;
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

    this.perguntas = [
      {
        q: '42 - 22 =', //questão
        r: 20,         //resposta
        o: [28, 18, 24, 19]
      },
      {
        q: '31 - 19 =',
        r: 12,
        o: [10, 11, 15, 8]
      },
      {
        q: '46 - 30 =',
        r: 16,
        o: [12, 11, 14, 10]
      },
      {
        q: '30 - 15 =',
        r: 15,
        o: [13, 19, 20, 7]
      },
      {
        q: '55 - 23 =',
        r: 32,
        o: [30, 34, 28, 42]
      },
      {
        q: '40 - 14 =',
        r: 26,
        o: [22, 24, 28, 18]
      },
    ];

    // this.perguntas = shuffle(this.perguntas);
    // this.perguntas.splice(6, 4);
    this.perguntaAtual = 0;

    // === Set HUD
    this.crystalCounter = new HUDCounter(60, 'txt_qtd-moedas');
    this.frag = new FragManager();
    this.heartHUD = new HeartHUD(3, ['#vida1', '#vida2', '#vida3'], args => { onGameOver() }, 3); // this.heartHUD = new HeartHUD(3, ['#vida1', '#vida2', '#vida3']);
    this.contaHUD = new ContaHUD({ selector: '#continha' });

    document.querySelector('.certo-ou-errado .certo').classList.add('escondido')
    document.querySelector('.certo-ou-errado .errado').classList.add('escondido')

    // === Eventos importantes no jogo
    this.onDarResposta = (resposta) => {

      var ret = engine.contaHUD.checaConta(resposta)
      if (ret) {
        this.onAcertarQuestao(resposta, this.contaHUD.conta.r, this.contaHUD.conta.q)
      } else {
        this.onErrarQuestao(resposta, this.contaHUD.conta.r, this.contaHUD.conta.q)
      }

      return ret
    }

    this.onLoadPergunta = () => {
      this.contaHUD.setOp(this.perguntas[this.perguntaAtual])

      var pergunta = JSON.parse(JSON.stringify(this.perguntas[this.perguntaAtual]));

      pergunta.o.push(pergunta.r)
      pergunta.o = shuffle(pergunta.o)
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

      if (sounds.sfx.rightAnswer) { // Dá play num som
        sounds.sfx.rightAnswer.currentTime = 0;
        sounds.sfx.rightAnswer.play();
        sounds.sfx.rightAnswer.muted = false;
      }
    }
    this.onErrarQuestao = (answerGiven, rightAnswer, questionString, removeLife = true) => {
      this.frag.incluirErro({
        questionString: questionString,
        rightAnswer: rightAnswer,
        answerGiven: answerGiven
      });

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

    // =========================== Filminho inicial   

    this.onLoadPergunta();
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
    engineloop1: document.getElementById("SFX-engineLoop1"),
    engineloop2: document.getElementById("SFX-engineLoop2"),
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

var maxJogadas = 2
var repescadasFeitas = 0
const montaRepescagem = (repescagem) => {
  hideScreen('.result-screen')
  rodadaAtual = 0;
  rodadas = repescagem
  montarRodada(rodadas[rodadaAtual])

  document.getElementById('vezes-r').innerHTML = (maxJogadas - repescadasFeitas);
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
  [ //repescagem 1
    [//rodada1
      {
        moedasPermitidas: [100],
        moedasDentro: [],
        espacoMaximo: 1100,
      },
      {
        moedasPermitidas: [10, 5],
        moedasDentro: [],
        espacoMaximo: 100,
      }
    ],

    [//rodada2
      {
        moedasPermitidas: [50, 100],
        moedasDentro: [],
        espacoMaximo: 600,
      },
      {
        moedasPermitidas: [100],
        moedasDentro: [],
        espacoMaximo: 800,
      }
    ],
  ],

  [ //repescagem 2
    [//rodada1
      {
        moedasPermitidas: [100, 50],
        moedasDentro: [],
        espacoMaximo: 900,
      },
      {
        moedasPermitidas: [50, 25],
        moedasDentro: [],
        espacoMaximo: 400,
      }
    ],

    [//rodada2
      {
        moedasPermitidas: [50],
        moedasDentro: [],
        espacoMaximo: 300,
      },
      {
        moedasPermitidas: [100, 25],
        moedasDentro: [],
        espacoMaximo: 700,
      }
    ],
  ],

  [ //repescagem 3
    [//rodada1
      {
        moedasPermitidas: [100, 50],
        moedasDentro: [],
        espacoMaximo: 1200,
      },
      {
        moedasPermitidas: [100, 25],
        moedasDentro: [],
        espacoMaximo: 600,
      },
      {
        moedasPermitidas: [50, 25],
        moedasDentro: [],
        espacoMaximo: 300,
      }
    ],

    [//rodada2
      {
        moedasPermitidas: [50, 100],
        moedasDentro: [],
        espacoMaximo: 900,
      },
      {
        moedasPermitidas: [25],
        moedasDentro: [],
        espacoMaximo: 75,
      }
    ],
  ],

]);
var rodadas = []
var rodadaAtual = 0

function montarRodada(porquinhos) {

  porquinhos = shuffle(porquinhos);

  var template = document.getElementById('cofrinho')
  var target = document.querySelector('.cofres')
  var rodadaText = document.querySelector('.rodada')

  target.innerHTML = ""
  target.classList.remove('rolarDireita')

  porquinhos.map((porquinho, position) => {
    porquinho.concluido = false
    var clone = template.content.cloneNode(true)
    clone.querySelector('.pigdrop').setAttribute('posicaoPorquinho', position)
    clone.querySelector('.regra .valor').innerHTML = ""
    clone.querySelector('.total').innerHTML = "R$ " + (porquinho.espacoMaximo / 100).toFixed(2).replace('.', ',')

    const moedasTemplate = clone.querySelector('.valor')

    porquinho.moedasPermitidas.map((moeda) => {
      const moedasConvertidas = (moeda / 100).toFixed(2).replace('.', ',')
      moedasTemplate.innerHTML += "R$ " + moedasConvertidas + " e "
    })
    moedasTemplate.innerHTML = moedasTemplate.innerHTML.substr(0, moedasTemplate.innerHTML.length - 2)
    target.appendChild(clone)
  })
  rodadaText.innerHTML = "Rodada " + (rodadaAtual + 1)
}

montaRepescagem(repescagens[0])

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
});
