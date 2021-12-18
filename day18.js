// This problem was dumb in its artificial complexity. I adapted someone else's solution.
// https://topaz.github.io/paste/#XQAAAQAkCAAAAAAAAAA0m0pnuFI8czedv0pOqa8ryE8IvQCOve70v4U063sCoYH8nauxbF6kEjGk/4/gX3d1fUdtITCQC+jx+dl5bJNjKtfTh7iefJoueZs2/piV8ucLGX1CFj5A1IOEn3zlNfTq5arkPp98sq/FsB3kRUsSSh7TOLUELWusKAGNL7qaNR/SOY6f958y5uV3k6J8Ltvpcaj2clIIqInC5qL6CnQUOZLBm5GvdgB7BFUDkEWNK1zFged13+hb4Soq9FqkwzOr8PF/Tt3AkR0ftgC7cuHQrbHSGObbvVxCbHu3Q6qoULVUN6G+EO/Lt5u9AtNAczsySXkfM/fmGFZMD3uQVaXLkWLLly78e7Pw7CiepCu9+8h8p2xdJPf8f5ynnNbXc6gyTeOFtq6U/0UcZjJidMDDk8Fu7EBezxL8R6dVrWtxIzCqaId0bpU4H5yHgyM4BXaFVaI90FgoALtRB8+m19yeoaOWalouDNDBkhpkrdZBTZTt+Gc+0tXzvfcI2Von3U//Bk49vh1wQ8RjMGqaD85vIjA8J6IICu5y334TuZ4p/LNNzgN5ZMcKZfQycf2qpeIRxroWMlRUb1rUJiJmvllhZqLey4NqgVE03DHkHKfRtkGjKwxk9mgs0Fz+zKcg39kxPmft/VvoTaQdfFBQJNbkUuRBS0Dk/XDNQhI+7Y9yb0gDp2QDxye3c2dlXgsq2Z46jDUXvSEMB6/TWhVrMOyD3mNVZ3CzO728JapE3/Xexz+ZIhgMEEIHxunmsDsyKJ9obF6NvNctE5LQ3MNqpSgVRMHnrCg2XByAZqexuy0aFJZvvcA/5NHlD9myNcmfzc+9/DPOj5kSe+1byE6pSIEPT5FRM0oGPOviUyxjpUHkhrRsd88IeYZfySF8ehGLMJ2oySEoNFETzE6AxDUOsmDUTsZhe1Lv2zlLK66buYpcgtrKJVpTsCv8/vx/
const test = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

function toAdjacencyArray(value, depth = 0) {
  if (typeof value === 'number') {
    return {
      value,
      depth,
    };
  }
  return value.flatMap((x) => toAdjacencyArray(x, depth + 1));
}

function toValue(node) {
  if (node?.value === 0) {
    return 0;
  }
  return node?.value ?? node.map(toValue);
}

function toTree(array) {
  if (array.length === 2) {
    return toValue(array);
  }
  for (let i = 0; i < array.length - 1; i++) {
    const [{ value: v1, depth: d1 }, { value: v2, depth: d2 }] = array.slice(
      i,
      i + 2
    );
    if (d1 === d2) {
      return toTree([
        ...array.slice(0, i),
        { value: [v1, v2], depth: d1 - 1 },
        ...array.slice(i + 2),
      ]);
    }
  }
  return array;
}

function explode(array) {
  for (let i = 0; i < array.length; i++) {
    const { value, depth } = array[i];
    if (depth > 4) {
      if (i > 0) {
        array[i - 1].value += value;
      }
      if (i < array.length - 2) {
        array[i + 2].value += array[i + 1].value;
      }
      array.splice(i, 2, { value: 0, depth: depth - 1 });
      return true;
    }
  }
  return false;
}

function split(array) {
  for (let i = 0; i < array.length; i++) {
    const { value, depth } = array[i];
    if (value >= 10) {
      array.splice(
        i,
        1,
        { value: Math.floor(value / 2), depth: depth + 1 },
        { value: Math.ceil(value / 2), depth: depth + 1 }
      );
      return true;
    }
  }

  return false;
}

function addition(a, b) {
  return toAdjacencyArray([toTree(a), toTree(b)]);
}

function reducedSum(a, b) {
  const total = addition(a, b);
  while (explode(total) || split(total));
  return total;
}

function run(input) {
  const arrays = input.split('\n').map(eval).map(toAdjacencyArray);
  const total = arrays
    .slice(1)
    .reduce((total, array) => reducedSum(total, array), arrays[0]);

  function magnitude(value) {
    if (typeof value === "number") {
      return value;
    }
    return 3 * magnitude(value[0]) + 2 * magnitude(value[1]);
  }

  return magnitude(toTree(total));
}

function bestPair(input) {
  const lines = input.split('\n');
  let maxMagnitude = 0;
  lines.forEach((l1, ix) => lines.forEach((l2, jx) => {
    if (ix !== jx) {
      maxMagnitude = Math.max(maxMagnitude, run(l1 + '\n' + l2));
    }
  }));
  return maxMagnitude;
}

if (run(test) !== 4140) {
  throw new Error('Test failed');
}

if (bestPair(test) !== 3993) {
  throw new Error('Test failed');
}

const input = `[[6,[[9,4],[5,1]]],[[[6,5],[9,4]],2]]
[[7,3],[[3,[5,5]],8]]
[8,[[5,0],[[0,2],3]]]
[[[8,7],[[2,0],[7,5]]],1]
[[[2,[6,1]],[7,[6,1]]],[[7,3],1]]
[[2,[9,[0,0]]],[[[9,7],1],0]]
[[[[8,4],[2,3]],[[6,4],4]],0]
[[[1,3],1],[[3,8],[[2,3],[9,5]]]]
[[7,[5,9]],[[7,[9,1]],[3,[9,6]]]]
[[[5,3],5],[[[8,8],[5,6]],[6,5]]]
[3,[[4,1],3]]
[[[5,[2,0]],[[9,5],[9,2]]],[[[1,7],[6,9]],[[6,3],[8,6]]]]
[[[[9,3],[2,4]],[6,9]],[[[9,7],1],[[1,9],[2,9]]]]
[3,[[6,1],8]]
[[[[8,8],8],[[3,9],[9,3]]],[[8,8],[[7,1],[6,5]]]]
[[[8,9],[[2,7],6]],[[[2,9],[8,4]],[1,6]]]
[[4,[[4,4],0]],[[8,[1,8]],[9,[7,3]]]]
[[[[3,0],[7,2]],[[9,5],[9,5]]],[5,[0,[5,7]]]]
[5,[1,[[4,0],[8,5]]]]
[[0,0],[[[9,8],1],[[5,2],[4,6]]]]
[[5,8],[6,[[5,2],1]]]
[[1,[[1,4],8]],8]
[[[[1,7],[7,1]],[4,[8,0]]],0]
[[[[5,9],0],[0,8]],[2,[[6,2],2]]]
[2,[4,3]]
[[[[4,0],[2,2]],7],[[8,7],[[8,1],1]]]
[[[[6,0],[1,6]],[2,[6,2]]],[[9,6],[7,[8,2]]]]
[[3,5],[[9,[4,0]],[[6,5],[1,0]]]]
[[[[6,0],7],[8,[0,1]]],[[7,6],[[7,1],[9,6]]]]
[[3,[[6,4],4]],[0,[[3,5],[8,6]]]]
[[8,[[1,8],0]],[1,[[0,1],[6,2]]]]
[[6,[5,[5,4]]],9]
[[[[0,7],3],[[7,7],[1,2]]],[8,[2,1]]]
[[[7,[1,4]],[5,[9,8]]],[1,8]]
[[[0,7],[[3,6],[2,4]]],[[7,4],1]]
[[[5,[8,2]],[[4,9],[5,3]]],4]
[[5,[[3,3],0]],8]
[7,[2,1]]
[[3,8],[[[5,3],8],[[3,4],6]]]
[[[2,[0,9]],[0,5]],0]
[[6,[7,6]],[[[2,6],2],[[8,9],5]]]
[[[0,0],[[1,9],[0,6]]],[[5,[8,8]],[[6,9],[3,7]]]]
[[[[4,6],[8,4]],[2,[3,8]]],[8,0]]
[[0,0],[2,[[6,2],6]]]
[[[6,0],3],8]
[[[[6,1],[4,8]],[2,[3,0]]],7]
[[[0,[1,8]],[[8,1],6]],3]
[2,[0,2]]
[[[[9,6],8],[[1,9],[7,8]]],[[[0,6],[8,8]],[6,[2,3]]]]
[[0,[6,[7,4]]],[[[0,9],[2,3]],[[8,8],0]]]
[[[0,1],[7,[4,9]]],[[3,9],8]]
[[[1,9],7],[[0,5],[5,[7,9]]]]
[[[9,[2,5]],2],[7,[1,[7,7]]]]
[[[[0,4],[7,3]],2],5]
[[8,[7,4]],[[[8,2],[7,3]],[1,[7,8]]]]
[[[0,4],[[3,7],9]],6]
[[5,[[9,2],[7,0]]],[[8,2],[[1,4],9]]]
[2,[[[9,6],9],[2,3]]]
[[5,[[3,5],[3,8]]],[4,[2,9]]]
[[[5,2],[4,[4,1]]],[[[1,0],[8,7]],[[8,7],8]]]
[[4,[4,[0,9]]],[[1,8],4]]
[[[3,[4,0]],[[8,8],[1,6]]],[[4,0],[1,2]]]
[[[1,[1,8]],2],[[6,2],[9,[8,5]]]]
[9,[[[8,8],[8,3]],[3,[1,3]]]]
[[[2,[4,5]],[4,1]],[1,[[8,6],[1,5]]]]
[[0,[5,[7,6]]],[[8,6],[[9,9],1]]]
[[[5,[5,2]],2],[[[1,4],[3,7]],[4,3]]]
[[5,[[9,8],0]],[7,[[0,8],[7,8]]]]
[[[[8,0],6],[2,1]],[[[6,3],[3,1]],[[7,6],[7,2]]]]
[[[3,3],6],[2,[[8,4],5]]]
[[[6,[5,3]],[[6,4],3]],[[[4,8],0],[[0,6],[1,4]]]]
[[[3,[6,4]],2],[[[8,8],4],[[8,6],6]]]
[[[[6,9],1],[3,8]],[[5,[4,6]],2]]
[[5,6],3]
[[[5,[8,6]],[[4,2],[1,1]]],[[[0,7],[6,3]],[9,[7,7]]]]
[[7,[[4,0],6]],[[4,[6,4]],8]]
[[5,[[2,0],[9,4]]],[[[4,6],1],[[2,8],[8,5]]]]
[[[[3,5],[0,4]],[[5,0],3]],[[1,[8,9]],7]]
[[[[6,6],6],[[6,6],[4,3]]],0]
[[5,[2,5]],[6,[[7,8],2]]]
[[[7,[5,5]],[[7,4],[6,7]]],0]
[[[3,3],3],[[1,9],[0,[9,2]]]]
[[9,[4,1]],[6,[2,[9,6]]]]
[[4,7],[9,[3,0]]]
[[[8,2],[[9,8],[4,2]]],[[2,[3,7]],[7,[3,1]]]]
[[[[1,8],2],[0,[6,5]]],[[[2,7],[8,6]],[[8,9],[8,5]]]]
[[[7,[2,9]],[9,0]],5]
[[5,[2,[1,5]]],[0,7]]
[4,[[0,[0,3]],[[0,5],[9,0]]]]
[0,[[4,4],[[8,4],[3,8]]]]
[[[[4,9],0],[[4,4],9]],[[[6,1],[8,9]],[7,[2,3]]]]
[[[[4,2],[7,4]],0],[[5,[0,6]],[[0,5],4]]]
[[[1,0],8],[[[2,8],[2,9]],3]]
[[6,[1,[9,9]]],[2,2]]
[[[8,[6,7]],[6,[6,6]]],[[[2,3],5],0]]
[[[7,[6,9]],[[7,8],[2,8]]],[[4,[5,1]],5]]
[[[[6,3],[1,4]],7],[[9,1],[3,1]]]
[5,[[8,5],[[7,5],4]]]
[[4,[[4,0],0]],[6,[1,1]]]
[[[5,[9,2]],[9,0]],[[5,[5,7]],4]]`;

console.log('Part 1:', run(input));
console.log('Part 2:', bestPair(input));

