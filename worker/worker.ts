import { Worker, Job } from "bullmq";
import redis from "../lib/redis";
import type { ProcessJob } from "../lib/queue";
import { uploadPDF } from "@/services/gcpUpload";
import { processPages, runOcrScript } from "@/lib/ocr";
import { metadataToPath } from "@/lib/replaceSpacesInValues";
import { promises as fs } from "fs";

const worker = new Worker<ProcessJob>(
  "myQueue",
  async (job: Job<ProcessJob>) => {
    if (job.name === "uploadPDF") {
      await uploadFile(job.data);
    }
    if (job.name === "processPdf") {
      await ProcessPdf(job.data);
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

async function ProcessPdf(data: ProcessJob) {
  try {
    const result = await runOcrScript(data.filepath);

    if (result.success) {
      let outputPath = "";
      if (result.output) {
        outputPath = metadataToPath(JSON.parse(result.output));
      }

      const response = await processPages(data.filepath, result.output, 'doc-repair');

      if (response.success) {
        const res = await uploadPDF(response.trimmed, outputPath, data.metadata);
        if (res.success) {
          try {
            await fs.unlink(data.filepath);
            if (response.trimmed && response.trimmed !== data.filepath) {
              await fs.unlink(response.trimmed);
            }
            console.log("Source and trimmed files deleted successfully.");
          } catch (err) {
            console.error("Error deleting files:", err);
          }
        } else {
          console.error("Error uploading PDF:", res);
        }
      } else {
        console.error("Error processing pages:", response);
      }
    } else {
      console.error("OCR script failed:", result);
    }
  } catch (err) {
    console.error("Error in ProcessPdf:", err);
  }
}

async function uploadFile(data: ProcessJob) {
  const res = await uploadPDF(data.filepath, data.destination, data.metadata);
  console.log(res);
}
