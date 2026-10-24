/*
 * Bağımlılıksız, küçük bir QR kod üreticisi (byte modu, hata düzeltme seviyesi M).
 * Nayuki'nin "QR Code generator" algoritmasını temel alır.
 * Çıktı: SVG path verisi; ürün linkini masaüstünde telefona aktarmak için kullanılır.
 */

const ECC_CODEWORDS_PER_BLOCK_M = [
  -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28,
  28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
];

const NUM_ERROR_CORRECTION_BLOCKS_M = [
  -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23,
  25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
];

// Hata düzeltme seviyesi M'nin format bitleri
const FORMAT_BITS_M = 0;

function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

function numRawDataModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function numDataCodewords(ver: number): number {
  return (
    Math.floor(numRawDataModules(ver) / 8) -
    ECC_CODEWORDS_PER_BLOCK_M[ver] * NUM_ERROR_CORRECTION_BLOCKS_M[ver]
  );
}

function rsMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number): number[] {
  const result: number[] = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = rsMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = rsMultiply(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result: number[] = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] ^= rsMultiply(coef, factor);
    });
  }
  return result;
}

function alignmentPositions(ver: number, size: number): number[] {
  if (ver === 1) return [];
  const numAlign = Math.floor(ver / 7) + 2;
  const step = Math.floor((ver * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
  return result;
}

function utf8Bytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

export type QrMatrix = boolean[][];

export function encodeQr(text: string): QrMatrix {
  const data = utf8Bytes(text);

  // En küçük uygun sürümü bul
  let ver = 1;
  let dataCapacityBits = 0;
  for (; ver <= 40; ver++) {
    dataCapacityBits = numDataCodewords(ver) * 8;
    const ccBits = ver <= 9 ? 8 : 16;
    if (4 + ccBits + data.length * 8 <= dataCapacityBits) break;
  }
  if (ver > 40) throw new Error("QR için metin çok uzun");

  // Bit akışı
  const bits: number[] = [];
  const append = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  append(0x4, 4);
  append(data.length, ver <= 9 ? 8 : 16);
  data.forEach((b) => append(b, 8));
  append(0, Math.min(4, dataCapacityBits - bits.length));
  append(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < dataCapacityBits; pad ^= 0xec ^ 0x11) append(pad, 8);

  const dataCodewords: number[] = new Array(bits.length / 8).fill(0);
  bits.forEach((b, i) => {
    dataCodewords[i >>> 3] |= b << (7 - (i & 7));
  });

  // Hata düzeltme ve harmanlama
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS_M[ver];
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK_M[ver];
  const rawCodewords = Math.floor(numRawDataModules(ver) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);
  const divisor = rsDivisor(blockEccLen);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = dataCodewords.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
    k += dat.length;
    const ecc = rsRemainder(dat, divisor);
    if (i < numShortBlocks) dat.push(0);
    blocks.push(dat.concat(ecc));
  }
  const allCodewords: number[] = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) allCodewords.push(block[i]);
    });
  }

  // Matris
  const size = ver * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const setFunc = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };

  for (let i = 0; i < size; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  const drawFinder = (x: number, y: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) setFunc(xx, yy, dist !== 2 && dist !== 4);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  const alignPos = alignmentPositions(ver, size);
  const numAlign = alignPos.length;
  for (let i = 0; i < numAlign; i++) {
    for (let j = 0; j < numAlign; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === numAlign - 1) || (i === numAlign - 1 && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFunc(alignPos[i] + dx, alignPos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  const drawFormatBits = (mask: number) => {
    const fmt = (FORMAT_BITS_M << 3) | mask;
    let rem = fmt;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const b = ((fmt << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++) setFunc(8, i, getBit(b, i));
    setFunc(8, 7, getBit(b, 6));
    setFunc(8, 8, getBit(b, 7));
    setFunc(7, 8, getBit(b, 8));
    for (let i = 9; i < 15; i++) setFunc(14 - i, 8, getBit(b, i));
    for (let i = 0; i < 8; i++) setFunc(size - 1 - i, 8, getBit(b, i));
    for (let i = 8; i < 15; i++) setFunc(8, size - 15 + i, getBit(b, i));
    setFunc(8, size - 8, true);
  };
  drawFormatBits(0); // geçici; maske seçildikten sonra yeniden yazılır

  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const b = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = getBit(b, i);
      const a = size - 11 + (i % 3);
      const c = Math.floor(i / 3);
      setFunc(a, c, bit);
      setFunc(c, a, bit);
    }
  }

  // Veri modülleri (zikzak)
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && bitIndex < allCodewords.length * 8) {
          modules[y][x] = getBit(allCodewords[bitIndex >>> 3], 7 - (bitIndex & 7));
          bitIndex++;
        }
      }
    }
  }

  const applyMask = (mask: number) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let invert: boolean;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          default: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        }
        if (!isFunction[y][x] && invert) modules[y][x] = !modules[y][x];
      }
    }
  };

  // Basitleştirilmiş ceza puanı: her maske geçerlidir, bu sadece okunabilirliği artırır.
  const penalty = (): number => {
    let score = 0;
    for (let y = 0; y < size; y++) {
      for (const horizontal of [true, false]) {
        let run = 1;
        for (let x = 1; x < size; x++) {
          const cur = horizontal ? modules[y][x] : modules[x][y];
          const prev = horizontal ? modules[y][x - 1] : modules[x - 1][y];
          if (cur === prev) {
            run++;
            if (run === 5) score += 3;
            else if (run > 5) score++;
          } else run = 1;
        }
      }
    }
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const c = modules[y][x];
        if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) score += 3;
      }
    }
    const pattern = [true, false, true, true, true, false, true, false, false, false, false];
    const reversed = [...pattern].reverse();
    for (let y = 0; y < size; y++) {
      for (let x = 0; x + pattern.length <= size; x++) {
        for (const p of [pattern, reversed]) {
          if (p.every((v, i) => modules[y][x + i] === v)) score += 40;
          if (p.every((v, i) => modules[x + i][y] === v)) score += 40;
        }
      }
    }
    let dark = 0;
    modules.forEach((row) => row.forEach((m) => { if (m) dark++; }));
    const total = size * size;
    score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
    return score;
  };

  let bestMask = 0;
  let minPenalty = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(mask);
    drawFormatBits(mask);
    const p = penalty();
    if (p < minPenalty) {
      minPenalty = p;
      bestMask = mask;
    }
    applyMask(mask); // geri al
  }
  applyMask(bestMask);
  drawFormatBits(bestMask);

  return modules;
}

/** QR matrisini, 4 modüllük sessiz alan dahil tek bir SVG path verisine çevirir. */
export function qrToSvgPath(modules: QrMatrix, border = 4): { path: string; size: number } {
  const parts: string[] = [];
  modules.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) parts.push(`M${x + border},${y + border}h1v1h-1z`);
    });
  });
  return { path: parts.join(""), size: modules.length + border * 2 };
}
