// Run this through a minifier to get 205 characters!
run = (input) => input.split('\n')
    .reduce((acc, line) => acc + [line.split('')
    .reduce((stack, char, _, chars) => '([{<'.includes(char) ? [...stack, char] : (stack.pop() === '([{<'[')]}>'.indexOf(char)] ? stack : (chars.splice(1), char)), [])]
    .map(e => ({ ')': 3, ']': 57, '}': 1197, '>': 25137 }[e] || 0))[0], 0);

console.log(run(`[({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]`));


