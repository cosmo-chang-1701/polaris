import { z } from '@/lib/zod-i18n'

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16)
})
