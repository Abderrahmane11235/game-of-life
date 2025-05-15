export default class Universe {
  constructor(size, width, height) {
    this.size = size;
    this.width = width;
    this.height = height;
    this.grid = new Array(this.width * this.height);
    this.grid.fill(0);
    this.graphics = null;
  }

  rules(n, v) {
    if (v == 1) {
      if (n < 2 || n > 3) {
        return 0;
      } else {
        return 1;
      }
    } else {
      if (n == 3) return 1;
      return 0;
    }
  }

  neighborsNumber(cell) {
    let neighbors = [
      this.grid[cell - 1] ?? 0,
      this.grid[cell + 1] ?? 0,
      this.grid[cell + this.width] ?? 0,
      this.grid[cell - this.width] ?? 0,
      this.grid[cell - this.width - 1] ?? 0,
      this.grid[cell - this.width + 1] ?? 0,
      this.grid[cell + this.width + 1] ?? 0,
      this.grid[cell + this.width - 1] ?? 0,
    ];

    return neighbors.reduce((total, value) => {
      return total + value;
    });
  }

  cell(x, y) {
    return x + y * this.width;
  }

  set(x, y, v) {
    this.grid[this.cell(x, y)] = v;
  }

  setObject(obj, pos) {
    obj.pattern.forEach((v, i) => {
      this.set(
        pos.x + (i % obj.size[0]),
        pos.y + Math.floor(i / obj.size[0]),
        v
      );
    });
  }

  update() {
    this.graphics.clear();

    for (let i = 0; i < this.width * this.height; i++) {
      if (this.grid[i]) {
        this.graphics
          .filletRect(
            (i % this.width) * this.size,
            Math.floor(i / this.width) * this.size,
            this.size - 2,
            this.size - 2,
            0
          )
          .fill({
            color: this.grid[i] ? 0xff0b55 : 0x121212,
          });
      }
    }
  }
}
