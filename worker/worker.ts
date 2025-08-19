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
        console.log("OCR Result:", result.output);

        outputPath = metadataToPath(result.output);
      }

      const response = await processPages(
        data.filepath,
        result.output,
        outputPath
      );

      if (response.success) {
        console.log(data.filepath);
        
        await fs.unlink(data.filepath);
        console.log("PDF processed successfully:", response);
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
  await fs.unlink(data.filepath);
  console.log(res);
}
