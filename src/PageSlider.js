var currentPage = 0;
var historico = [
  {
    url: "./Cenas/Menu/index.html",
    rotation: "landscape-primary",
    // type: 'animation'
  },
  {
    url: "./Cenas/Stage1/index.html",
    rotation: "landscape-primary",
    // type: 'animation'
  },
];

var loadedData = {
  crystals: 0,
};

// Gerencia histórico
var loadNewScene = (
  url,
  rotation,
  currEngine = undefined,
  type = undefined
) => {
  if (currEngine) {
    if (currEngine.crystalCounter) {
      loadedData.crystals += currEngine.crystalCounter.counter;
    }

    if (currEngine.repescagens != undefined) {
      loadedData.repescagens = currEngine.repescagens;
    }
  }

  historico.push({
    url: url,
    rotation: rotation,
    type: type,
  });
  nextPage();
};

// ======================================
function randomHead() {
  let heads = [
    document.getElementById("brenda-head"),
    document.getElementById("zeca-head"),
    document.getElementById("lucia-head"),
  ];
  heads.map((head) => {
    head.style.display = "none";
  });
  var headToShowIdx = Math.floor(randomInt(0, heads.length * 2) / 2);
  heads[headToShowIdx].style.display = "flex";
}
randomHead();

function gotoCurrentPage() {
  randomHead();

  var iframe = document.querySelector("iframe");
  iframe.src = historico[currentPage].url;
  document.getElementById("page-counter").innerHTML =
    "Página " + (currentPage + 1) + " de " + historico.length;
  var prevButton = document.getElementById("prev-btn");
  var nextButton = document.getElementById("next-btn");
  prevButton.style.display = "none";
  nextButton.style.display = "none";

  if (currentPage > 0) {
    prevButton.style.display = "block";
  }

  if (currentPage < historico.length - 1) {
    nextButton.style.display = "block";
  }

  iframe.onload = function () {
    prepareMovie();
    attachFunctionsToCurrentIframe();
  };

  try {
    checkCorrectRotation();
  } catch (error) {}
}

var miframe = undefined;
var engine = undefined;
function attachFunctionsToCurrentIframe() {
  var iframe = document.querySelector("iframe");
  miframe = iframe;
  engine = () => {
    return miframe.contentWindow.engine || null;
  };
  engine = engine();

  iframe.contentWindow.loadedData = loadedData;
  if (miframe.contentWindow.loadPreviousStageData)
    miframe.contentWindow.loadPreviousStageData(loadedData);
  iframe.contentWindow.loadNewScene = (url, rotation, type = undefined) => {
    loadNewScene(url, rotation, type);
  };

  iframe.contentWindow.forcedOrientation = historico[currentPage].rotation; // Força rotação da nova tela
}

gotoCurrentPage();
var totalFrag = {
  acertos: 0,
  respostas: 0,
};

function prepareMovie() {
  if (document.fullscreenElement) {
    var iframe = document.getElementById("frame");

    if (iframe.contentWindow.prepareMovie) {
      iframe.contentWindow.prepareMovie(-1);
      iframe.contentWindow.playMovie();
    }

    var nextPageBtn = iframe.contentWindow.document.getElementById("nextPage");

    if (nextPageBtn) {
      nextPageBtn.addEventListener("click", function () {
        nextPage();
      });
    }

    if (iframe.contentWindow.onFinishGame) {
      var receivedFrag = false;

      iframe.contentWindow.onFinishGame = function (frag) {
        if (!receivedFrag) {
          receivedFrag = true;
          console.log(frag);
          totalFrag.acertos += frag.acertos;
          totalFrag.respostas += frag.respostas;

          if (!nextPage()) {
            if (iframe.contentWindow.showResults) {
              iframe.contentWindow.setFrag(totalFrag);
              iframe.contentWindow.showResults();
            } else console.log("no results function to call");
          }
        }
      };
    }
  }
}

function checkCorrectRotation() {
  var rotationToApply = historico[currentPage].rotation; // Força rotação da nova tela

  if (screen.orientation.lock) {
    screen.orientation.lock(rotationToApply);
  } else {
    screen.lockOrientationUniversal =
      screen.orientation.lock ||
      screen.lockOrientation ||
      screen.mozLockOrientation ||
      screen.msLockOrientation;
    screen.lockOrientationUniversal(rotationToApply);
  }
}

function previousPage() {
  currentPage--;
  if (currentPage < 0) currentPage = 0;
  gotoCurrentPage();
}

function nextPage() {
  currentPage++;

  if (currentPage > historico.length - 1) {
    currentPage = historico.length - 1;
    return false;
  }

  gotoCurrentPage();
  return true;
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

document.querySelector("iframe").addEventListener("mouseover", function () {
  // openFullscreen(document.querySelector('body'));
});
window.addEventListener("fullscreenchange", function (event) {
  // console.log(event);
  checkFullScreenRoutine(false);
});

function checkFullScreenRoutine() {
  var clicked =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var overlay = document.getElementById("slider-fullscreen-overlay");

  if (clicked) {
    overlay.style.display = "none";

    if (!document.fullscreenElement) {
      openFullscreen(document.querySelector("body"));
    }
  } else {
    if (!document.fullscreenElement) {
      overlay.style.display = "flex";
    }
  }

  prepareMovie();
}

document.querySelector("body").addEventListener(
  "click",
  function () {
    checkFullScreenRoutine();
    checkCorrectRotation();
  },
  false
);
checkFullScreenRoutine(false);

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
