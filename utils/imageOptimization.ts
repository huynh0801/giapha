import sharp from "sharp";

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const WEBP_QUALITY = 78;
const AVATAR_MAX_INPUT_BYTES = 10 * 1024 * 1024;
const AVATAR_WEBP_QUALITY = 82;

export async function optimizeBlogImage(
  file: File,
  options: { maxDimension?: number } = {},
) {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Ảnh upload không được vượt quá 15MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const maxDimension = options.maxDimension ?? 1600;

  const buffer = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
    size: buffer.byteLength,
  };
}

export async function optimizeAvatarImage(
  file: File,
  options: { maxDimension?: number } = {},
) {
  if (file.size > AVATAR_MAX_INPUT_BYTES) {
    throw new Error("Ảnh avatar không được vượt quá 10MB.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const maxDimension = options.maxDimension ?? 600;

  const buffer = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: AVATAR_WEBP_QUALITY, effort: 4 })
    .toBuffer();

  return {
    buffer,
    contentType: "image/webp",
    extension: "webp",
    size: buffer.byteLength,
  };
}
