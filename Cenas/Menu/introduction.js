var canvas = document.getElementById('canvas');
var whenResized = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", () => {
  whenResized();
});
whenResized();

let keyframes = [
  // BG
  {
    doAt: 0, //in seconds
    action: Actions.SpawnImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 1, // ID do alvo
    src: 'bg.png',
    transform: {
      x: (imgRect, canvas, scale) => { return 0 },
      y: (imgRect, canvas, scale) => { return 0 },
      w: (imgRect, canvas, scale) => { return canvas.width },
      h: (imgRect, canvas, scale) => { return canvas.height },
    }
  },

  // Quadro
  {
    doAt: 0, //in seconds
    action: Actions.SpawnImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 2, // ID do alvo
    src: 'quadro.png',
    transform: {
      x: (imgRect, canvas, scale, transform) => { return canvas.width - transform.w(imgRect, canvas, scale, transform) - 8 },
      y: (imgRect, canvas, scale, transform) => { return 8 },
      w: (imgRect, canvas, scale, transform) => { return (canvas.width * 0.7) },
      h: (imgRect, canvas, scale, transform) => { return (canvas.height - 16) },
    }
  },



  // Titulo multiplicação por 6
  {
    doAt: 0, //in seconds
    action: Actions.SpawnImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 5, // ID do alvo
    src: 'mult-p-6.png',
    transform: {
      x: (imgRect, canvas, scale, transform) => { return canvas.width * 0.725 - transform.w(imgRect, canvas, scale, transform) * 0.5 },
      y: (imgRect, canvas, scale, transform) => { return - canvas.height * 0.5 - transform.h(imgRect, canvas, scale, transform) * 0.5 },
      w: (imgRect, canvas, scale) => { return (imgRect.width * scale.x * 0.5) },
      h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y * 0.5) },
    }
  },

  // Multiplicações diversas
  {
    doAt: 0, //in seconds
    action: Actions.SpawnImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 4, // ID do alvo
    src: 'contas.png',
    transform: {
      x: (imgRect, canvas, scale, transform) => { return canvas.width * 0.65 - transform.w(imgRect, canvas, scale, transform) * 0.5 },
      y: (imgRect, canvas, scale, transform) => { return canvas.height * 2 },
      w: (imgRect, canvas, scale) => { return (imgRect.width * scale.x * 0.5) },
      h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y * 0.5) },
    }
  },

  // Zeca
  {
    doAt: 0, //in seconds
    action: Actions.SpawnImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 3, // ID do alvo
    src: 'aluno.png',
    transform: {
      x: (imgRect, canvas, scale, transform) => { return -imgRect.width * scale.x * 2 },
      y: (imgRect, canvas, scale, transform) => { return canvas.height - transform.h(imgRect, canvas, scale, transform) * 0.90 - 8 },
      w: (imgRect, canvas, scale) => { return (imgRect.width * scale.x * 0.7) },
      h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y * 0.7) },
    }
  },

  // Zeca
  {
    doAt: 0.5, //in seconds
    action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 3, // ID do alvo
    tween: [{
      transform: {
        x: (imgRect, canvas, scale, transform) => { return 8 },
      },
      delay: 1 // in ms
    }]
  },

  // Multiplicações diversas  
  {
    doAt: 0.05, //in seconds
    action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 4, // ID do alvo
    tween: [{
      transform: {
        y: (imgRect, canvas, scale, transform) => { return canvas.height * 0.45 - transform.h(imgRect, canvas, scale, transform) * 0.5 },
        h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y * 0.5) },
      },
      delay: 0.5 // in ms
    }]
  },
  {
    doAt: 2.75, //in seconds
    action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 4, // ID do alvo
    tween: [{
      transform: {
        y: (imgRect, canvas, scale, transform) => { return canvas.height * -50 },
        h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y * 0.5) },
      },
      delay: 0.25 // in ms
    }]
  },

  // Titulo multiplicação por 6
  {
    doAt: 2.5, //in seconds
    action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
    targetID: 5, // ID do alvo
    tween: [{
      transform: {
        y: (imgRect, canvas, scale, transform) => { return canvas.height * 0.5 - transform.h(imgRect, canvas, scale, transform) * 0.5 },
        h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y * 0.5) },
      },
      delay: 0.5 // in ms
    }]
  },

  // // Alunos
  // // Aluno menino
  // {
  //   doAt: 0, //in miliseconds
  //   action: Actions.SpawnImage, // spawn-image, transform-image, play-audio, hide-image
  //   targetID: 3,
  //   src: 'menino0001.png',
  //   transform: {
  //     x: (imgRect, canvas, scale) => { return 0 + 0.03 * canvas.width },
  //     y: (imgRect, canvas, scale) => { return canvas.height - (imgRect.height * scale.y) },
  //     w: (imgRect, canvas, scale) => { return (imgRect.width * scale.x) },
  //     h: (imgRect, canvas, scale) => { return (imgRect.height * scale.y) },
  //   }
  // },


  // // Animação Titulo
  // {
  //   doAt: 0.5, //in seconds
  //   action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
  //   targetID: 6,
  //   tween: [
  //     {
  //       transform: {
  //         y: (imgRect, canvas, scale) => { return 0 + 0.03 * canvas.height },
  //       },
  //       delay: 0.2 // in ms
  //     },
  //   ]
  // },

  // {
  //   doAt: 0.8, //in seconds
  //   action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
  //   targetID: 7,
  //   tween: [
  //     {
  //       transform: {
  //         y: (imgRect, canvas, scale) => { return 0 + 0.2 * canvas.height },
  //       },
  //       delay: 0.2 // in ms
  //     },
  //   ]
  // },


  // // Animação professora
  // {
  //   doAt: 1, //in seconds
  //   action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
  //   targetID: 2,
  //   tween: [
  //     {
  //       transform: {
  //         x: (imgRect, canvas, scale) => { return canvas.width - (imgRect.width * scale.x) - (0.03 * canvas.width) },
  //       },
  //       delay: 0.5 // in ms
  //     },
  //   ]
  // },

  // // Animação balão
  // {
  //   doAt: 1.5, //in seconds
  //   action: Actions.TransformImage, // spawn-image, transform-image, play-audio, hide-image
  //   targetID: 'balão',
  //   tween: [
  //     {
  //       transform: {
  //         x: (imgRect, canvas, scale) => { return canvas.width - (imgRect.width * scale.x * 1.75) },
  //         opacity: () => { return 1 }
  //       },
  //       delay: 0.5 // in ms
  //     },
  //   ]
  // },

  // Animação balão
  {
    doAt: 3, //in seconds
    action: Actions.EndAnimation, // spawn-image, transform-image, play-audio, hide-image    
  },
]
// ====================================================================

var engine = undefined;

function prepareMovie(intialTimeCounter = 0) {
  engine = new AnimationEngine(keyframes, canvas)
  engine.start();
}

function playMovie() {
  document.querySelector('.play').style.display = 'none';
  engine.play();
}

