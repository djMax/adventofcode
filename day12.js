const buildEdges = (input) => input.split('\n').reduce((edges, line) => {
  const [from, to] = line.split('-');
  edges[from] = edges[from] || [];
  edges[from].push(to);
  edges[to] = edges[to] || [];
  edges[to].push(from);
  return edges;
}, {});

const expand = (edges, from, visited = [from]) => {
  const fullPaths = [];
  edges[from].forEach(to => {
    if (to === 'end') {
      fullPaths.push([...visited, to]);
      return;
    }
    if (to.toUpperCase() === to || !visited.includes(to)) {
      fullPaths.push(...expand(edges, to, [...visited, to]));
    }
  });
  return fullPaths;
};

const test1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

if (expand(buildEdges(test1), 'start').length !== 10) {
  throw new Error('Test 1 failed');
}

const test2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

if (expand(buildEdges(test2), 'start').length !== 19) {
  throw new Error('Test 2 failed');
}

const input = `rf-RL
rf-wz
wz-RL
AV-mh
end-wz
end-dm
wz-gy
wz-dm
cg-AV
rf-AV
rf-gy
end-mh
cg-gy
cg-RL
gy-RL
VI-gy
AV-gy
dm-rf
start-cg
start-RL
rf-mh
AV-start
qk-mh
wz-mh`;

console.log('Part 1', expand(buildEdges(input), 'start').length);

const expandWithRepeat = (edges, from, visited = [from], revisit) => {
  const fullPaths = [];
  edges[from].forEach(to => {
    if (to === 'end') {
      fullPaths.push([...visited, to]);
      return;
    }
    if (to.toUpperCase() === to || !visited.includes(to)) {
      fullPaths.push(...expandWithRepeat(edges, to, [...visited, to], revisit));
    } else if (to.toUpperCase() !== to && !revisit && to !== 'start') {
      fullPaths.push(...expandWithRepeat(edges, to, [...visited, to], to));
    }
  });
  return fullPaths;
};

if (expandWithRepeat(buildEdges(test1), 'start').length !== 36) {
  throw new Error('Test 1 Part 2 failed');
}

if (expandWithRepeat(buildEdges(test2), 'start').length !== 103) {
  throw new Error('Test 2 Part 2 failed');
}

console.log('Part 2', expandWithRepeat(buildEdges(input), 'start').length);
