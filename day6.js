/*
// The most readable approach
class Fish {
  constructor(timer) {
    this.timer = timer;
  }

  dayPasses() {
    this.timer -= 1;
    if (this.timer === -1) {
      this.timer = 6;
      return new Fish(8);
    }
  }
}

function simulate(input, days) {
  const fish = input.split(',').map(x => new Fish(parseInt(x)));
  for (let i = 0; i < days; i++) {
    const dayFish = [];
    for (let f of fish) {
      const newFish = f.dayPasses();
      if (newFish) {
        dayFish.push(newFish);
      }
    }
    fish.push(...dayFish);
  }
  return fish.length;
}
*/

/*
// The buffer approach
function makeBuffer(initialState) {
  const fish = Buffer.alloc(initialState.length);
  initialState.forEach((x, i) => fish[i] = x);
  return fish;
}

function simulate(input, days) {
  let fishstore = [makeBuffer(input.split(',').map(Number))];
  for (let day = 1; day <= days; day++) {
    if (day % 100 === 0) {
      console.log('DAY', day);
    }
    const newFish = [];
    fishstore.forEach((fishtank) => {
      for (let f = 0; f < fishtank.length; f++) {
        if (fishtank[f] === 0) {
          fishtank[f] = 6;
          newFish.push(8);
        } else {
          fishtank[f] -= 1;
        }
      }
    });
    if (newFish.length) {
      console.log('NEW FISH', newFish.length);
      fishstore.push(makeBuffer(newFish));
    }
  }
  return fishstore.reduce((acc, fishtank) => acc + fishtank.length, 0);
}
*/

// The "cattle not pets" approach which is obviously the right one.
const simulate = (input, days) => Array(days).fill(0)
  .reduce((prev) => {
    prev[8] = prev.shift();
    prev[6] += prev[8];
    return prev;
  }, input.split(',').reduce((states, fish) => { states[fish] += 1; return states }, Array(9).fill(0)))
  .reduce((acc, x) => acc + x, 0);

const test = `3,4,3,1,2`;
if (simulate(test, 18) !== 26) {
  throw new Error(`Test failed. Expected: 26, got: ${simulate(test, 18)}`);
}
if (simulate(test, 80) !== 5934) {
  throw new Error(`Test failed. Expected 5934, got: ${simulate(test, 80)}`);
}

const input = `1,1,1,2,1,5,1,1,2,1,4,1,4,1,1,1,1,1,1,4,1,1,1,1,4,1,1,5,1,3,1,2,1,1,1,2,1,1,1,4,1,1,3,1,5,1,1,1,1,3,5,5,2,1,1,1,2,1,1,1,1,1,1,1,1,5,4,1,1,1,1,1,3,1,1,2,4,4,1,1,1,1,1,1,3,1,1,1,1,5,1,3,1,5,1,2,1,1,5,1,1,1,5,3,3,1,4,1,3,1,3,1,1,1,1,3,1,4,1,1,1,1,1,2,1,1,1,4,2,1,1,5,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,5,1,1,1,1,3,1,1,1,1,1,3,4,1,2,1,3,2,1,1,2,1,1,1,1,4,1,1,1,1,4,1,1,1,1,1,2,1,1,4,1,1,1,5,3,2,2,1,1,3,1,5,1,5,1,1,1,1,1,5,1,4,1,2,1,1,1,1,2,1,3,1,1,1,1,1,1,2,1,1,1,3,1,4,3,1,4,1,3,2,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,2,1,5,1,1,1,1,2,1,1,1,3,5,1,1,1,1,5,1,1,2,1,2,4,2,2,1,1,1,5,2,1,1,5,1,1,1,1,5,1,1,1,2,1`;
console.log('Part 1', simulate(input, 80));

if (simulate(test, 256) !== 26984457539) {
  throw new Error('Test failed. Expected 26984457539, got: ' + simulate(test, 256));
}

console.log('Beginning part 2');
console.log('Part 2', simulate(input, 256));
