import {z} from "zod"

export const messageschema = z.object({
    content: z
    .string()
    .min(10, {message: "content must be at least of 10 char"})
    .max(300, {message:"content must be no longer then 300 char"})
})