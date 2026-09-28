// Generates clean PNG icons using pure Node.js standard libraries (zlib, fs)
import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, renderPixel) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixel(x, y, width, height);
      scanlines[offset++] = r;
      scanlines[offset++] = g;
      scanlines[offset++] = b;
      scanlines[offset++] = a;
    }
  }

  // IDAT chunk
  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  // CRC32 of type + data
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Draw DJ Emma Pro FX Emblem
function renderEmblem(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const maxR = w * 0.46;

  // Background dark gradient with circular border
  if (r > maxR) {
    return [10, 10, 14, 255]; // Dark background
  }

  // Golden Outer Ring
  if (r > maxR - (w * 0.035)) {
    return [212, 175, 55, 255]; // Gold #D4AF37
  }

  // Inner Glow
  if (r > maxR - (w * 0.05)) {
    return [40, 10, 15, 255];
  }

  // Central Red & Gold Crest
  const relY = (y - cy) / (h * 0.35);
  const relX = Math.abs((x - cx) / (w * 0.35));

  // Crown shape at top
  if (relY < -0.15 && relY > -0.75) {
    if (relX < 0.65 && (relY > -0.25 || (relX < 0.2 && relY > -0.7) || (relX < 0.5 && relY > -0.55))) {
      return [255, 215, 0, 255]; // Bright Gold
    }
  }

  // Red DJ EMMA band in middle
  if (relY >= -0.15 && relY <= 0.3) {
    if (relX < 0.8) {
      return [229, 9, 20, 255]; // Netflix Red #E50914
    }
  }

  // PRO FX golden text area at bottom
  if (relY > 0.3 && relY < 0.65) {
    if (relX < 0.6) {
      return [212, 175, 55, 255]; // Gold
    }
  }

  // Deep velvet black/red inside
  const grad = Math.min(255, Math.floor(40 * (1 - r / maxR)));
  return [grad + 15, 10, 15, 255];
}

const pwa192 = createPng(192, 192, renderEmblem);
const pwa512 = createPng(512, 512, renderEmblem);
const appleTouch = createPng(180, 180, renderEmblem);

fs.writeFileSync('public/pwa-192x192.png', pwa192);
fs.writeFileSync('public/pwa-512x512.png', pwa512);
fs.writeFileSync('public/pwa-maskable-512x512.png', pwa512);
fs.writeFileSync('public/apple-touch-icon.png', appleTouch);

console.log('Successfully generated PWA and Apple Touch icons!');
