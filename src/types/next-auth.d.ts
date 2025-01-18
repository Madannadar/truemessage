import 'next-auth'

declare module 'next-auth' {
    interface User{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }
}