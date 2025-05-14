import { Application, Graphics, Container, Text } from "pixi.js";
import { gameObjects } from "./data";
import Universe from "./universe";

(async () => {
  const app = new Application();

  await app.init({ background: "#000000", resizeTo: window });

  document.getElementById("pixi-container").appendChild(app.canvas);

  const universe = new Universe(20, 500, 500);

  universe.grid[0] = 1;
  console.log(universe.grid);

  // game-container
  const startStopButton = document.getElementById("start-stop-button");
  let started = true;

  const graphics = new Graphics();
  const graphicsContainer = new Container();

  graphicsContainer.eventMode = "static";
  graphicsContainer.pivot.set((width * size) / 2, (height * size) / 2);
  graphicsContainer.x = app.screen.width / 2;
  graphicsContainer.y = app.screen.height / 2;

  universe.graphics = graphics;

  const background = new Graphics()
    .filletRect(0, 0, universe.width * universe.size, universe.height * universe.size, 1)
    .fill({ color: 0x121212 });

  console.log(graphicsContainer);

  graphicsContainer.addChild(background);
  graphicsContainer.addChild(graphics);

  app.stage.addChild(graphicsContainer);

  universe.update();

  let intervalID,
    intervalSpeed = 55;

  function intervente(started) {
    if (!started) {
      intervalID = setInterval(() => {
        let nextGrid = [];

        universe.grid.forEach((value, cell) => {
          let nn = universe.neighborsNumber(cell);
          nextGrid[cell] = universe.rules(nn, value);
        });

        universe.grid.forEach((v, i) => {
          universe.grid[i] = nextGrid[i];
        });

        universe.update();
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
      (mouse.x - graphicsContainer.x) / (universe.size * graphicsContainer.scale.x) +
        universe.width / 2
    );
    const y = Math.floor(
      (mouse.y - graphicsContainer.y) / (universe.size * graphicsContainer.scale.y) +
        universe.height / 2
    );

    universe.grid[universe.cell(x, y)] = 1 - universe.grid[universe.cell(x, y)];
    console.log(universe.grid[universe.cell(x, y)])
    universe.update();
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
      universe.update();
    });

  document
    .getElementById("pixi-container")
    .addEventListener("wheel", (event) => {
      graphicsContainer.scale.set(
        graphicsContainer.scale.x * 0.6 ** Math.sign(event.deltaY)
      );

      universe.update();
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

  const button = document.getElementById("select-button");
  const panel = document.getElementById("panel");
  const plusMinusIcon = document.getElementById("plus-minus");

  button.addEventListener("click", (event) => {
    panel.style.display = panel.style.display == "grid" ? "none" : "grid";
    plusMinusIcon.className =
      plusMinusIcon.className == "fa-solid fa-minus"
        ? "fa-solid fa-plus"
        : "fa-solid fa-minus";
  });

  gameObjects.forEach((obj, i) => {
    let div = document.createElement("div");
    let objectImg = document.createElement("img");
    let label = document.createElement("label");

    div.className = "gameobj-container";

    objectImg.src = "/assets/objects/" + obj + ".png";
    objectImg.width = 60;
    objectImg.alt = obj;

    label.textContent = obj;

    div.appendChild(objectImg);
    div.appendChild(label);
    panel.appendChild(div);
  });

  app.ticker.add((time) => {
    FPSText.text = "FPS: " + app.ticker.FPS.toFixed(0);
  });
})();
