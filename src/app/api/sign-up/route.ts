import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
 // npm i bcryptjs
import bcrypt from 'bcryptjs'
import { Imprima } from "next/font/google";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try{
        const {username, email, password} = await request.json()
    }catch(errror){
        console.error("erro registering user",errror)
        return Response.json(
            {
                success: false,
                message: "error registering user"
            },
            {
                status: 500
            }
        )
    }
}