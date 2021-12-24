const test = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

const input = `#############
#...........#
###C#D#A#B###
  #B#A#D#C#
  #########`;

const destinationRooms = { A: 0, B: 1, C: 2, D: 3 };
const isDestinationRoom = (room, amphipod) => destinationRooms[amphipod[0]] === room;

class Rooms {
  hallway = Array(11).fill('.');
  amphipods = {};
  energy = 0;
  moves = [];

  constructor(input) {
    if (typeof input === 'string') {
      const rawLines = input.split('\n');
      const roomLevels = rawLines.length - 3;
      this.rooms = Array(4).fill(0).map(() => Array(roomLevels).fill('.'));
      const lines = rawLines.slice(2).slice(0, -1);
      lines.forEach((line, lineIndex) => {
        line.split('#').map(s => s.trim()).filter(a => a).forEach((a, ix) => {
          const name = this.podName(a);
          this.rooms[ix][roomLevels - lineIndex - 1] = name;
          this.amphipods[name] = ['room', ix, roomLevels - lineIndex - 1];
        });
      });
    } else {
      this.hallway = input.hallway.slice(0);
      this.rooms = input.rooms.map((r) => r.slice(0));
      this.amphipods = {...input.amphipods};
      this.energy = input.energy;
      this.moves = [...input.moves];
    }
  }

  podName(baseString) {
    let ix = 1;
    while (this.amphipods[ix > 1 ? `${baseString}${ix}` : baseString]) {
      ix++;
    }
    return ix > 1 ? `${baseString}${ix}` : baseString;
  }

  log() {
    const depth = this.rooms[0].length;
    return `#############
#${this.hallway.map(a => a[0]).join('')}#
${Array(depth).fill(0).map((_, ix) => {
  if (ix === 0) {
    return `###${this.rooms.map(r => r[depth - ix - 1][0]).join('#')}###`;
  } else {
    return `  #${this.rooms.map(r => r[depth - ix - 1][0]).join('#')}#`;
  }
}).join('\n')}
  #########`;
  }

  hash() {
    return `${this.hallway.join('')}${this.rooms.map(r => r.join('')).join('')}`
  }

  isSolved() {
    return this.rooms.every((r, ix) => r.every(s => 'ABCD'.indexOf(s[0]) === ix));
  }

  // Assumes the move is valid
  move(amphipod, direction) {
    const [loc, pos, roomSpot] = this.amphipods[amphipod];
    const lastMove = { direction, amphipod };
    const roomDepth = this.rooms[0].length;

    if (loc === 'room') {
      if (direction === 'up') {
        if (roomSpot === roomDepth - 1) {
          // Move into the hallway
          this.amphipods[amphipod] = ['hall', pos * 2 + 2];
          this.rooms[pos][roomDepth - 1] = '.';
          this.hallway[pos * 2 + 2] = amphipod;
          lastMove.location = 'hall';
          lastMove.pos = pos * 2 + 2;
        } else {
          // Move up 1 in the room
          this.amphipods[amphipod] = ['room', pos, roomSpot + 1];
          this.rooms[pos] = [...this.rooms[pos].slice(0, roomSpot), '.', amphipod, ...this.rooms[pos].slice(roomSpot + 2)];
          lastMove.location = 'room';
          lastMove.pos = 1;
        }
      } else {
        // Moving down in a room
        this.amphipods[amphipod] = ['room', pos, roomSpot - 1];
        this.rooms[pos] = [...this.rooms[pos].slice(0, roomSpot - 1), amphipod, '.', ...this.rooms[pos].slice(roomSpot + 1)];
        lastMove.location = 'room';
        lastMove.pos = 0;
      }
    } else {
      this.hallway[pos] = '.';
      // In hallway
      if (direction === 'left' || direction === 'right') {
        this.hallway[pos + (direction === 'left' ? -1 : 1)] = amphipod;
        this.amphipods[amphipod] = ['hall', pos + (direction === 'left' ? -1 : 1)];
        lastMove.location = 'hall';
        lastMove.pos = pos + (direction === 'left' ? -1 : 1);
      } else {
        // Moving down into a room
        this.amphipods[amphipod] = ['room', (pos - 2) / 2, roomDepth - 1];
        this.rooms[(pos - 2) / 2][roomDepth - 1] = amphipod;
        lastMove.location = 'room';
        lastMove.pos = (pos - 2) / 2;
      }
    }
    this.moves.push(lastMove);
    this.energy += { A: 1, B: 10, C: 100, D: 1000 }[amphipod[0]];
  }

  isRoomAtTheInn(amphipod) {
    const destRoom = destinationRooms[amphipod[0]];
    const [loc, pos] = this.amphipods[amphipod];
    const room = this.rooms[destRoom];
    let nonEmpty;
    for (let i = this.rooms[destRoom].length - 1; i >= 0; i--) {
      if (room[i] === '.') {
        if (nonEmpty) {
          return false;
        }
        continue;
      }
      if (room[i][0] === amphipod[0]) {
        nonEmpty = true;
      } else {
        return false;
      }
    }
    return true;
  }

  validMoves(amphipod) {
    const lastMove = this.moves[this.moves.length - 1];
    const [loc, pos, roomSpot] = this.amphipods[amphipod];
    const aboveRoom = pos / 2 - 1;
    if (loc === 'room' && isDestinationRoom(pos, amphipod)) {
      // If I'm already in the right room and at the bottom or on top of another of the same type, no moves.
      if (roomSpot === 0 || this.rooms[pos].slice(0, roomSpot).every(s => s[0] === amphipod[0])) {
        return [];
      }
      if (this.rooms[pos][roomSpot - 1] === '.') {
        // Needs to move into place
        return ['down'];
      }
      if ((roomSpot === this.rooms[pos].length - 1 && this.hallway[2 * pos + 2] === '.')
        || (roomSpot < this.rooms[pos].length && this.rooms[pos][roomSpot + 1] === '.')) {
        // We need to get out of the way
        return ['up'];
      }
    }

    if (lastMove?.amphipod === amphipod && loc === 'hall' && [2, 4, 6, 8].includes(pos)) {
      // Get into the room
      if (pos === destinationRooms[amphipod[0]] * 2 + 2 && this.isRoomAtTheInn(amphipod)) {
        return ['down'];
      }
      // Can only move left/right in hallway
      return [
        this.hallway[pos - 1] === '.' && (![3, 5, 7, 8].includes(pos) || this.hallway[pos - 2] === '.') ? 'left' : null,
        this.hallway[pos + 1] === '.' && (![1, 3, 5, 7].includes(pos) || this.hallway[pos + 2] === '.') ? 'right' : null,
      ].filter(d => d);
    }

    if (lastMove?.location === 'hall' && [2, 4, 6, 8].includes(lastMove.pos)) {
      // No valid moves, the last move has to be followed by same amphipod
      return [];
    }

    // If this amphipod is in the hallway and the last move was NOT this amphipod, he can only go to the destination room
    if (loc === 'hall' && lastMove?.amphipod !== amphipod) {
      if (this.isRoomAtTheInn(amphipod)) {
        const destSpot = destinationRooms[amphipod[0]] * 2 + 2;
        if (destSpot === pos) {
          // Go into the room
          return ['down'];
        }
        if (pos < destSpot) {
          if (this.hallway.slice(pos + 1, destSpot + 1).every(a => a === '.')) {
            // Go right
            return ['right'];
          }
        } else if (this.hallway.slice(destSpot, pos).every(a => a === '.')) {
          return ['left'];
        }
      }
      // Stuck
      return [];
    }

    if (loc === 'hall' && lastMove?.amphipod === amphipod) {
      if (this.hallway[pos + 1] === '.' && pos + 1 === destinationRooms[amphipod[0]] * 2 + 2 && this.isRoomAtTheInn(amphipod)) {
        return ['right'];
      } else if (this.hallway[pos - 1] === '.' && pos - 1 === destinationRooms[amphipod[0]] * 2 + 2 && this.isRoomAtTheInn(amphipod)) {
        return ['left'];
      }
      return [
        this.hallway[pos - 1] === '.' && lastMove.direction !== 'right' && (![3, 5, 7, 9].includes(pos) || this.hallway[pos - 2] === '.') ? 'left' : null,
        this.hallway[pos + 1] === '.' && lastMove.direction !== 'left' && (![1, 3, 5, 7].includes(pos) || this.hallway[pos - 2] === '.') ? 'right' : null,
      ].filter(d => d);
    }

    if (loc === 'room') {
      // Can we move up?
      if (this.rooms[pos][roomSpot + 1] === '.') {
        return ['up'];
      }
      if (roomSpot === this.rooms[pos].length - 1 && this.hallway[2 * pos + 2] === '.'
        && (this.hallway[2 * pos + 1] === '.' || this.hallway[2 * pos + 3] === '.')) {
        return ['up'];
      }
      return [];
    }

    throw new Error(`Unknown condition: ${amphipod} ${loc}, ${pos}, ${roomSpot} ${JSON.stringify(lastMove)}`);
  }
}

if (new Rooms(test).log() !== test) {
  throw new Error(`Read failed \n${test}\n${new Rooms(test).log()}`);
}

const makePart2 = (input) => {
  const l = input.split('\n');
  return [...l.slice(0, 3), `  #D#C#B#A#
  #D#B#A#C#`, ...l.slice(3)].join('\n');
}

if (new Rooms(makePart2(test)).log() !== `#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########`) {
  throw new Error(`Part 2 test failed`);
}

const solved = `#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########`;

if (!new Rooms(solved).isSolved()) {
  throw new Error('Solved not working');
}

const testRunner = (input, moves) => {
  console.log(input);
  const testRooms = moves
    .reduce((acc, instr) => (acc.push(...instr.slice(1).map(d => [instr[0], d])), acc), [])
    .reduce((r, [amphipod, direction], ix) => {
      if (!r.validMoves(amphipod).includes(direction)) {
        r.validMoves(amphipod);
        console.log(r.log());
        throw new Error(`${ix}: ${amphipod} ${direction} not valid`);
      }
      r.move(amphipod, direction);
      return r;
    }, new Rooms(input));
  if (!testRooms.isSolved()) {
    console.log(testRooms.log());
    throw new Error('Test path failed');
  }
}

// Try and test that the expected valid move exists in the board states.
/*
testRunner(test, [
  ['B2', 'up', 'left', 'left', 'left'],
  ['C', 'up', 'right', 'right', 'down'],
  ['D2', 'up', 'up', 'right'],
  ['B2', 'right', 'down', 'down'],
  ['B', 'up', 'right', 'right', 'down'],
  ['D', 'up', 'left'],
  ['A2', 'up', 'up', 'right'],
  ['D', 'right', 'down', 'down'],
  ['D2', 'right', 'right', 'right', 'down'],
  ['A2', 'left', 'left', 'left', 'left'],
  ['A2', 'left', 'left', 'left', 'down'],
]);

testRunner(makePart2(test), [
  ['D', 'up', 'right', 'right'],
  ['A', 'up', 'up', ...Array(8).fill('left')],
  ['B2', 'up', 'right', 'right', 'right'],
  ['B3', 'up', 'up', 'right'],
  ['A2', 'up', 'up', 'up', ...Array(5).fill('left')],
  ['C', 'up', 'right', 'right', 'down', 'down', 'down'],
  ['C2', 'up', 'up', 'right', 'right', 'down', 'down']
]);
*/

function solve(input, notMoreThan = Infinity) {
  let minSolvedEnergy = notMoreThan;
  const exploring = {};
  let minSolution = null;
  let iter = 0;
  const runner = (rooms, depth) => {
    const vm = Object.keys(rooms.amphipods).sort()
      .reduce((acc, a) => [...acc, ...rooms.validMoves(a).map(m => [a, m])], []);
    for (const move of vm) {
      const newRooms = new Rooms(rooms);
      newRooms.move(...move);
      iter++;
      const solved = newRooms.isSolved();
      if (solved && newRooms.energy < minSolvedEnergy) {
        console.log('Solution', newRooms.energy);
        minSolution = newRooms;
        minSolvedEnergy = newRooms.energy;
      } else if (!solved && newRooms.energy < minSolvedEnergy) {
        const hash = newRooms.hash();
        if (!exploring[hash] || exploring[hash] > newRooms.energy) {
          exploring[hash] = newRooms.energy;
          runner(newRooms, depth + 1);
        }
      }
    }
  }
  runner(new Rooms(input), 0);
  console.log(`Tried ${iter} iterations, min energy`, minSolvedEnergy);
  return minSolvedEnergy;
}

/*
if (solve(test) !== 12521) {
  throw new Error('Test failed');
}

if (solve(makePart2(test)) !== 44169) {
  throw new Error('Test 2 failed');
}

console.log('Part 1', solve(input));
*/
console.log('Part 2', solve(makePart2(input), 54500));
