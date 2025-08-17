import { Storage, GetFilesOptions, File } from "@google-cloud/storage";
import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// Initialize GCS client
export const storage = new Storage({
  projectId: requireEnv("GCP_PROJECT_ID"),
  credentials: {
    client_email: requireEnv("GCP_CLIENT_EMAIL"),
    private_key: requireEnv("GCP_PRIVATE_KEY").replace(/\\n/g, "\n"),
  },
});

export const bucketName = requireEnv("GCS_BUCKET");