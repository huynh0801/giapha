import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createClient, createPublicClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import sharp from "sharp";

export function isR2Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME &&
    process.env.CLOUDFLARE_R2_PUBLIC_URL
  );
}

let s3ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return s3ClientInstance;
}

export function resetR2ClientInstance(): void {
  s3ClientInstance = null;
}

export function setR2ClientInstance(client: S3Client | null): void {
  s3ClientInstance = client;
}

export interface UploadStorageOptions {
  file: File | { name: string; type: string; arrayBuffer: () => Promise<ArrayBufferLike> } | Buffer | Uint8Array;
  folder: string;
  fileNamePrefix?: string;
  maxDimension?: number;
  quality?: number;
  bucketFallback?: string;
}

export interface StorageResult {
  success: boolean;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}

export interface StorageLocation {
  isSupabase: boolean;
  isR2: boolean;
  bucket: string;
  key: string;
}

export function parseStorageLocation(
  inputPath: string,
  defaultBucket: string = "avatars"
): StorageLocation {
  if (!inputPath) {
    return { isSupabase: false, isR2: false, bucket: defaultBucket, key: "" };
  }

  const trimmed = inputPath.trim();
  const supabaseRegex = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;
  const supabaseMatch = trimmed.match(supabaseRegex);

  if (supabaseMatch) {
    return {
      isSupabase: true,
      isR2: false,
      bucket: supabaseMatch[1],
      key: supabaseMatch[2].replace(/^\/+/, ""),
    };
  }

  if (trimmed.includes(".supabase.co")) {
    try {
      const url = new URL(trimmed);
      const match = url.pathname.match(supabaseRegex);
      if (match) {
        return {
          isSupabase: true,
          isR2: false,
          bucket: match[1],
          key: match[2].replace(/^\/+/, ""),
        };
      }
    } catch {
      // not a full valid URL
    }
  }

  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/+$/, "");
  if (publicBaseUrl && trimmed.startsWith(publicBaseUrl)) {
    const key = trimmed.slice(publicBaseUrl.length).replace(/^\/+/, "");
    return {
      isSupabase: false,
      isR2: true,
      bucket: defaultBucket,
      key,
    };
  }

  return {
    isSupabase: false,
    isR2: false,
    bucket: defaultBucket,
    key: trimmed.replace(/^\/+/, ""),
  };
}

export function extractStoragePath(inputPath: string, bucketFallback: string = "avatars"): string {
  return parseStorageLocation(inputPath, bucketFallback).key;
}

export async function uploadStorageImage(options: UploadStorageOptions): Promise<StorageResult> {
  try {
    const {
      file,
      folder,
      fileNamePrefix = "img",
      maxDimension = 1200,
      quality = 82,
      bucketFallback = "avatars",
    } = options;

    if (!file) {
      return { success: false, error: "Tệp tin ảnh rỗng hoặc không hợp lệ." };
    }

    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file instanceof Uint8Array) {
      buffer = Buffer.from(file.buffer, file.byteOffset, file.byteLength);
    } else if (typeof (file as { arrayBuffer?: () => Promise<ArrayBufferLike> }).arrayBuffer === "function") {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      return { success: false, error: "Định dạng tệp không hợp lệ." };
    }

    if (!buffer || buffer.length === 0) {
      return { success: false, error: "Tệp tin ảnh rỗng hoặc không hợp lệ." };
    }

    // Nén và chuyển đổi sang WebP bằng sharp
    const optimizedBuffer = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 4 })
      .toBuffer();

    const fileName = `${fileNamePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");
    const filePath = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

    if (isR2Configured()) {
      const s3 = getR2Client();
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!.replace(/\/+$/, "");

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: filePath,
          Body: optimizedBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      return {
        success: true,
        publicUrl: `${publicBaseUrl}/${filePath}`,
        filePath,
      };
    }

    // Fallback: Supabase Storage
    let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
    try {
      cookieStore = await cookies();
    } catch {
      // outside request context
    }
    const fallbackStore = {
      getAll: () => [],
      setAll: () => {},
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    const supabase = createClient(cookieStore || fallbackStore);

    const { error: uploadError } = await supabase.storage
      .from(bucketFallback)
      .upload(filePath, optimizedBuffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage fallback error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketFallback).getPublicUrl(filePath);

    return {
      success: true,
      publicUrl,
      filePath,
    };
  } catch (error) {
    console.error("Storage upload exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải ảnh lên kho lưu trữ.",
    };
  }
}

export async function deleteStorageImage(options: {
  filePath: string;
  bucketFallback?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { filePath, bucketFallback = "avatars" } = options;
    if (!filePath) return { success: true };

    const location = parseStorageLocation(filePath, bucketFallback);
    if (!location.key) return { success: true };

    // Legacy Supabase image: Delete from Supabase Storage even when R2 is configured
    if (location.isSupabase) {
      let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
      try {
        cookieStore = await cookies();
      } catch {
        // outside request context
      }
      const fallbackStore = {
        getAll: () => [],
        setAll: () => {},
      } as unknown as Awaited<ReturnType<typeof cookies>>;

      const supabase = createClient(cookieStore || fallbackStore);
      const { error } = await supabase.storage.from(location.bucket).remove([location.key]);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    if (isR2Configured()) {
      const s3 = getR2Client();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          Key: location.key,
        })
      );
      return { success: true };
    }

    let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
    try {
      cookieStore = await cookies();
    } catch {
      // outside request context
    }
    const fallbackStore = {
      getAll: () => [],
      setAll: () => {},
    } as unknown as Awaited<ReturnType<typeof cookies>>;

    const supabase = createClient(cookieStore || fallbackStore);
    const { error } = await supabase.storage.from(location.bucket).remove([location.key]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi khi xóa ảnh.",
    };
  }
}


export interface StorageFileItem {
  key: string;
  name: string;
  url: string;
  size: number;
  lastModified?: string;
  folder: string;
}

export interface ListStorageOptions {
  folder?: string;
  maxKeys?: number;
  continuationToken?: string;
  bucketFallback?: string;
}

export interface ListStorageResult {
  success: boolean;
  files: StorageFileItem[];
  nextContinuationToken?: string;
  isTruncated: boolean;
  error?: string;
}

export async function listStorageFiles(options: ListStorageOptions = {}): Promise<ListStorageResult> {
  try {
    const {
      folder = "",
      maxKeys = 100,
      continuationToken,
      bucketFallback = "avatars",
    } = options;

    const cleanFolder = (folder || "").replace(/^\/+|\/+$/g, "");

    if (isR2Configured()) {
      const s3 = getR2Client();
      const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
      const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL!.replace(/\/+$/, "");

      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: cleanFolder ? `${cleanFolder}/` : undefined,
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken,
      });

      const response = await s3.send(command);
      const contents = response.Contents || [];

      const files: StorageFileItem[] = contents
        .filter((item) => item.Key && !item.Key.endsWith("/"))
        .map((item) => {
          const key = item.Key!;
          const parts = key.split("/");
          const name = parts[parts.length - 1];
          const fileFolder = parts.length > 1 ? parts.slice(0, -1).join("/") : "";
          return {
            key,
            name,
            url: `${publicBaseUrl}/${key}`,
            size: item.Size || 0,
            lastModified: item.LastModified ? (typeof item.LastModified.toISOString === "function" ? item.LastModified.toISOString() : String(item.LastModified)) : undefined,
            folder: fileFolder,
          };
        });

      return {
        success: true,
        files,
        nextContinuationToken: response.NextContinuationToken,
        isTruncated: Boolean(response.IsTruncated),
      };
    }

    // Fallback: Supabase Storage
    let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null;
    try {
      cookieStore = await cookies();
    } catch {
      // outside request context
    }

    const supabase = cookieStore ? createClient(cookieStore) : createPublicClient();
    if (!supabase) {
      return { success: true, files: [], isTruncated: false };
    }

    const { data, error } = await supabase.storage
      .from(bucketFallback)
      .list(cleanFolder || undefined, {
        limit: maxKeys,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return { success: false, files: [], isTruncated: false, error: error.message };
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const cleanSupabaseUrl = supabaseUrl.replace(/\/+$/, "");
    const publicBase = `${cleanSupabaseUrl}/storage/v1/object/public/${bucketFallback}`;

    const files: StorageFileItem[] = (data || [])
      .filter((item) => item.name && item.id)
      .map((item) => {
        const key = cleanFolder ? `${cleanFolder}/${item.name}` : item.name;
        return {
          key,
          name: item.name,
          url: `${publicBase}/${key}`,
          size: (item.metadata as any)?.size || 0,
          lastModified: item.updated_at || item.created_at,
          folder: cleanFolder,
        };
      });

    return {
      success: true,
      files,
      isTruncated: false,
    };
  } catch (err) {
    console.error("List storage files error:", err);
    return {
      success: false,
      files: [],
      isTruncated: false,
      error: err instanceof Error ? err.message : "Không thể lấy danh sách tệp tin.",
    };
  }
}
