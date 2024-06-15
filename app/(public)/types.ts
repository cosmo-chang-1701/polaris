import { z } from '@/lib/zod-i18n'
import { formSchema } from './schemas'

export type UseFormActionFormSchema = z.infer<typeof formSchema>
