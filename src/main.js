import { Application, Graphics, Container, Text } from "pixi.js";

(async () => {
  const app = new Application();

  await app.init({ background: "#000000", resizeTo: window });

  document.getElementById("pixi-container").appendChild(app.canvas);

  let size = 10,
    col = 66,
    row = 66;

  let grid = new Array(col * row);
  grid.fill(0);

  grid[0] = 1;
  grid[3] = 1;
  grid[cell(col / 2, row / 2)] = 1;

  function applyRules(nn, v) {
    if (v == 1) {
      if (nn < 2 || nn > 3) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (nn == 3) return 1;
    }
  }

  function neighborsNumber(cell) {
    let neighbors = [
      grid[cell - 1] ?? 0,
      grid[cell + 1] ?? 0,
      grid[cell + col] ?? 0,
      grid[cell - col] ?? 0,
      grid[cell - col - 1] ?? 0,
      grid[cell - col + 1] ?? 0,
      grid[cell + col + 1] ?? 0,
      grid[cell + col - 1] ?? 0,
    ];

    return neighbors.reduce((total, value) => {
      return total + value;
    });
  }

  function cell(x, y) {
    return x + y * col;
  }

  // game-container
  const startStopButton = document.getElementById("start-stop-button");
  let started = true;

  const graphics = new Graphics();
  const graphicsContainer = new Container();

  graphicsContainer.eventMode = "static";
  graphicsContainer.pivot.set((col * size) / 2, (row * size) / 2);
  graphicsContainer.x = app.screen.width / 2;
  graphicsContainer.y = app.screen.height / 2;

  const background = new Graphics()
    .filletRect(0, 0, graphicsContainer.width, graphicsContainer.height, 1)
    .fill({ color: 0x121212 });

  graphicsContainer.addChild(background);
  graphicsContainer.addChild(graphics);

  app.stage.addChild(graphicsContainer);

  function updateGrid() {
    graphics.clear();

    for (let i = 0; i < col * row; i++) {
      if (1) {
        graphics
          .filletRect(
            (i % col) * size,
            Math.floor(i / col) * size,
            size,
            size,
            0
          )
          .fill({
            color: grid[i]
              ? [
                  "#69247C",
                  "#FFB22C",
                  "#F6FA70",
                  "#1230AE",
                  "#ffffff",
                  "#FE7743",
                  "#D50B8B",
                  "#0079FF",
                  "#FF9F00",
                ][neighborsNumber(i)]
              : 0x121212,
          });
      }
    }
  }
  updateGrid();

  let intervalID,
    intervalSpeed = 55;

  function intervente(started) {
    if (!started) {
      intervalID = setInterval(() => {
        let nextGrid = [];

        grid.forEach((value, cell) => {
          let nn = neighborsNumber(cell);
          nextGrid[cell] = applyRules(nn, value);
        });

        grid.forEach((v, i) => {
          grid[i] = nextGrid[i];
        });

        updateGrid();
      }, intervalSpeed);
    } else {
      clearInterval(intervalID);
    }
  }

  startStopButton.addEventListener("click", (event) => {
    started = !started;

    event.currentTarget.value = !started ? "Stop" : "Start";

    intervente(started);
  });

  document
    .getElementById("speed-controller")
    .addEventListener("change", (event) => {
      intervalSpeed = event.target.value;
      intervente(true);
      intervente(false);
    });

  graphicsContainer.on("pointerdown", (event) => {
    const mouse = event.global;

    const x = Math.floor(
      (mouse.x - graphicsContainer.x) / (size * graphicsContainer.scale.x) +
        col / 2
    );
    const y = Math.floor(
      (mouse.y - graphicsContainer.y) / (size * graphicsContainer.scale.y) +
        row / 2
    );

    grid[cell(x, y)] = !grid[cell(x, y)];
    updateGrid();
  });

  let drag = false;
  let dx = 0,
    dy = 0,
    prevX,
    prevY;

  app.stage.eventMode = "static";

  document
    .getElementById("pixi-container")
    .addEventListener("mousemove", (event) => {
      const currX = event.x;
      const currY = event.y;

      if (prevX && prevY) {
        dx = currX - prevX;
        dy = currY - prevY;
      }
      prevX = currX;
      prevY = currY;
      if (drag) {
        graphicsContainer.x += dx;
        graphicsContainer.y += dy;
      }
    });

  document
    .getElementById("grid-size-control")
    .addEventListener("change", (event) => {
      graphicsContainer.scale.set(event.target.value);
      updateGrid();
    });

  window.addEventListener("wheel", (event) => {
    graphicsContainer.scale.set(
      graphicsContainer.scale.x - 0.1 * Math.sign(event.deltaY)
    );

    updateGrid();
  });

  window.addEventListener("mousedown", () => {
    drag = true;
  });

  window.addEventListener("mouseup", () => {
    drag = false;
  });

  let FPSText;

  document.fonts.load("16px Geist Mono").then(() => {
    FPSText = new Text({
      text: "FPS: 0",
      style: {
        fontFamily: "Geist Mono",
        fontSize: 15,
        fill: 0xffffff,
      },
      x: app.screen.width - 75,
      y: app.screen.height - 30,
    });

    app.stage.addChild(FPSText);
  });

  app.ticker.add((time) => {
    FPSText.text = "FPS: " + app.ticker.FPS.toFixed(0);
  });
})();
