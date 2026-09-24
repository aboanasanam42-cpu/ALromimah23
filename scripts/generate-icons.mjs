import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function createPng(width, height, pixelFn) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit depth
  ihdr[9] = 6; // color type 6: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines: each row has 1 filter byte (0) + width * 4 bytes RGBA
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter byte None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Drawer Function
function drawAppIcon(isMaskable) {
  return (x, y, w, h) => {
    // Normalized coordinates -1 to 1
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const dist = Math.sqrt(nx * nx + ny * ny);

    // Corner rounding for standard icons (squircle-like if not maskable)
    if (!isMaskable) {
      const cornerR = 0.82;
      const ax = Math.abs(nx);
      const ay = Math.abs(ny);
      if (Math.pow(ax, 5) + Math.pow(ay, 5) > 0.95) {
        return [0, 0, 0, 0]; // transparent outside rounded corner
      }
    }

    // Deep rich emerald/indigo background gradient
    const gradFactor = (ny + 1) * 0.5;
    let r = Math.round(6 * (1 - gradFactor) + 20 * gradFactor);
    let g = Math.round(78 * (1 - gradFactor) + 25 * gradFactor);
    let b = Math.round(59 * (1 - gradFactor) + 65 * gradFactor);

    // Subtle glowing ring
    const ringDist = Math.abs(dist - 0.72);
    if (ringDist < 0.04) {
      const glow = (1 - ringDist / 0.04) * 0.45;
      r = Math.min(255, r + Math.round(52 * glow));
      g = Math.min(255, g + Math.round(211 * glow));
      b = Math.min(255, b + Math.round(153 * glow));
    }

    // Draw stylized 'M' geometry centered:
    // Scale coordinates inside safe area
    const scale = isMaskable ? 1.5 : 1.25;
    const mx = nx * scale;
    const my = ny * scale;

    // Check if pixel is part of stylized M
    let isM = false;
    let isGoldSparkle = false;

    // Left stem: mx around -0.45, my from -0.35 to 0.45
    if (mx >= -0.52 && mx <= -0.36 && my >= -0.45 && my <= 0.45) isM = true;
    // Right stem: mx around +0.45
    if (mx >= 0.36 && mx <= 0.52 && my >= -0.45 && my <= 0.45) isM = true;

    // Diagonal left: from (-0.45, -0.45) to (0, 0.15)
    // equation: my - (-0.45) = (0.60 / 0.45) * (mx - (-0.45)) => my = 1.33 * mx + 0.15
    const diagLeftDist = Math.abs(my - (1.33 * mx + 0.15));
    if (diagLeftDist < 0.12 && mx >= -0.45 && mx <= 0.05 && my >= -0.45 && my <= 0.25) isM = true;

    // Diagonal right: from (0, 0.15) to (0.45, -0.45)
    // equation: my = -1.33 * mx + 0.15
    const diagRightDist = Math.abs(my - (-1.33 * mx + 0.15));
    if (diagRightDist < 0.12 && mx >= -0.05 && mx <= 0.45 && my >= -0.45 && my <= 0.25) isM = true;

    // Sparkle diamond at center top (mx: 0, my: -0.4)
    const spX = Math.abs(mx);
    const spY = Math.abs(my - (-0.42));
    if (spX * 1.5 + spY < 0.14) {
      isGoldSparkle = true;
    }

    if (isGoldSparkle) {
      return [251, 191, 36, 255]; // Golden Amber Sparkle
    }

    if (isM) {
      // Emerald to Cyan gradient
      const mGrad = (mx + 0.5);
      const mr = Math.round(52 + mGrad * 20);
      const mg = Math.round(211 - mGrad * 10);
      const mb = Math.round(153 + mGrad * 80);
      return [mr, mg, mb, 255];
    }

    return [r, g, b, 255];
  };
}

fs.mkdirSync('./public', { recursive: true });

console.log('Generating PWA icons...');
fs.writeFileSync('./public/pwa-192x192.png', createPng(192, 192, drawAppIcon(false)));
fs.writeFileSync('./public/pwa-512x512.png', createPng(512, 512, drawAppIcon(false)));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPng(512, 512, drawAppIcon(true)));
fs.writeFileSync('./public/apple-touch-icon.png', createPng(180, 180, drawAppIcon(false)));
fs.writeFileSync('./public/favicon-32x32.png', createPng(32, 32, drawAppIcon(false)));
fs.writeFileSync('./public/favicon-16x16.png', createPng(16, 16, drawAppIcon(false)));
fs.writeFileSync('./public/favicon.ico', createPng(32, 32, drawAppIcon(false)));

console.log('Successfully generated all PWA icons in ./public');
