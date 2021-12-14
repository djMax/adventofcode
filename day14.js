const test = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

/*
 * This will not scale to 2^40...

function run(input, rounds) {
  const [template, rules] = input.split('\n\n').map((inp, ix) => ix ? inp.split('\n').map(s => s.split(' -> ')) : inp.trim());
  let current = template.split('');

  for (let round = 0; round < rounds; round += 1) {
    for (let i = 0; i < current.length; i += 1) {
      const pair = current.slice(i, i + 2).join('');
      const rule = rules.find(([r]) => r === pair);
      if (rule) {
        current = [...current.slice(0, i + 1), rule[1], ...current.slice(i + 1)];
        i += 1;
      }
    }
    console.log('Round', round + 1, current.length);
  }
  return current;
}

function countLetters(letters) {
  return letters.reduce((acc, c) => {
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
}

function answer(instructions, rounds) {
  const sorted = Object.values(countLetters(run(instructions, rounds))).sort((a, b) => b - a);
  return sorted[0] - sorted[sorted.length - 1];
}

if (run(test, 5).length !== 97) {
  throw new Error('Test failed');
}

if (run(test, 10).length !== 3073) {
  throw new Error('Test failed');
}

const testRun = countLetters(run(test, 10));
if (testRun.B !== 1749 || testRun.C !== 298) {
  throw new Error('Test failed');
}
*/

function answer(instructions, rounds) {
  const inc = (map, k, v = 1) => (map[k] = (map[k] || 0) + v, map);
  const [template, rules] = instructions.split('\n\n').map((inp, ix) => ix ? inp.split('\n').map(s => s.split(' -> ')) : inp.trim());
  const frequency = Object.values(Object.entries(new Array(rounds).fill(0).reduce((pairs) => {
    const updated = { ...pairs };
    rules.forEach(([from, to]) => {
      const existing = pairs[from];
      if (existing) {
        updated[from] -= existing;
        inc(updated, from[0] + to, existing);
        inc(updated, to + from[1], existing);
      }
    });
    return updated;
  }, new Array(template.length - 1).fill(0).reduce((acc, _, ix) => inc(acc, template.substring(ix, ix + 2)), {})))
    .reduce((acc, [pair, count]) => inc(acc, pair[0], count), { [template[template.length - 1]]: 1 }))
    .sort((a, b) => b - a)
    .filter(a => a);
  return frequency[0] - frequency[frequency.length - 1];
}

if (answer(test, 10) !== 1588) {
  console.log('Test failed');
}

const input = `SCSCSKKVVBKVFKSCCSOV

CP -> C
SF -> S
BH -> F
SS -> N
KB -> N
NO -> N
BP -> F
NK -> P
VP -> H
OF -> O
VH -> O
FV -> F
OP -> V
FP -> B
VB -> B
OK -> S
BS -> B
SK -> P
VV -> H
PC -> S
HV -> K
PS -> N
VS -> O
HF -> B
SV -> C
HP -> O
NF -> V
HB -> F
VO -> B
VN -> N
ON -> H
KV -> K
OV -> F
HO -> H
NB -> K
CB -> F
FF -> H
NH -> F
SN -> N
PO -> O
PH -> C
HH -> P
KF -> N
OH -> N
KS -> O
FH -> H
CC -> F
CK -> N
FC -> F
CF -> H
HN -> B
OC -> F
OB -> K
FO -> P
KP -> N
NC -> P
PN -> O
PV -> B
CO -> C
CS -> P
PP -> V
FN -> B
PK -> C
VK -> S
HS -> P
OS -> N
NP -> K
SB -> F
OO -> F
CV -> V
BB -> O
SH -> O
NV -> N
BN -> C
KN -> H
KC -> C
BK -> O
KO -> S
VC -> N
KK -> P
BO -> V
BC -> V
BV -> H
SC -> N
NN -> C
CH -> H
SO -> P
HC -> F
FS -> P
VF -> S
BF -> S
PF -> O
SP -> H
FK -> N
NS -> C
PB -> S
HK -> C
CN -> B
FB -> O
KH -> O`;

console.log('Part 1', answer(input, 10));
console.log('Part 2', answer(input, 40));
