import {z} from 'zod'

export const signInSchema = z.object({
    indentifier: z.string(),
    password: z.string(),
})