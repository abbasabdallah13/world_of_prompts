import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";
import { connectToDB } from "@utils/database";
import User from "@models/UserModel";

const handler  = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({ session }){
            const sessionUser = await User.findOne({
                email: session.user.email
            })
            session.user.id = sessionUser._id.toString();
            return session
    
        },
        async signIn({ profile }){
            try {
                // check if a user already exists
                await connectToDB();
                const userExists = await User.findOne({
                    email: profile.email
                });
    
                // if user doesn't exists create a new user
                if(!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ","").toLowerCase(),
                        image: profile.picture
                    })
                }

                return true;
            } catch (error) {
                console.log(error.message)
                return false;
            }
        }
    }
})

export { handler as GET, handler as POST }