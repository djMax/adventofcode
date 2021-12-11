class Board {
  board = new Array(10).fill(0).map(() => new Array(10).fill(0));
  flashed = new Array(10).fill(0).map(() => new Array(10).fill(false));
  steps = 0;
  flashes = 0;

  constructor(lines) {
    lines.forEach((l, ix) => {
      l.split('').forEach((n, iy) => {
        this.board[ix][iy] = Number(n);
      });
    });
  }

  didFlash(x, y) {
    return this.flashed[x][y];
  }

  flash(x, y) {
    if (!this.flashed[x][y]) {
      this.flashes++;
      this.flashed[x][y] = true;
      // Call inc for each cell around x, y
      for (let x1 = x - 1; x1 <= x + 1; x1++) {
        for (let y1 = y - 1; y1 <= y + 1; y1++) {
          if (x1 >= 0 && x1 < 10 && y1 >= 0 && y1 < 10
            && (x1 !== x || y1 !== y)) {
            this.inc(x1, y1);
          }
        }
      }
    }
  }

  inc(x, y) {
    this.board[x][y]++;
    if (this.board[x][y] > 9) {
      this.flash(x, y);
    }
  }

  step() {
    const startFlash = this.flashes;
    this.flashed = new Array(10).fill(0).map(() => new Array(10).fill(false));
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.inc(x, y);
      }
    }
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (this.didFlash(x, y)) {
          this.board[x][y] = 0;
        }
      }
    }
    this.steps++;
    return (this.flashes === startFlash + 100);
  }

  logBoard() {
    const mapped = this.board.map((row, ix) => row.map((cell, iy) => {
      return `${this.didFlash(ix, iy) ? `*` : ' '}${cell}`;
    }).join(' ')).join('\n');
    console.log(`${this.steps} Steps, Total Flashes ${this.flashes} \n${mapped}\n`);
  }

  static run(input) {
    const board = new Board(input.split('\n'));
    Array(100).fill(0).forEach(() => board.step());
    board.logBoard();
    return board.flashes;
  }

  static runToAll(input) {
    const board = new Board(input.split('\n'));
    while (!board.step());
    board.logBoard();
    return board.steps;
  }
}

const test = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

if (Board.run(test) !== 1656) {
  throw new Error('Test failed');
}

if (Board.runToAll(test) !== 195) {
  throw new Error('Part 2 Test failed');
}

const input = `8261344656
7773351175
7527856852
1763614673
8674556743
6853382153
4135852388
2846715522
7477425863
4723888888`;

console.log('Part 1');
Board.run(input);

console.log('Part 2');
Board.runToAll(input);
