import { storage, bucketName } from "@/lib/gcp_bucket";

export async function uploadPDF(
  localFilePath: string,
  destFileName: any,
  customMetadata = {}
) {
  const data = await storage.bucket(bucketName).upload(localFilePath, {
    destination: destFileName + '.pdf',
    metadata: {
      contentType: "application/pdf",
      metadata: customMetadata,
    },
  });

  return {
    success: true,
    url: `https://storage.googleapis.com/${bucketName}/${destFileName}.pdf`,
    message: data,
    fileName: destFileName + '.pdf'
  };
}