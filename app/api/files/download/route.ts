import { NextResponse } from "next/server";
import { storage, bucketName } from "@/lib/gcp_bucket";
import { generateSignedReadUrl } from "@/lib/generateSignedUrl";

// GET /api/files/download?key=path/to/file.pdf OR ?id=path-or-hash
// If a hash (md5) is provided via id and not found directly as an object name, this
// implementation will NOT attempt a costly scan. Prefer passing the actual object path as 'key'.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let key = searchParams.get("key") || searchParams.get("id");
    const filename = searchParams.get("filename") || undefined;
    const minutesParam = searchParams.get("minutes");
    const minutes = minutesParam ? parseInt(minutesParam, 10) : 15;

    if (!key) {
      return NextResponse.json(
        { error: "Missing 'key' (or 'id') query parameter" },
        { status: 400 }
      );
    }
    key = key.replace(/^\/+/, "");

    // Cheap existence check – prevents generating signed URL for non-existent object
    const file = storage.bucket(bucketName).file(key);
    const [exists] = await file.exists();
    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { url, expires } = await generateSignedReadUrl(key, minutes, filename);
    return NextResponse.json({ url, expires });
  } catch (err: any) {
    console.error("Download route error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create download URL" },
      { status: 500 }
    );
  }
}
