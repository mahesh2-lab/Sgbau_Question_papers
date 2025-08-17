import { NextResponse } from "next/server";
import { GetFilesOptions } from "@google-cloud/storage";
import { storage, bucketName } from "@/lib/gcp_bucket";

interface FileMetadata {
  hash: string | null;
  size: string;
  modified: string;
  customMetadata: Record<string, string> | null;
}

interface FileNode {
  [segment: string]: FileNode | FileMetadata;
}

interface FileSystemNode {
  folders: Array<{ id: string; name: string; itemCount: number; path: string }>;
  files: Array<{
    id: string;
    name: string;
    size: string;
    modified: string;
    key: string;
  }>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") || "";

  try {
    const keys = await listAllKeys(bucketName, prefix);
    const fileTree = await buildFileTreeWithMetadata(bucketName, keys);
    const mockFS = flattenTreeToMockFS(fileTree);
    return NextResponse.json({ fileSystem: mockFS });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}

async function listAllKeys(bucketName: string, prefix = ""): Promise<string[]> {
  const bucket = storage.bucket(bucketName);
  let keys: string[] = [];
  let pageToken: string | undefined;

  do {
    const [files, , apiResponse] = await bucket.getFiles({
      prefix,
      pageToken,
      autoPaginate: false,
    } as GetFilesOptions);

    files.forEach((file: { name: string }) => keys.push(file.name));
    pageToken = (apiResponse as { nextPageToken?: string })?.nextPageToken;
  } while (pageToken);

  return keys;
}

async function getFileMetadata(
  bucketName: string,
  key: string
): Promise<FileMetadata> {
  try {
    const file = storage.bucket(bucketName).file(key);
    const [meta] = await file.getMetadata();

    const sizeMB = meta.size
      ? (Number(meta.size) / (1024 * 1024)).toFixed(2) + " MB"
      : "Unknown";
    const modified = meta.updated ? timeAgo(new Date(meta.updated)) : "Unknown";
    const hash = meta.md5Hash || null;
    // GCS custom user metadata lives under meta.metadata (key/value strings)
    let custom: Record<string, string> | null = null;
    if (meta.metadata && typeof meta.metadata === "object") {
      // Filter to only string values to satisfy typing
      custom = Object.fromEntries(
        Object.entries(meta.metadata).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string"
        )
      );
    }

    return { hash, size: sizeMB, modified, customMetadata: custom };
  } catch (err) {
    console.error(`Error fetching metadata for ${key}:`, err);
    return {
      hash: null,
      size: "Unknown",
      modified: "Unknown",
      customMetadata: null,
    };
  }
}

async function buildFileTreeWithMetadata(
  bucketName: string,
  keys: string[]
): Promise<FileNode> {
  const root: FileNode = {};
  const fileKeys = keys.filter((k) => k && !k.endsWith("/"));

  const MAX_CONCURRENCY = 12;
  const metaMap: Record<string, FileMetadata> = {};

  await promisePool(fileKeys, MAX_CONCURRENCY, async (key) => {
    metaMap[key] = await getFileMetadata(bucketName, key);
  });

  for (const key of fileKeys) {
    const parts = key.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      if (!current[part]) {
        current[part] = isFile ? metaMap[key] : {};
      }
      current = current[part] as FileNode;
    }
  }

  return root;
}

function flattenTreeToMockFS(
  tree: FileNode,
  parentPath = ""
): Record<string, FileSystemNode> {
  const result: Record<string, FileSystemNode> = {};

  function helper(node: FileNode, currentPath: string) {
    const folders: FileSystemNode["folders"] = [];
    const files: FileSystemNode["files"] = [];

    for (const [key, value] of Object.entries(node)) {
      const isFile = typeof value === "object" && "hash" in value;
      const fullPath = currentPath === "" ? "/" + key : currentPath + "/" + key;

      if (isFile) {
        const fileMeta = value as FileMetadata;
        files.push({
          id: fileMeta.hash || fullPath,
          name: key,
          size: fileMeta.size,
          modified: fileMeta.modified,
          key: fullPath.startsWith("/") ? fullPath.slice(1) : fullPath,
          // expose user custom metadata if any
          customMetadata: fileMeta.customMetadata || null,
        } as any);
      } else {
        const subTree = helper(value as FileNode, fullPath);
        folders.push({
          id: fullPath,
          name: key,
          itemCount:
            (subTree[fullPath]?.files.length || 0) +
            (subTree[fullPath]?.folders.length || 0),
          path: fullPath,
        });
        Object.assign(result, subTree);
      }
    }

    result[currentPath === "" ? "/" : currentPath] = { folders, files };
    return result;
  }

  return helper(tree, parentPath);
}

async function promisePool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  let i = 0;
  const inFlight: Promise<void>[] = [];
  const runNext = (): Promise<void> => {
    if (i >= items.length) return Promise.resolve();
    const item = items[i++];
    const p: Promise<void> = worker(item)
      .catch((err) => console.error("Worker error", err))
      .then(() => {
        const idx = inFlight.indexOf(p);
        if (idx >= 0) inFlight.splice(idx, 1);
      });
    inFlight.push(p);
    let gate: Promise<void> | undefined;
    if (inFlight.length >= concurrency) {
      gate = Promise.race(inFlight);
    }
    return gate ? gate.then(() => runNext()) : runNext();
  };
  await runNext();
  await Promise.all(inFlight);
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0)
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}
