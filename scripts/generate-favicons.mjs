import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_PATH = "/Users/havan/.gemini/antigravity-ide/brain/a97ee68f-6364-4a9a-88c6-21f23ba10965/.user_uploaded/media_1789576619589.jpg";
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

async function main() {
  console.log("Reading source image:", SOURCE_PATH);
  const sourceBuffer = fs.readFileSync(SOURCE_PATH);

  // 1. Save logo.jpg and logo-sao-truc-au-co.jpg
  await sharp(sourceBuffer)
    .resize(1024, 1024, { fit: "cover" })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(path.join(PUBLIC_DIR, "logo.jpg"));
  console.log("Created public/logo.jpg (1024x1024)");

  await sharp(sourceBuffer)
    .resize(1024, 1024, { fit: "cover" })
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(path.join(PUBLIC_DIR, "logo-sao-truc-au-co.jpg"));
  console.log("Created public/logo-sao-truc-au-co.jpg (1024x1024)");

  // 2. Save icon-512.png & favicon.png
  await sharp(sourceBuffer)
    .resize(512, 512, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-512.png"));
  console.log("Created public/icon-512.png (512x512)");

  await sharp(sourceBuffer)
    .resize(512, 512, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon.png"));
  console.log("Created public/favicon.png (512x512)");

  // 3. Save icon-192.png
  await sharp(sourceBuffer)
    .resize(192, 192, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon-192.png"));
  console.log("Created public/icon-192.png (192x192)");

  // 4. Save apple-touch-icon.png (180x180)
  await sharp(sourceBuffer)
    .resize(180, 180, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("Created public/apple-touch-icon.png (180x180)");

  // 5. Save favicon-144x144.png
  await sharp(sourceBuffer)
    .resize(144, 144, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon-144x144.png"));
  console.log("Created public/favicon-144x144.png (144x144)");

  // 6. Save favicon-96x96.png
  await sharp(sourceBuffer)
    .resize(96, 96, { fit: "cover" })
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon-96x96.png"));
  console.log("Created public/favicon-96x96.png (96x96)");

  // 7. Save favicon-48x48.png
  const png48 = await sharp(sourceBuffer)
    .resize(48, 48, { fit: "cover" })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-48x48.png"), png48);
  console.log("Created public/favicon-48x48.png (48x48)");

  // 8. Save favicon-32x32.png
  const png32 = await sharp(sourceBuffer)
    .resize(32, 32, { fit: "cover" })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-32x32.png"), png32);
  console.log("Created public/favicon-32x32.png (32x32)");

  // 9. Save favicon-16x16.png
  const png16 = await sharp(sourceBuffer)
    .resize(16, 16, { fit: "cover" })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-16x16.png"), png16);
  console.log("Created public/favicon-16x16.png (16x16)");

  // 10. Generate favicon.ico combining 16x16, 32x32, 48x48 PNGs
  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ];

  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * images.length;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // image type: 1 = icon
  header.writeUInt16LE(images.length, 4); // count

  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image
    entry.writeUInt32LE(offset, 12); // offset of image data
    entries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...entries,
    ...images.map((img) => img.buffer),
  ]);

  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuffer);
  console.log("Created public/favicon.ico (multi-res 16, 32, 48)");

  console.log("All logo and favicon assets successfully generated!");
}

main().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
