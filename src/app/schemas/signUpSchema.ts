import exp from 'constants'
import { PassThrough } from 'stream'
import {z} from 'zod'  // this is zod that is required

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(12,"Username must be no more then 12 char")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special char")


export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email address"}),
    password: z.string().min(6,{message:"password must be atleast 6 characters"})
})