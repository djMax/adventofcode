const test = `target area: x=20..30, y=-10..-5`;

function getEvaluator(input) {
  const [xRange, yRange] = input.split(':')[1].split(',').map(c => c.split('=')[1].split('..').map(Number));
  const xMin = Math.min(...xRange), xMax = Math.max(...xRange);
  const yMin = Math.min(...yRange), yMax = Math.max(...yRange);
  const fn = (x, y) => {
    if (x > xMax || y < yMin) {
      return false;
    } else if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      return true;
    }
    return undefined;
  }
  fn.range = [[xMin, yMin], [xMax, yMax]];
  return fn;
}

function tryPath(xVelocity, yVelocity, evaluator) {
  let x = 0, y = 0, steps = 0;
  let maxY = 0;
  while (evaluator(x, y) === undefined) {
    x += xVelocity;
    y += yVelocity;
    maxY = Math.max(maxY, y);
    if (xVelocity > 0) {
      xVelocity--;
    } else if (xVelocity < 0) {
      xVelocity++;
    }
    yVelocity -= 1;
    steps ++;
  }
  return evaluator(x, y) ? maxY : -steps;
}

function maxHeight(input) {
  const evaluator = getEvaluator(input);
  let yVelocity = Math.max(...[Math.abs(evaluator.range[0][1]), Math.abs(evaluator.range[1][1])]);
  while (true) {
    for (let xVelocity = 1; xVelocity <= evaluator.range[1][0]; xVelocity += 1) {
      const maxY = tryPath(xVelocity, yVelocity, evaluator);
      if (maxY >= 0) {
        return [xVelocity, yVelocity, maxY];
      }
    }
    yVelocity--;
  }
}

function totalPaths(input) {
  const evaluator = getEvaluator(input);
  const yMax = Math.max(...[Math.abs(evaluator.range[0][1]), Math.abs(evaluator.range[1][1])]);
  let total = 0;
  for (let xV = 1; xV <= evaluator.range[1][0]; xV++) {
    for (let yV = evaluator.range[0][1]; yV <= yMax; yV++) {
      if (tryPath(xV, yV, evaluator) >= 0) {
        total++;
      }
    }
  }
  return total;
}

if (maxHeight(test)[2] !== 45) {
  throw new Error('Test Failed');
}

const input = 'target area: x=155..215, y=-132..-72';
console.log('Part 1', maxHeight(input)[2]);

if (totalPaths(test) !== 112) {
  throw new Error('Test Failed');
}

console.log('Part 2:', totalPaths(input));
