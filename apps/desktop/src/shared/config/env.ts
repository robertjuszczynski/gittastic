import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  PORT: z
    .string()
    .refine(
      (port) => parseInt(port) > 0 && parseInt(port) < 65536,
      'Invalid port number'
    ),
  GITHUB_CLIENT_ID: z.string(),
  /** Set to "true" to skip the "already onboarded" check on every launch — always opens the onboarding wizard. Dev-only. */
  RESET_ONBOARDING: z.string().optional().transform(value => value === 'true'),
})

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env)
