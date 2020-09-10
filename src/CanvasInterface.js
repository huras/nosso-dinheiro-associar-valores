class CanvasInterface {
  constructor(options) {
    this.canvas = options.canvas;
    this.pixelBeauty = options.pixelBeauty ? options.pixelBeauty : true;

    window.addEventListener("resize", () => {
      this.resizeCanvas();
    });
    this.resizeCanvas();
  }

  resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx = canvas.getContext("2d");

    if (this.pixelBeauty) {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.msImageSmoothingEnabled = false;
      this.ctx.mozImageSmoothingEnabled = false;
    }
  };
}