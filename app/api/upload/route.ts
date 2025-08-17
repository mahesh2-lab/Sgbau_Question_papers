import { NextResponse } from "next/server";
import { myQueue } from "@/lib/queue";
import { downloadFile } from "@/lib/download";
import { decryptText } from "@/lib/crypto";
import { auth } from "@clerk/nextjs/server";
import path from "path";
import { getPdfPageCount } from "@/lib/checkpages";
import { supabase } from "@/lib/supabase";
import {
  metadataToPath,
} from "@/lib/replaceSpacesInValues";
import { addCredit } from "@/services/addCredit";
import { getFileHash } from "@/lib/createhash";

export async function POST(req: Request) {
  const { userId } = await auth();
  const { code, metadata } = await req.json();

  if (!code || !metadata) {
    return NextResponse.json(
      { error: "Missing code or metadata" },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Missing userId" },
      { status: 401 }
    );
  }

  const salt = "maheshchopade133";
  const link = decryptText(code, salt);
  console.log(link);

  const savePath = path.join(process.cwd(), "tmp", `${userId}.pdf`);
  const metadataPath = metadataToPath(metadata);

  const filePathResult = await downloadFile(link, savePath);

  if (!filePathResult.success || !filePathResult.path) {
    return NextResponse.json(
      { error: filePathResult.message || "File download failed" },
      { status: 500 }
    );
  }

  const hash = getFileHash(filePathResult.path);

  const pages = await getPdfPageCount(filePathResult.path);

  const data = await saveToDb(hash, metadata, userId);

  if (!data.success) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  }

  if (pages <= 1) {
    await addCredit(2);

    await myQueue.add("uploadPDF", {
      filepath: filePathResult.path,
      destination: metadataPath,
      metadata: metadata,
    });
  }

  if (pages < 10 && pages > 1) {
    await addCredit(5);

    await myQueue.add("uploadPDF", {
      filepath: filePathResult.path,
      destination: metadataPath,
      metadata: metadata,
    });
  }

  if (pages > 10) {
    await addCredit(10);

    await myQueue.add("processPdf", {
      filepath: filePathResult.path,
      destination: metadataPath,
      metadata: metadata,
    });
  }

  return NextResponse.json(
    {
      success: true,
      message: "Upload successful",
      metadata,
    },
    { status: 200 }
  );
}

async function saveToDb(
  hash: string,
  metadata: Record<string, any>,
  userId: string
) {
  if (!hash || !metadata || !userId) {
    return { success: false, error: "Invalid hash, metadata, or userId" };
  }

  // Check if the hash already exists
  const { data: existing, error: selectError } = await supabase
    .from("material")
    .select("id")
    .eq("hash", hash)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // PGRST116: No rows found
    return {
      success: false,
      error: `Database select failed: ${selectError.message}`,
    };
  }

  if (existing) {
    return { success: false, error: "This file already exists" };
  }

  const { error, data } = await supabase
    .from("material")
    .insert([{ userid: userId, hash: hash, metadata }])
    .select();

  if (error) {
    return {
      success: false,
      error: `Database insert failed: ${error.message}`,
    };
  }

  return { success: true, data };
}
