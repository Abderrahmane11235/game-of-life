import {
  Application,
  Assets,
  Sprite,
  Graphics,
  Container,
  Text,
} from "pixi.js";
import { Button } from "@pixi/ui";

(async () => {
  const app = new Application();

  await app.init({ background: "#000000", resizeTo: window });

  document.getElementById("pixi-container").appendChild(app.canvas);

  const size = 17,
    col = Math.floor(app.screen.width / size),
    row = Math.floor(app.screen.height / size);

  let grid = new Array(col * row);
  grid.fill(0);

  grid[150 + 1] = 1;
  grid[150 + col + 2] = 1;
  grid[150 + 2 * col] = 1;
  grid[150 + 2 * col + 1] = 1;
  grid[150 + 2 * col + 2] = 1;
  // grid[10 + 2 * col] = 1;
  // grid[10] = 1;
  // grid[10 + col - 1] = 1;
  // grid[10 + 2 * col - 1] = 1;
  // grid[10 - 1] = 1;
  // grid[10 + col + 1] = 1;
  // grid[10 + 2 * col + 1] = 1;
  // grid[10 + 1] = 1;

  const graphics = new Graphics();
  app.stage.addChild(graphics);

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
    return x + y * col + 1;
  }

  console.log(neighborsNumber(10));

  let start = true;
  let intervalId = null; // Store the interval ID

  function startSimulation() {
    if (intervalId === null) { // Only start if not already running
      intervalId = setInterval(() => {
        let newGrid = new Array(col * row);

        grid.forEach((value, cell) => {
          let nn = neighborsNumber(cell);
          newGrid[cell] = applyRules(nn, value);
        });

        grid = newGrid;
      }, 90);
    }
  }

  function stopSimulation() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Start initially if start is true
  if (start) {
    startSimulation();
  }

  graphics.eventMode = "static";
  graphics.on("pointerdown", (event) => {
    const mouse = event.global;

    const x = Math.floor(mouse.x / size);
    const y = Math.floor(mouse.y / size);

    grid[cell(x, y)] = 1;

    console.log(x, y);
  });

  const container = new Container();
  container.x = 20;
  container.y = 20;

  // Create a more visible button with text
  const buttonGraphics = new Graphics().fill(0xffffff).rect(0, 0, 100, 50);

  const buttonText = new Text({
    text: "Start",
    style: {
      fill: 0xff,
      fontSize: 20,
    },
  });
  buttonText.x = 25; // Center text in button
  buttonText.y = 15;

  buttonGraphics.addChild(buttonText);

  const button = new Button(buttonGraphics);
  button.view.eventMode = "static";

  button.onPress.connect(() => {
    console.log("Button pressed!");
    start = !start;
    
    if (start) {
      startSimulation();
      buttonText.text = "Stop"; // Update button text
    } else {
      stopSimulation();
      buttonText.text = "Start"; // Update button text
    }
  });

  container.addChild(button.view);
  app.stage.addChild(container);

  app.ticker.add((time) => {
    graphics.clear();
    for (let i = 0; i <= grid.length; i++) {
      graphics.fill({ color: grid[i] ? "white" : 0x121212 });
      graphics.filletRect(
        (i % col) * size,
        Math.floor(i / col) * size,
        size - 1,
        size - 1,
        1
      );
    }
    // console.log("FPS:", app.ticker.FPS);
  });
})();
