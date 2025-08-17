import { Queue } from "bullmq";
import redis from "./redis";

export interface ProcessJob {
  filepath: string;
  destination: string;
  metadata: Record<string, any>;
}


export const myQueue = new Queue<ProcessJob>("myQueue", { connection: redis });