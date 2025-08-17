import { storage, bucketName } from "@/lib/gcp_bucket";

/**
 * Generate a signed READ URL for a GCS object.
 * @param objectName Full path of object inside the bucket (no leading slash)
 * @param minutes Expiry in minutes (default 15, clamped 1..1440)
 * @param downloadFilename If provided, sets Content-Disposition attachment
 */
export async function generateSignedReadUrl(
  objectName: string,
  minutes = 15,
  downloadFilename?: string
): Promise<{ url: string; expires: number }> {
    
  const safeMinutes = Math.min(1440, Math.max(1, minutes || 15));
  const expires = Date.now() + safeMinutes * 60 * 1000;

  const [url] = await storage
    .bucket(bucketName)
    .file(objectName)
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires,
      responseDisposition: downloadFilename
        ? `attachment; filename="${downloadFilename.replace(/"/g, "")}"`
        : undefined,
    });
  return { url, expires };
}
