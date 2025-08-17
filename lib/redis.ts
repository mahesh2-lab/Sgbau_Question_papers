import IORedis from "ioredis";

// BullMQ requires maxRetriesPerRequest to be null for blocking commands used by Workers.
const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export default redis;
