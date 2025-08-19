# ---------- Base ----------
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---------- Runner ----------
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy only required files for runtime
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

## Add your environment variables here
# Example:
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmVzb2x2ZWQtc3dhbi02Ni5jbGVyay5hY2NvdW50cy5kZXYk
ENV CLERK_SECRET_KEY=sk_test_bnkxf4TssgBRI8BF0CfWtARrdCfvzV386rvvpy7HeL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
ENV NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
ENV NEXT_PUBLIC_SUPABASE_URL=https://qpwpsejnepuavovtvpfg.supabase.co
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd3BzZWpuZXB1YXZvdnR2cGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDYyMzA1NiwiZXhwIjoyMDcwMTk5MDU2fQ.f4Ah2CXEFFwMjcdHS6RyrOzsC6yJSRf0sjhd-pOgjd0
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwd3BzZWpuZXB1YXZvdnR2cGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MjMwNTYsImV4cCI6MjA3MDE5OTA1Nn0.ZgVSrZDedMbyhaigBi9oXgiQAOccoIWjPkzMjDyH5pI
ENV NEXT_WEBHOOK_SECRET=whsec_hVJQUxrsWl2XnII4Mn9SX3pqoNhmz+Vx
ENV REDIS_URL=rediss://default:AcpcAAIncDE2OTQwOWUyNTJiNDM0YjY2YWI1ZjI5ZmU4MDkzOGNlZnAxNTE4MDQ@relevant-panda-51804.upstash.io:6379
ENV GCP_PROJECT_ID=nice-etching-432519-s0
ENV GCP_CLIENT_EMAIL=836028301992-compute@developer.gserviceaccount.com
ENV GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDtjXxBbDisBx+N\nRpGbQmpvUHIDaXA/zhU23JCMdPObjarWDnN5yFz1FwSZHbUgzAJW2xlg7Un4leoC\na1f1JHWBnzCEi7fEij0WtN9EehBmXtQv/yDigPLy9uwZr6X2yliIhi4njYBiqHTW\n8IyNsyR6SfVVquj79XptklMPieT5X6cdUwB8LcPSM4YxhPX8AS0z+amH88MFrWDY\nbI7ZMGBj6r+sVfp9orlmbr1zuVlD5a+KcqhKFxiESoRuJDcXCD3r+dYEKiDfmhiL\nKES+M9Qh0sbcQNkYej3GINrBwFspJ9XzIcavRQmX8In8DR1pFeyDCDem09MCwWXu\nLliMW2QNAgMBAAECggEAAvS5QJknpWBbUKc5pZxwdZ0jJg64UlruoaWh+NV1uJBN\nOWepoTDQk04rhPo9KEDRoKIOUUnymzDGXixWxlqjSa8g6+1PJpdvxioPAyufq55v\ndn9uudLP8x0GeBVa89S1wFEnHt/gYpnlBk2s+hBqGkl0T5IWXxhBYz6oYO+e1UmI\nx971SAm02B5k8pfekxG3MSopanPimzedgkGZIFxB8pmdsgnL9ZbLgF65BD2h0CXi\np1NjjdpGkgfRBJX+e/y0jrQosxynVsiMviZyZdrFbJWkESht5/pU5WGZiwdzBBx7\nPpQcbjpoqTdr/xmIIJvHTMLvyaQcfiX0n+fl2k5U4QKBgQD7i/rTLMbAckul42o2\n3xi1eLc77W8OwW5DXr/I1uI9S+vlsXVjjcwLNKX7objO3DcPMw0XwPQ/0AXUlguq\nnFm4fUlDAZnzwfNZXs1eDqtFPIltsbLSLc8HUGFFdUIlheSBbWOGqBI2vis5+GOo\niCdVN5R+aLGu9dAamnygTQR48QKBgQDxwhVr8CHU0A53ng3SwIZxfZ7aBrm83f8p\nccsad0apzyWHDqgVy6iBkPznMCF8MNdXSgq5HLse7PdKerOaI/saajoZwK+9iayL\nyPDIJBnQjL3DpcTJGp+jKmjPBOwRDBzDeTtX77SBqd9NBnp0XR21Grh0yMKCxbMN\nh1OewY683QKBgCCVNCswbJo289eMCpEK+t9ewJVRnwYRRiAR4NO6CdoYwHijMOpx\nTpHRAwMCIrcgzTz5xuNhygGOB4NO4Dn8QJ7mE5xLU87AO65C2mUpj0PLoJ2F2/zf\nlCaFYeQmWSgVHNErAy5JDPrsTRsYMoh9AmNGbMSm+QUJsCgSBLya3U5xAoGBAK/J\nRNRAPglE41Acz8ZPkTJSej/kJgfrj45uHJV45xuv8IScpqF6fWMArrPXrnFj/iCN\nSPDCsFjTSxiP0aohwYK6fNae4eo6ggj+Kf4NKewXeiAZl9X2kt8MhjsJRDE9Emkb\n7IeLVz/06dZTAJU948z8yeS42Z5G7GPI44eLDCPNAoGBAKnsZjmFNC2YBXsP03p4\n7sVToRijxFl9P/H8nwriGceflJ/oduPT46su7hbMH3IbbsO0HK1N3USF8VAk3PSK\nGwO7FLyv/6ujkDivk073HYHIiPbBmN/JzIxCFqN9DtEYnDgJnRB1cD+9wtAWe1TX\n0ylYRYvAvXq25Cf6FcQNVw2u\n-----END PRIVATE KEY-----\n"
ENV GCS_BUCKET=sgbau-bucket
ENV CLOUDINARY_CLOUD_NAME=dmeje67pr
ENV CLOUDINARY_API_KEY=253976591379555
ENV CLOUDINARY_API_SECRET=DoQJU_UHS1CCPq9M2mQXUpQI1ms

USER nextjs

EXPOSE 3000
ENV PORT=3000

## Run both Next.js app and worker in parallel
CMD ["sh", "-c", "pnpm start & pnpm tsx worker/worker.ts"]
