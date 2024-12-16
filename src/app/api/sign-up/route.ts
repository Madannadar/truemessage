import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request){
    await dbConnect()

    try{
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.
        findOne({
            username,
            isVerified  : true
        })

        if (existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "user already exists with this email",
                    },
                    {
                        status: 200
                    }
                )
            }else{
                const hasedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000) // add 1 hours in the new date 
                await existingUserByEmail.save() 
            }
        }else{
            const hasedPassword = await bcrypt.hash(password, 10) 
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        // sendVerificationEmail(newUser.email, newUser.verifyCode)

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 200
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "User registerd successfully. please verify your email"
            },
            {
                status: 201
            }
        )

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