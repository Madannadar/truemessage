// all the providers are in this file email provider github providr 
// matlab login with github email jo bhi h wo idar writen hota h

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
// import Email from 'next-auth/providers/email';


export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        id: 'credentials',
        name: 'credentials',
        credentials: {
                Email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try{
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error('User not found')
                    }
                    if(!user.isVerified){
                        throw new Error('User not verified')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    } else{
                        throw new Error('Invalid credentials')
                    }
                }
                catch(err : any ){
                    throw new Error(err)
                }
           }
        })
    ],
    callbacks:{
        async session({session, token}){
            return session
        },
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }

            return token
        },
    },
    pages:{
        signIn: '/sign-in', // overwriting signin
    },
    session:{ 
        strategy:"jwt"  // jiske pas bhi token wo he login kar sakta h
    },
    secret: process.env.NEXTAUTH_SECRET,
}