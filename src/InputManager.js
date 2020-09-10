class InputManager {
  constructor(
    keys = {
      right: InputManager.Keys.Right_Arrow,
      left: InputManager.Keys.Left_Arrow,
      up: InputManager.Keys.Up_Arrow,
      down: InputManager.Keys.Down_Arrow,
      // run: InputManager.Keys.X,
      // jump: InputManager.Keys.C
    }
  ) {
    this.keys = keys;

    this.keyData = [];
    this.maxTimeAmount = 9999;

    document.addEventListener("keydown", (event) => {
      if (this.keyData[event.keyCode.toString()]) {
        let keyData = this.keyData[event.keyCode.toString()];
        if (!keyData.isPressed) {
          keyData.time = 0;
          keyData.isPressed = true;
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      if (this.keyData[event.keyCode.toString()]) {
        let keyData = this.keyData[event.keyCode.toString()];
        if (keyData.isPressed) {
          keyData.time = 0;
          keyData.isPressed = false;
        }
      }
    });

    Object.entries(this.keys).forEach(([key, value]) => {
      this.keyData[value.toString()] = {
        isPressed: false,
        last: 0,
        time: 0,
      };
    });

    setInterval(() => {
      this.timeCounter(10);
    }, 10);
  }

  checkKeysUpdate() {
    // this.keyDowns();
    // this.keyUps();
  }

  isPressed(key) {
    if (this.keyData[key.toString()])
      return this.keyData[key.toString()].isPressed;
    else return undefined;
  }

  timeCounter(deltaTime) {
    this.keyData = this.keyData.map((temp) => {
      if (!temp.isPressed) {
        if (temp.last < this.maxTimeAmount) {
          temp.last += deltaTime;
        } else {
          temp.time = this.maxTimeAmount;
        }
      } else {
        if (temp.time < this.maxTimeAmount) {
          temp.time += deltaTime;
        } else {
          temp.time = this.maxTimeAmount;
        }
      }
      return temp;
    });
  }
}

InputManager.Keys = {
  Right_Arrow: 39,
  Left_Arrow: 37,
  Up_Arrow: 38,
  Down_Arrow: 40,
  X: 88,
  C: 67,
};