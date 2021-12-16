function* readBytes(input) {
  for (const c of input.split('')) {
    const i = parseInt(c, 16);
    yield i & 8 ? 1 : 0;
    yield i & 4 ? 1 : 0;
    yield i & 2 ? 1 : 0;
    yield i & 1 ? 1 : 0;
  }
}

function* fixedLengthReader(gen, count) {
  for (let i = 0n; i < count; i++) {
    yield gen.next().value;
  }
}

const readBits = (gen, bits, val = 0n) => Array(bits).fill(0).reduce((acc) => {
  const nv = gen.next().value;
  if (nv === undefined) {
    return Number.NaN;
  }
  return (acc * 2n) + BigInt(nv);
}, val);

function runPacket(typeId, containerVersion, packets) {
  const r = { version: packets.reduce((acc, p) => acc + p.version, containerVersion) };
  if (typeId === 0n) {
    r.value = packets.reduce((acc, p) => acc + p.value, 0n);
  } else if (typeId === 1n) {
    r.value = packets.reduce((acc, p) => acc * p.value, 1n);
  } else if (typeId === 2n) {
    r.value = packets.reduce((m, e) => e.value < m ? e.value : m, Infinity);
  } else if (typeId === 3n) {
    r.value = packets.reduce((m, e) => e.value > m ? e.value : m, -Infinity);
  } else if (typeId === 5n) {
    r.value = packets[0].value > packets[1].value ? 1n : 0n;
  } else if (typeId === 6n) {
    r.value = packets[0].value < packets[1].value ? 1n : 0n;
  } else if (typeId === 7n) {
    r.value = packets[0].value === packets[1].value ? 1n : 0n;
  } else {
    throw new Error(`Unknown operation ${typeId}`);
  }
  return r;
}

function readPacket(gen) {
  const version = readBits(gen, 3);
  if (Number.isNaN(version)) {
    return undefined;
  }
  const typeId = readBits(gen, 3);
  if (typeId === 4n) {
    let value = 0n;
    while (gen.next().value) {
      value = readBits(gen, 4, value);
    }
    value = readBits(gen, 4, value);
    return { version, value };
  } else {
    if (!gen.next().value) {
      // Length type 0 - next 15 bits total length in bits
      const len = readBits(gen, 15);
      const child = fixedLengthReader(gen, len);
      const packets = [];
      while (true) {
        const v = readPacket(child);
        if (v === undefined) {
          break;
        }
        packets.push(v);
      }
      return runPacket(typeId, version, packets);
    } else {
      // Length type 1 - next 11 bits number of subpackets
      const pCount = readBits(gen, 11);
      const subpackets = Array(Number(pCount)).fill(0).map(() => readPacket(gen));
      return runPacket(typeId, version, subpackets);
    }
  }
}

if (readPacket(readBytes('D2FE28')).version !== 6n) {
  throw new Error('Test failed')
}

const input = '420D4900B8F31EFE7BD9DA455401AB80021504A2745E1007A21C1C862801F54AD0765BE833D8B9F4CE8564B9BE6C5CC011E00D5C001098F11A232080391521E4799FC5BB3EE1A8C010A00AE256F4963B33391DEE57DA748F5DCC011D00461A4FDC823C900659387DA00A49F5226A54EC378615002A47B364921C201236803349B856119B34C76BD8FB50B6C266EACE400424883880513B62687F38A13BCBEF127782A600B7002A923D4F959A0C94F740A969D0B4C016D00540010B8B70E226080331961C411950F3004F001579BA884DD45A59B40005D8362011C7198C4D0A4B8F73F3348AE40183CC7C86C017997F9BC6A35C220001BD367D08080287914B984D9A46932699675006A702E4E3BCF9EA5EE32600ACBEADC1CD00466446644A6FBC82F9002B734331D261F08020192459B24937D9664200B427963801A094A41CE529075200D5F4013988529EF82CEFED3699F469C8717E6675466007FE67BE815C9E84E2F300257224B256139A9E73637700B6334C63719E71D689B5F91F7BFF9F6EE33D5D72BE210013BCC01882111E31980391423FC4920042E39C7282E4028480021111E1BC6310066374638B200085C2C8DB05540119D229323700924BE0F3F1B527D89E4DB14AD253BFC30C01391F815002A539BA9C4BADB80152692A012CDCF20F35FDF635A9CCC71F261A080356B00565674FBE4ACE9F7C95EC19080371A009025B59BE05E5B59BE04E69322310020724FD3832401D14B4A34D1FE80233578CD224B9181F4C729E97508C017E005F2569D1D92D894BFE76FAC4C5FDDBA990097B2FBF704B40111006A1FC43898200E419859079C00C7003900B8D1002100A49700340090A40216CC00F1002900688201775400A3002C8040B50035802CC60087CC00E1002A4F35815900903285B401AA880391E61144C0004363445583A200CC2C939D3D1A41C66EC40';

const { version, value } = readPacket(readBytes(input));
console.log(`Part 1: ${version}\nPart 2: ${value}`);
