const test = `Player 1 starting position: 4
Player 2 starting position: 8`;

const dice = () => {
  let value = 1;
  return (n) => Array(n).fill(0).reduce((a) => a + (value++), 0);;
}

const turn = (state) => {
  [0, 1].map((p) => {
    if (state.scores.find((s => s >= 1000))) {
      return;
    }
    const d = state.dice(3);
    state.rolls += 3;
    state.positions[p] = (state.positions[p] - 1 + d) % 10 + 1;
    state.scores[p] += state.positions[p];
  });
}

const play = (positions) => {
  const state = { scores: [0, 0], rolls: 0, dice: dice(), positions };
  while (!state.scores.find(s => s >= 1000)) {
    turn(state);
  }
  return Math.min(...state.scores) * state.rolls;
}

if (play(test.split('\n').map(l => Number(l.split(': ')[1]))) !== 739785) {
  throw new Error('Test failed');
}

const input = `Player 1 starting position: 10
Player 2 starting position: 9`;

console.log('Part 1', play(input.split('\n').map(l => Number(l.split(': ')[1]))));

const diceRollMultiples = [0, 0, 0, 1n, 3n, 6n, 7n, 6n, 3n, 1n];
const possibleRolls =               [3,  4,  5,  6,  7,  8,  9];

function playRecursive(positions, scores, wins, multiplier = 1n) {
  const memo = {};
  possibleRolls.forEach((r) => {
    const newPositions = [...positions];
    const newScores = [...scores];
    newScores[0] += (newPositions[0] = (newPositions[0] - 1 + r) % 10 + 1);
    if (newScores[0] >= 21) {
      wins[0] += (diceRollMultiples[r] * multiplier);
    } else {
      const newMultiplier = multiplier * diceRollMultiples[r];
      possibleRolls.forEach((r2) => {
        const p2Scores = [...newScores];
        const p2Positions = [...newPositions];
        p2Scores[1] += (p2Positions[1] = (p2Positions[1] - 1 + r2) % 10 + 1);
        if (p2Scores[1] >= 21) {
          wins[1] += (diceRollMultiples[r2] * newMultiplier);
        } else {
          playRecursive(p2Positions, p2Scores, wins, diceRollMultiples[r2] * newMultiplier);
        }
      });
    }
  });
  return wins.reduce((m, v) => m > v ? m : v, 0n);
}

function readAndPlayRecursive(input) {
  const positions = input.split('\n').map(l => Number(l.split(': ')[1]));
  return playRecursive(positions, [0, 0], [0n, 0n]);
}

if (readAndPlayRecursive(test) !== 444356092776315n) {
  throw new Error(`Test failed`);
}

console.log('Part 2', readAndPlayRecursive(input));
